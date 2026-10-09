import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserRound,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  Mail,
  Building2,
  CircleCheck,
  CircleX,
  UserCog,
  Activity,
  AlertTriangle,
} from "lucide-react";

import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../data/users";

const ROLES = [
  "System Administrator",
  "Project Manager",
  "Site Engineer",
  "Finance Officer",
];

const DEPARTMENTS = [
  "Directorate of Physical Planning",
  "Project Management",
  "Civil Engineering",
  "Finance Department",
  "Electrical Engineering",
  "Procurement",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  role: "Project Manager",
  status: "Active",
};

const inputClass =
  "w-full rounded border-2 border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-black text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40";

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "border-sky-500/50 text-sky-400 bg-slate-950",
    emerald: "border-emerald-500/50 text-emerald-400 bg-slate-950",
    violet: "border-purple-500/50 text-purple-400 bg-slate-950",
    amber: "border-amber-500/50 text-amber-400 bg-slate-950",
  };

  const textColors = {
    blue: "text-sky-400",
    emerald: "text-emerald-400",
    violet: "text-purple-400",
    amber: "text-amber-400",
  };

  return (
    <div className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl font-mono">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">{title}</p>
          <h3 className={`mt-2 text-2xl font-black tracking-tight ${textColors[color]}`}>
            {value}
          </h3>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 ${colors[color]}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border-2 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${
        active
          ? "border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          : "border-slate-700 bg-slate-950 text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-slate-500"
        }`}
      />
      {status}
    </span>
  );
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    user ? { ...user } : { ...EMPTY_FORM }
  );
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter the user's full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.department) {
      setError("Please select a department.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm font-mono text-white"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b-2 border-slate-800/80 px-6 py-5">
          <div>
            <h2
              id="user-modal-title"
              className="text-base font-black uppercase tracking-wider text-white"
            >
              {user ? "MODIFY USER CREDENTIALS" : "REGISTER NEW OPERATOR"}
            </h2>
            <p className="mt-0.5 text-xs font-bold text-slate-400 uppercase">
              Configure system authorization and role assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded border border-slate-800 p-1.5 text-slate-400 hover:border-amber-500 hover:text-amber-400"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded border-2 border-rose-500 bg-rose-950/80 p-3 text-xs font-black uppercase text-rose-300"
            >
              <AlertTriangle size={16} strokeWidth={2.5} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              FULL NAME <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <UserRound
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
              />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="ENG. O. OKONKWO"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              EMAIL ADDRESS <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@ui.edu.ng"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
              DEPARTMENT / DIRECTORATE <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <Building2
                size={16}
                strokeWidth={2.5}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
              />
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`${inputClass} appearance-none pl-10 pr-8 text-amber-400 cursor-pointer`}
                required
              >
                <option value="" className="bg-slate-950 text-white font-black">[ SELECT DEPARTMENT ]</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department} className="bg-slate-950 text-white font-black">
                    {department.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                strokeWidth={2.5}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                SYSTEM ROLE
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role} className="bg-slate-950 text-white font-black">
                      {role.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  strokeWidth={2.5}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-300">
                ACCOUNT STATUS
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
                >
                  <option value="Active" className="bg-slate-950 text-white font-black">ACTIVE</option>
                  <option value="Inactive" className="bg-slate-950 text-white font-black">INACTIVE</option>
                </select>
                <ChevronDown
                  size={15}
                  strokeWidth={2.5}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-800/80 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded border-2 border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-black uppercase text-slate-300 hover:border-slate-700 hover:text-white"
            >
              DISCARD
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>{user ? "COMMIT CHANGES" : "CREATE USER"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersPage() {
  const [users, setUsers] = useState(() => getUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const stats = useMemo(
    () => [
      {
        title: "Total Registered",
        value: users.length,
        icon: Users,
        color: "blue",
      },
      {
        title: "Active Operators",
        value: users.filter((user) => user.status === "Active").length,
        icon: CircleCheck,
        color: "emerald",
      },
      {
        title: "Project Managers",
        value: users.filter((user) => user.role === "Project Manager").length,
        icon: UserCog,
        color: "violet",
      },
      {
        title: "Inactive Accounts",
        value: users.filter((user) => user.status === "Inactive").length,
        icon: CircleX,
        color: "amber",
      },
    ],
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = [
        user.name,
        user.email,
        user.department,
        user.role,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const openAddModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = (form) => {
    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.toLowerCase() &&
        user.id !== editingUser?.id
    );

    if (duplicateEmail) {
      setNotice("A user with this email address already exists.");
      return;
    }

    try {
      let updatedUsers;

      if (editingUser) {
        updatedUsers = users.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...form }
            : user
        );

        updateUser(editingUser.id, form);
        setNotice("User details updated successfully.");
      } else {
        const newUser = addUser(form);
        updatedUsers = [newUser, ...users];
        setNotice("User created successfully.");
      }

      setUsers(updatedUsers);
      closeModal();
    } catch (error) {
      console.error("Unable to save user:", error);
      setNotice("Unable to save this user. Please try again.");
    }
  };

  const toggleStatus = (user) => {
    if (
      user.role === "System Administrator" &&
      user.status === "Active" &&
      users.filter(
        (item) =>
          item.role === "System Administrator" &&
          item.status === "Active"
      ).length === 1
    ) {
      setNotice("At least one active System Administrator must remain.");
      return;
    }

    const nextStatus = user.status === "Active" ? "Inactive" : "Active";

    try {
      updateUser(user.id, { status: nextStatus });

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, status: nextStatus } : item
        )
      );

      setNotice(`${user.name}'s account is now ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      console.error("Unable to update user status:", error);
      setNotice("Unable to update account status.");
    }
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    if (
      pendingDelete.role === "System Administrator" &&
      pendingDelete.status === "Active" &&
      users.filter(
        (item) =>
          item.role === "System Administrator" &&
          item.status === "Active"
      ).length === 1
    ) {
      setNotice("You cannot remove the only active System Administrator.");
      setPendingDelete(null);
      return;
    }

    try {
      deleteUser(pendingDelete.id);
      setUsers((current) =>
        current.filter((user) => user.id !== pendingDelete.id)
      );
      setNotice("User deleted successfully.");
    } catch (error) {
      console.error("Unable to delete user:", error);
      setNotice("Unable to delete this user.");
    }

    setPendingDelete(null);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 text-white pb-12 font-mono">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-5 border-b-2 border-slate-800/80 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 border-2 border-slate-800 text-amber-400">
              <ShieldCheck size={15} strokeWidth={2.5} /> ADMINISTRATION
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-black">USER ACCESS CONTROL</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Users & Authorization Directory
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">
            Manage BuildControl user accounts, departments, administrative access levels, and security authorization states.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded border-2 border-amber-400 bg-amber-500 px-5 py-3 font-mono text-xs font-black uppercase text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400"
        >
          <UserPlus size={18} strokeWidth={2.5} />
          <span>REGISTER NEW USER</span>
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded border-2 border-amber-500/50 bg-slate-900 p-4 text-xs font-black uppercase text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="shrink-0 rounded border border-slate-800 p-1 text-slate-400 hover:border-amber-500 hover:text-amber-400"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Users Table */}
      <section className="overflow-hidden rounded-md border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="flex flex-col gap-4 border-b-2 border-slate-800/80 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
              <Activity size={16} strokeWidth={2.5} />
              <span>USER REGISTER</span>
            </div>
            <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
              Authorized System Operators
            </h2>
            <p className="mt-0.5 text-xs font-bold text-slate-400">
              DISPLAYING {filteredUsers.length} OF {users.length} REGISTERED USERS
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search operators..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option className="bg-slate-950 text-white font-black">[ ALL ROLES ]</option>
                {ROLES.map((role) => (
                  <option key={role} value={role} className="bg-slate-950 text-white font-black">
                    {role.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} appearance-none pr-8 text-amber-400 cursor-pointer`}
              >
                <option className="bg-slate-950 text-white font-black">[ ALL STATUSES ]</option>
                <option value="Active" className="bg-slate-950 text-white font-black">ACTIVE</option>
                <option value="Inactive" className="bg-slate-950 text-white font-black">INACTIVE</option>
              </select>
              <ChevronDown size={15} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-amber-500">
              <Users size={32} strokeWidth={2.5} />
            </div>
            <h3 className="mt-4 text-sm font-black uppercase tracking-wider text-white">
              No User Accounts Located
            </h3>
            <p className="mt-1 max-w-sm text-xs font-bold leading-relaxed text-slate-400 uppercase">
              No registered user records satisfy active query parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left font-mono text-xs">
              <thead className="bg-slate-950 text-[11px] font-black uppercase tracking-wider text-slate-300 border-b-2 border-slate-800">
                <tr>
                  {[
                    "OPERATOR",
                    "DEPARTMENT",
                    "SYSTEM ROLE",
                    "REGISTERED",
                    "STATUS",
                    "ACTIONS",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 font-black"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-800/80 bg-slate-900/60">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-950/80 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-amber-500/50 bg-slate-950 font-black text-amber-400 text-xs">
                          {getInitials(user.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-black text-white uppercase">
                            {user.name}
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-[220px] px-5 py-4 font-bold text-slate-300 uppercase">
                      {user.department}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] font-black text-amber-400 uppercase">
                        <ShieldCheck size={13} strokeWidth={2.5} />
                        {user.role}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-400 uppercase">
                      {user.joinedAt
                        ? new Date(
                            `${user.joinedAt.slice(0, 10)}T00:00:00`
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).toUpperCase()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Edit user"
                          aria-label={`Edit ${user.name}`}
                          onClick={() => openEditModal(user)}
                          className="flex h-8 w-8 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>

                        <button
                          type="button"
                          title={
                            user.status === "Active"
                              ? "Deactivate account"
                              : "Activate account"
                          }
                          onClick={() => toggleStatus(user)}
                          className="rounded border-2 border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                        >
                          {user.status === "Active" ? "DISABLE" : "ENABLE"}
                        </button>

                        <button
                          type="button"
                          title="Delete user"
                          aria-label={`Delete ${user.name}`}
                          onClick={() => setPendingDelete(user)}
                          className="flex h-8 w-8 items-center justify-center rounded border-2 border-slate-800 bg-slate-950 text-slate-300 transition-colors hover:border-rose-500 hover:text-rose-400"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t-2 border-slate-800/80 bg-slate-950 px-5 py-3 text-[10px] font-black text-slate-400 uppercase">
          BUILDCONTROL · USER AUTHORIZATION & ACCESS DIRECTORY
        </div>
      </section>

      {/* Role Overview */}
      <section className="rounded-md border-2 border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
        <div className="mb-5 border-b-2 border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
            <ShieldCheck size={16} strokeWidth={2.5} />
            <span>ROLE DISTRIBUTION</span>
          </div>
          <h2 className="text-base font-black uppercase tracking-wider text-white mt-0.5">
            System Authorization Breakdown
          </h2>
          <p className="mt-0.5 text-xs font-bold text-slate-400">
            Current operator count and active account status categorized by system role.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ROLES.map((role) => {
            const count = users.filter((user) => user.role === role).length;

            return (
              <div
                key={role}
                className="rounded border-2 border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded border border-amber-500/40 bg-slate-900 text-amber-400">
                    <ShieldCheck size={16} strokeWidth={2.5} />
                  </div>
                  <span className="rounded border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-xs font-black text-amber-400">
                    {count}
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-black uppercase text-white">
                  {role}
                </h3>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                  {users.filter(
                    (user) => user.role === role && user.status === "Active"
                  ).length}{" "}
                  ACTIVE OPERATOR(S)
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm font-mono text-white">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md rounded-md border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded border-2 border-rose-500/50 bg-slate-950 text-rose-500">
              <Trash2 size={22} strokeWidth={2.5} />
            </div>

            <h2
              id="delete-user-title"
              className="mt-4 text-base font-black uppercase tracking-wider text-white"
            >
              PURGE USER ACCOUNT?
            </h2>

            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-400 uppercase">
              YOU ARE ABOUT TO PERMANENTLY REMOVE{" "}
              <span className="font-black text-amber-400">
                {pendingDelete.name}
              </span>{" "}
              FROM THE SYSTEM DIRECTORY. THIS ACTION IS IRREVERSIBLE.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded border-2 border-slate-800 bg-slate-900 px-4 py-2 text-xs font-black uppercase text-slate-300 hover:border-slate-700 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded border-2 border-rose-500 bg-rose-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-rose-500"
              >
                PURGE USER
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <UserModal
          key={editingUser?.id || "new-user"}
          user={editingUser}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default UsersPage;