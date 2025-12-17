import FeatureFlag from "../models/featureFlag.model.js";
import Project from "../models/project.model.js";
import OrgMember from "../models/orgmember.model.js";

/* CREATE FLAG */
export const createFlag = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    if (!projectId)
      return res.status(400).json({ message: "Project ID required" });

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const membership = await OrgMember.findOne({
      userId,
      orgId: project.orgId
    });

    if (!membership)
      return res.status(403).json({ message: "Access denied" });

    const flag = await FeatureFlag.create({
      ...req.body,
      projectId,
      createdBy: userId
    });

    return res.status(201).json({ flag });

  } catch (error) {
    console.error("CREATE FLAG ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* GET FLAGS */
export const getFlags = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const membership = await OrgMember.findOne({
      userId,
      orgId: project.orgId
    });

    if (!membership)
      return res.status(403).json({ message: "Access denied" });

    const flags = await FeatureFlag.find({ projectId });

    return res.status(200).json({ flags });

  } catch (error) {
    console.error("GET FLAGS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* UPDATE FLAG */
export const updateFlag = async (req, res) => {
  try {
    const { projectId, flagId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const membership = await OrgMember.findOne({
      userId,
      orgId: project.orgId
    });

    if (!membership)
      return res.status(403).json({ message: "Access denied" });

    const flag = await FeatureFlag.findOneAndUpdate(
      { _id: flagId, projectId },
      {
        enabled: req.body.enabled,
        rollout: req.body.rollout,
        rules: req.body.rules,
        defaultValue: req.body.defaultValue
      },
      { new: true }
    );

    if (!flag)
      return res.status(404).json({ message: "Flag not found" });

    return res.status(200).json({ flag });

  } catch (error) {
    console.error("UPDATE FLAG ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* ARCHIVE FLAG (SOFT DELETE) */
export const archiveFlag = async (req, res) => {
  try {
    const { projectId, flagId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const membership = await OrgMember.findOne({
      userId,
      orgId: project.orgId
    });

    if (!membership)
      return res.status(403).json({ message: "Access denied" });

    const flag = await FeatureFlag.findOneAndUpdate(
      { _id: flagId, projectId },
      { enabled: false },
      { new: true }
    );

    if (!flag)
      return res.status(404).json({ message: "Flag not found" });

    return res.status(200).json({ message: "Flag archived" });

  } catch (error) {
    console.error("ARCHIVE FLAG ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
