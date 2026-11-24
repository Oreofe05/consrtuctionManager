import Project from "../models/Project.js";

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      location,
      category,
      status,
      progress,
      budget,
      spent,
      manager,
      startDate,
      endDate,
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const exists = await Project.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Project code already exists" });
    }

    const project = await Project.create({
      name,
      code: code.toUpperCase(),
      description,
      location,
      category,
      status,
      progress,
      budget,
      spent,
      manager,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fields = [
      "name",
      "code",
      "description",
      "location",
      "category",
      "status",
      "progress",
      "budget",
      "spent",
      "manager",
      "startDate",
      "endDate",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] =
          field === "code" ? String(req.body[field]).toUpperCase() : req.body[field];
      }
    });

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};