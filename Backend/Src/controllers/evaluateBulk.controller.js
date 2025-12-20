import FeatureFlag from "../models/featureFlag.model.js";
import { evaluateFlag } from "../services/flagEvaluator.js";

export const evaluateBulk = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { flags, ...context } = req.body;

    if (!Array.isArray(flags) || flags.length === 0) {
      return res.status(400).json({ message: "flags array is required" });
    }

    const flagDocs = await FeatureFlag.find({
      projectId,
      key: { $in: flags }
    });

    const result = {};

    for (const flag of flagDocs) {
      result[flag.key] = evaluateFlag(flag, context);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
