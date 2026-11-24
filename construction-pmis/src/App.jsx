import {
  BrowserRouter,
  Routes,
  Route,
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
import HelpSupport from "./pages/HelpSupport";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import { AuthProvider } from "./context/AuthContext";
import Notifications from "./pages/Notifications";

function AppRoutes() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<AddProject />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />

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
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route
              path="*"
              element={
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-white">
                  <h2 className="text-xl font-semibold">Page Not Found</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    The page you requested does not exist.
                  </p>
                  <Link
                    to="/"
                    className="mt-4 inline-block text-sm font-medium text-amber-400 hover:underline"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              }
            />
          </Routes>
        </DashboardLayout>
      </RoleGuard>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;