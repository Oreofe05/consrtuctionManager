# BuildControl Backend

A Node.js, Express and MongoDB REST API for BuildControl. Backend schema adjusted after inspecting the uploaded React/Vite frontend. It provides authentication, role-based access, projects, tasks, schedules, resources, expenditure, progress tracking, dashboard statistics, reports, notifications and activity logs.

## Requirements

- Node.js 20 or newer
- MongoDB Community Server or a MongoDB Atlas database
- npm
- Postman (recommended for API testing)

## Installation

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure the values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/buildcontrol
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start MongoDB, then run:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## First administrator account

Public registration intentionally creates only a `Site Engineer`, preventing users from granting themselves administrator privileges.

1. Register your first user with `POST /api/auth/register`.
2. In a trusted local MongoDB administration tool, update that user's `role` to `System Administrator`.
3. Sign in again and use the administrator account to create/manage users and assign roles.

Never expose database credentials or JWT secrets in the frontend or GitHub.

## Authentication

Send the JWT returned by login/registration in protected requests:

```http
Authorization: Bearer YOUR_TOKEN
```

Registration:
```json
{ "name": "Project User", "email": "user@example.com", "password": "ChangeMe123!" }
```

Login:
```json
{ "email": "user@example.com", "password": "ChangeMe123!" }
```

Logout is stateless: remove the token from the client. For production deployments, consider short-lived access tokens and refresh-token rotation.

## API overview

All routes are prefixed with `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a team member |
| POST | `/auth/login` | Sign in |
| POST | `/auth/logout` | Client logout acknowledgement |
| GET/PATCH | `/auth/me` | Get/update own profile |
| PATCH | `/auth/change-password` | Change password |
| GET/PATCH/DELETE | `/users` and `/users/:id` | Admin user management |
| GET | `/dashboard` | Database-derived dashboard summary |
| GET/POST | `/projects` | List/create projects |
| GET/PATCH/DELETE | `/projects/:id` | Read/update/delete project |
| GET/POST | `/tasks` | List/create tasks |
| GET/PATCH/DELETE | `/tasks/:id` | Read/update/delete task |
| PATCH | `/tasks/:id/assign` | Assign a task |
| GET/POST | `/schedules` | List/create schedules or milestones |
| GET/POST | `/resources` | List/create resources |
| GET/POST | `/expenditures` | List/create expenses |
| GET/POST | `/progress` | List/create progress updates |
| GET | `/reports/projects` | Project, task, resource, expense and progress report |
| GET | `/notifications` | Current user's notifications |
| PATCH | `/notifications/:id/read` | Mark one notification read |
| PATCH | `/notifications/read-all` | Mark all notifications read |

All resource collections also support `GET /:id`, `PATCH /:id` and `DELETE /:id` where applicable.

## Common data fields

**Project**
```json
{
  "name": "Faculty Building Renovation",
  "description": "Renovation and construction work",
  "location": "University of Ibadan, Ibadan",
  "budget": 25000000,
  "startDate": "2026-12-01",
  "expectedEndDate": "2027-08-30",
  "status": "Planning",
  "manager": "MONGODB_USER_OBJECT_ID",
  "teamMembers": []
}
```

Project status values: `Planning`, `On Track`, `At Risk`, `Delayed`, `Completed`. The project model includes frontend fields `code`, `category`, `spent`, `endDate`, `manager` and `team`; project detail URLs can use a project code such as `UI-ENG-001`.

**Task**
```json
{
  "title": "Inspect foundation",
  "description": "Carry out foundation inspection",
  "project": "MONGODB_PROJECT_OBJECT_ID",
  "assignedTo": "MONGODB_USER_OBJECT_ID",
  "priority": "High",
  "status": "Pending",
  "startDate": "2026-12-03",
  "dueDate": "2026-12-10"
}
```

Task priority values: `Low`, `Medium`, `High`, `Urgent`. Status values: `Pending`, `In Progress`, `Completed`, `Blocked`.

**Resource**
```json
{
  "name": "Cement",
  "type": "Material",
  "unit": "bags",
  "quantity": 100,
  "availableQuantity": 100,
  "project": "MONGODB_PROJECT_OBJECT_ID",
  "unitCost": 12000
}
```

Resource type values: `Labour`, `Material`, `Equipment`.

**Expenditure**
```json
{
  "project": "MONGODB_PROJECT_OBJECT_ID",
  "category": "Materials",
  "description": "Purchase of cement",
  "amount": 240000,
  "date": "2026-12-05"
}
```

**Progress update**
```json
{
  "project": "MONGODB_PROJECT_OBJECT_ID",
  "percentage": 35,
  "description": "Foundation and ground-floor work completed"
}
```

## Search, pagination and filtering

Collection endpoints accept:
- `page` (default 1)
- `limit` (default 20, maximum 100)
- `search` (text search)
- `status`, `type`, `project`, `assignedTo` where relevant
- `from` and `to` date filters

Example: `GET /api/tasks?project=PROJECT_ID&status=Pending&page=1&limit=10`.

Responses use a consistent structure:
```json
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 20, "total": 0, "pages": 0 } }
```

## Frontend integration

Set the React app's API base URL to `http://localhost:5000/api` (or your deployed API URL). A simple fetch example:

```js
const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("buildcontrol_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result;
}
```

Do not use localStorage as the database. It may be used to hold a client-side token in a prototype, but production authentication should consider secure, httpOnly cookies and an appropriate CSRF strategy.

## Important integration note

The supplied project brief did not include the React source code. Therefore, this backend follows the entities, roles, and fields in the brief, but exact compatibility with your existing forms, components, and login response shape still needs to be confirmed against the frontend. Share the frontend ZIP/repository or key API service and form files to align every field and endpoint precisely.

## Security and production notes

- Configure a strong unique `JWT_SECRET`.
- Restrict `CLIENT_URL` to your deployed frontend origin(s).
- Use HTTPS in production.
- Keep `.env` out of Git.
- Add stricter project membership/ownership policies before production use. This starter enforces authentication and role checks, but not every project-specific read/write permission yet.
- Review deletion policies and backup the database before production use.
- Add integration tests against a disposable MongoDB database before deployment.

## Development and tests

```bash
npm test
npm run dev
```


## Integration findings from the uploaded React frontend

The uploaded app is a Vite + React + Tailwind project. It currently has **no API service layer**: page modules call helper functions in `src/data/*.js`, and those helpers persist projects, tasks, resources, expenditure, progress, users and notifications in browser `localStorage`. Authentication in `src/context/AuthContext.jsx` also checks hardcoded demo accounts in the browser. Therefore, installing/running this backend alone will not make the existing UI use MongoDB; the frontend data helpers and AuthContext must be changed to call HTTP endpoints.

Frontend-specific details identified:
- Authentication storage key: `construction_pmis_session`; demo roles: `System Administrator`, `Project Manager`, `Site Engineer`, `Finance Officer`.
- Project records use `id`/`code` (for example `UI-ENG-001`), `category`, `location`, `description`, `status`, `progress`, `budget`, `spent`, `startDate`, `endDate`, `manager`, and `team`.
- Task forms use `projectId`, `assignee`, `projectName`, `projectCode`, `priority`, `status`, `dueDate` and task title/description.
- Resource records use `projectId`, `projectCode`, `projectName`, `category`, `quantity`, `requiredQuantity`, `unitCost` and `supplier`.
- Progress records use `projectId`, `progress`, `plannedProgress`, `date` and `notes`.
- Expenditure records include project references, category, amount and statuses such as Pending/Approved/Paid.
- Notifications are filtered by role and have per-user read/deleted state in the current browser implementation.

The backend covers the core database entities and accepts project codes when fetching/updating/deleting projects. However, a frontend integration pass is still required to map legacy property names (`projectId`, `assignee`, `plannedProgress`, `notes`, etc.) to normalized API models, and to replace every `src/data/*.js` localStorage operation. The UI components/design do not need to be rebuilt.

Suggested API base URL: `http://localhost:5000/api`. Keep the JWT in the auth context and send `Authorization: Bearer <token>` on protected requests. Do not keep passwords in localStorage or ship the old demo account passwords in a production build.
