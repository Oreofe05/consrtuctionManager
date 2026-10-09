
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import TaskForm from "./pages/TaskForm";
import Schedule from "./pages/Schedule";
import Resources from "./pages/Resources";
import Expenditure from "./pages/Expenditure";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";


function ComingSoon() {
  const location = useLocation();

  const pageNames = {
    "/schedule": "Schedule Management",
    "/resources": "Resource Management",
    "/expenditure": "Expenditure Management",
    "/progress": "Progress Monitoring",
    "/reports": "Project Reports",
    "/users": "User Management",
    "/settings": "Settings",
    "/help": "Help & Support",
  };

  const pageName =
    pageNames[location.pathname] || "Page Not Found";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <span className="text-2xl font-bold">B</span>
      </div>

      <h1 className="mt-5 text-2xl font-bold text-slate-900">
        {pageName}
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        This section is part of the BuildControl system and will be
        implemented as we continue developing the application.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<AddProject />} />
        <Route
          path="/projects/:projectId"
          element={<ProjectDetails />}
        />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<TaskForm />} />
        <Route path="/tasks/:taskId/edit" element={<TaskForm />} />

        <Route path="/schedule" element={<Schedule />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/expenditure" element={<Expenditure />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<ComingSoon />} />

        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;