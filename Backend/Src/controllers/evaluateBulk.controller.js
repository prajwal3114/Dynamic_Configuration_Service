import FeatureFlag from "../models/featureFlag.model.js";
import { evaluateFlag } from "../services/flagEvaluator.js";
import redisClient from "../config/redis.js";

export const evaluateBulk = async (req, res) => {
  const { projectId } = req.params;
  const { flags, ...context } = req.body;
  const userId = context.userId;

  if (!Array.isArray(flags) || flags.length === 0) {
    return res.status(400).json({ message: "flags array is required" });
  }

  const result = {};
  const missingFlags = [];

  /* 1. Redis lookup */
  for (const flagKey of flags) {
    const cacheKey = `flag:${projectId}:${flagKey}:${userId}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        result[flagKey] = JSON.parse(cached);
      } else {
        missingFlags.push(flagKey);
      }
    } catch (err) {
      missingFlags.push(flagKey); // Redis failure → fallback
    }
  }

  /* 2. DB fetch only for cache misses */
  if (missingFlags.length > 0) {
    const dbFlags = await FeatureFlag.find({
      projectId,
      key: { $in: missingFlags }
    });

    const dbFlagMap = new Map();
    for (const flag of dbFlags) {
      dbFlagMap.set(flag.key, flag);
    }

    for (const flagKey of missingFlags) {
      const flag = dbFlagMap.get(flagKey);

      if (!flag) {
        result[flagKey] = { error: "FLAG_NOT_FOUND" };
        continue;
      }

      const evaluation = evaluateFlag(flag, context);
      result[flagKey] = evaluation;

      const cacheKey = `flag:${projectId}:${flagKey}:${userId}`;
      try {
        await redisClient.set(
          cacheKey,
          JSON.stringify(evaluation),
          { EX: 60 }
        );
      } catch (err) {
        /* ignore cache failure */
      }
    }
  }

  return res.status(200).json(result);
};
