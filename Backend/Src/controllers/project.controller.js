import Project from "../models/project.model.js";
import OrgMember from "../models/orgmember.model.js";

/* CREATE PROJECT */
export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required"
      });
    }

    const userId = req.user.id;

    const membership = await OrgMember.findOne({ userId });
    if (!membership) {
      return res.status(403).json({
        message: "User does not belong to any organization"
      });
    }

    const project = await Project.create({
      name,
      orgId: membership.orgId,
      createdBy: userId
    });

    return res.status(201).json({
      message: "Project created successfully",
      project
    });

  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

/* GET PROJECTS */
export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await OrgMember.find({ userId });
    if (!memberships.length) {
      return res.status(403).json({
        message: "User does not belong to any organization"
      });
    }

    const orgIds = memberships.map(m => m.orgId);

    const projects = await Project.find({
      orgId: { $in: orgIds }
    });

    return res.status(200).json({
      projects
    });

  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
