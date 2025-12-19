import FeatureFlag from "../models/featureFlag.model.js";
import { evaluateFlag } from "../services/flagEvaluator.js";

export const evaluate = async (req, res) => {
  try {
    const { projectId, flagKey } = req.params, context = req.body;
    const flagData = await FeatureFlag.findOne({ projectId, key: flagKey });
    if (!flagData){
        return res.status(404).json({ message: "Flag not found" });
    } 
    return res.status(200).json(evaluateFlag(flagData, context));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
