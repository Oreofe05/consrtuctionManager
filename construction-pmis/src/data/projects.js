const defaultProjects = [
  {
    id: "UI-ENG-001",
    name: "Faculty of Engineering Renovation",
    code: "UI-ENG-001",
    category: "Renovation",
    location: "Engineering Complex",
    description:
      "Renovation and modernization of selected facilities within the Faculty of Engineering.",
    status: "On Track",
    progress: 78,
    budget: 48500000,
    spent: 32450000,
    startDate: "2026-06-10",
    endDate: "2026-11-18",
    manager: "Mr. Adewale Ogun",
    team: ["AO", "PM", "SE"],
  },
  {
    id: "UI-HOS-002",
    name: "Student Accommodation Block C",
    code: "UI-HOS-002",
    category: "New Construction",
    location: "Halls of Residence",
    description:
      "Development of a new student accommodation block with supporting facilities.",
    status: "At Risk",
    progress: 54,
    budget: 86200000,
    spent: 58700000,
    startDate: "2026-03-15",
    endDate: "2026-12-04",
    manager: "Mrs. Tola Williams",
    team: ["PM", "FO", "SE"],
  },
  {
    id: "UI-LIB-003",
    name: "Central Library Extension",
    code: "UI-LIB-003",
    category: "Expansion",
    location: "Main Library",
    description:
      "Extension of the central library to provide additional academic and research spaces.",
    status: "Delayed",
    progress: 31,
    budget: 72800000,
    spent: 42100000,
    startDate: "2026-02-20",
    endDate: "2026-10-28",
    manager: "Engr. Ibrahim Musa",
    team: ["AO", "SE"],
  },
  {
    id: "UI-SCI-004",
    name: "Science Complex Development",
    code: "UI-SCI-004",
    category: "New Construction",
    location: "Science Faculty",
    description:
      "Construction of a modern science complex with laboratories and teaching facilities.",
    status: "On Track",
    progress: 64,
    budget: 115400000,
    spent: 74600000,
    startDate: "2026-04-05",
    endDate: "2027-01-22",
    manager: "Dr. Samuel Okafor",
    team: ["PM", "SE", "FO"],
  },
  {
    id: "UI-ADM-005",
    name: "Administrative Block Renovation",
    code: "UI-ADM-005",
    category: "Renovation",
    location: "Administrative Area",
    description:
      "Renovation of offices and administrative facilities.",
    status: "Completed",
    progress: 100,
    budget: 34600000,
    spent: 34600000,
    startDate: "2026-01-12",
    endDate: "2026-09-30",
    manager: "Mr. Adewale Ogun",
    team: ["AO", "PM"],
  },
  {
    id: "UI-LAB-006",
    name: "Computer Laboratory Upgrade",
    code: "UI-LAB-006",
    category: "Infrastructure",
    location: "Faculty of Science",
    description:
      "Upgrade of computer laboratory infrastructure, power systems and workstations.",
    status: "On Track",
    progress: 42,
    budget: 29700000,
    spent: 12400000,
    startDate: "2026-07-01",
    endDate: "2026-12-19",
    manager: "Engr. Ibrahim Musa",
    team: ["SE", "FO"],
  },
];

const STORAGE_KEY = "construction_pmis_projects";

export const getProjects = () => {
  const savedProjects = localStorage.getItem(STORAGE_KEY);

  if (!savedProjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }

  try {
    return JSON.parse(savedProjects);
  } catch (error) {
    console.error("Unable to load projects:", error);
    return defaultProjects;
  }
};

export const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const addProject = (project) => {
  const projects = getProjects();

  const newProject = {
    ...project,
    id: project.id || project.code,
    spent: project.spent || 0,
    team: project.team || ["PM"],
  };

  const updatedProjects = [newProject, ...projects];

  saveProjects(updatedProjects);

  return newProject;
};

export const getProjectById = (id) => {
  const projects = getProjects();

  return projects.find((project) => project.id === id);
};

export const deleteProject = (id) => {
  const projects = getProjects();

  const updatedProjects = projects.filter(
    (project) => project.id !== id
  );

  saveProjects(updatedProjects);

  return updatedProjects;
};

export default defaultProjects;