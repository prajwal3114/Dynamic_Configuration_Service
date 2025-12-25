import FeatureFlag from "../models/featureFlag.model.js";
import { evaluateFlag } from "../services/flagEvaluator.js";
import redisClient from "../config/redis.js";

export const evaluate = async (req, res) => {
  const { projectId, flagKey } = req.params;
  const context = req.body;
  const userId = context.userId;

  const cacheKey = `flag:${projectId}:${flagKey}:${userId}`;

  /* 1. Try Redis cache */
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis GET failed:", err.message);
  }

  try {
    /* 2. DB lookup */
    const flagData = await FeatureFlag.findOne({
      projectId,
      key: flagKey
    });

    if (!flagData) {
      return res.status(404).json({ message: "Flag not found" });
    }

    /* 3. Evaluate */
    const result = evaluateFlag(flagData, context);

    /* 4. Save to Redis (TTL = 60s) */
    try {
      await redisClient.set(
        cacheKey,
        JSON.stringify(result),
        { EX: 60 }
      );
    } catch (err) {
      console.error("Redis SET failed:", err.message);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("Evaluate error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
