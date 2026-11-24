# TestPilot-AI – AI-Assisted Software Testing and Test Case Management System

An internship-level PERN application for generating, reviewing, and managing software test cases and recording manual test execution results.

## Overview

TestPilot-AI helps users turn software requirements into suggested test scenarios. Users can review and edit generated test cases, manually execute them, record PASSED, FAILED, or SKIPPED results, and monitor the latest results through a dashboard.

The application is built using PostgreSQL, Express.js, React.js, and Node.js (PERN), with Google Gemini API integration for AI-assisted test case generation.

## MVP Features

- User registration and login.
- Password hashing with bcryptjs and JWT-based protected API routes.
- AI-assisted test case generation from software requirements.
- A local demo generator when no Gemini API key is configured.
- View and edit saved test cases.
- Manual test execution with PASSED, FAILED, and SKIPPED results.
- Optional execution notes for failed tests.
- Dashboard statistics calculated from the latest execution result of each test case.
- Execution history for the current user.

<<<<<<< HEAD
**AI Integration:** TestPilot-AI uses the Google Gemini API to generate test cases from software requirements. A local demo generator is available when the Gemini API key is not configured.
=======
**AI Note:** When `GEMINI_API_KEY` is empty, the application uses a built-in local demo generator. This is not a live AI response. When a valid Gemini API key is configured, the backend uses the Google Gemini API to generate test cases.
>>>>>>> 9a6425b (docs: update README with Gemini integration and corrected screenshots)

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, `pg` |
| Authentication | JWT, bcryptjs |
| AI Integration | Google Gemini API |
| API | REST over HTTP/JSON |
| Development | Git, GitHub, VS Code, Postman |
| AI Integration | Google Gemini API |

## Workflow

1. Register or sign in.
2. Enter a feature or software requirement in Test Case Studio.
3. Generate suggested test cases.
4. Review and edit the generated scenarios.
5. Save the updated cases.
6. Execute the cases manually and record a result.
7. Review the dashboard and execution history.

## Architecture

```mermaid
flowchart TD
<<<<<<< HEAD
  U[User] --> R[React Frontend]
  R --> API[Express REST API]
  API --> AUTH[JWT Authentication]
  API --> C[Controllers and Services]
  C --> DB[(PostgreSQL)]
  C --> C --> AI[Google Gemini API or Local Demo Generator]
  AI --> C
  C --> API
  API --> R
=======
    U[User] --> R[React Frontend]
    R --> API[Express REST API]
    API --> AUTH[JWT Authentication]
    API --> C[Controllers and Services]
    C --> DB[(PostgreSQL)]
    C --> AI[Google Gemini API or Local Demo Generator]
    AI --> C
    C --> API
    API --> R
>>>>>>> 9a6425b (docs: update README with Gemini integration and corrected screenshots)
```

## Project Structure

```text
TestPilot-AI/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── qualityController.js
│       ├── db/
│       │   └── setup.js
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── qualityRoutes.js
│       ├── services/
│       │   └── testCaseGenerator.js
│       └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       ├── AuthScreen.jsx
│       ├── main.jsx
│       └── styles.css
│
├── screenshots/
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 20 or later (Node.js 24 was used during development).
- npm.
- PostgreSQL 16 or a compatible PostgreSQL server.
- Git.
- A Google Gemini API key for live AI-assisted test case generation. The local demo generator can be used without an API key.

## Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/malshi783/TestPilot-AI.git
<<<<<<< HEAD
cd TestPilot-AI
=======
>>>>>>> 9a6425b (docs: update README with Gemini integration and corrected screenshots)
cd TestPilot-AI
```

### 2. Create the PostgreSQL Database

Open `psql` or pgAdmin and create the database:

```sql
CREATE DATABASE testpilot_ai;
```

The schema script creates the application tables and inserts the default role records. It uses `CREATE TABLE IF NOT EXISTS` and does not drop existing tables.

The database schema is available in:

```text
database/schema.sql
```

### 3. Configure and Start the Backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`.

Configure your local PostgreSQL credentials and create a new, strong JWT secret.

Example local configuration:

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173

DATABASE_URL=
DB_HOST=localhost
DB_PORT=5433
DB_NAME=testpilot_ai
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
DB_SSL=false

JWT_SECRET=replace_with_a_long_random_secret
<<<<<<< HEAD
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174
=======

>>>>>>> 9a6425b (docs: update README with Gemini integration and corrected screenshots)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=your_gemini_model
```

Replace the example database password, JWT secret, Gemini API key, and model value with your own configuration.

Use either `DATABASE_URL` or the individual `DB_*` values. Leave `DATABASE_URL` empty when using the individual database settings.

Change `DB_PORT` to match the port on which your PostgreSQL server is listening.

For demo generation without live AI integration, leave `GEMINI_API_KEY` empty.

Initialize the database schema:

```bash
npm run db:setup
```

Start the backend API:

```bash
npm run dev
```

The backend listens on:

```text
http://localhost:5000
```

Check the database connection at:

```text
http://localhost:5000/api/health
```

A successful health response looks like:

```json
{
  "status": "ok",
  "database": "connected"
}
```

### 4. Configure and Start the Frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`.

Configure the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite. It commonly uses:

```text
http://localhost:5173
```

If Vite uses another port because the default port is occupied, ensure that the actual frontend origin is included in `FRONTEND_ORIGIN` in `backend/.env`. Restart the backend after changing this setting.

### 5. Build the Frontend

From the `frontend` directory:

```bash
npm run build
```

## API Endpoints

All routes below are mounted by the Express server. Protected routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a user |
| POST | `/api/auth/login` | No | Sign in and receive a JWT |
| GET | `/api/auth/me` | Yes | Validate the token and return the current user |
| GET | `/api/test-cases` | Yes | List the signed-in user's test cases and latest execution status |
| GET | `/api/executions` | Yes | List the signed-in user's manual execution history |
| POST | `/api/requirements/generate` | Yes | Save a requirement and generate test cases |
| PATCH | `/api/test-cases/:id` | Yes | Update a test case |
| POST | `/api/test-cases/:id/executions` | Yes | Record a manual execution |
| GET | `/api/health` | No | Check API and database availability |

## Database Tables

The canonical schema is `database/schema.sql`. It defines:

- `roles`
- `users`
- `projects`
- `project_members`
- `requirements`
- `test_cases`
- `requirement_test_cases`
- `test_executions`
- `defects`
- `ai_analysis_records`

The MVP actively uses users, roles, projects, requirements, test cases, requirement-test-case links, executions, and AI analysis records.

The presence of `project_members` and `defects` tables does not mean a complete team collaboration or defect-management UI is included.

## Manual Test Execution Statuses

| Status | Meaning |
|---|---|
| PASSED | The observed result matches the expected result. |
| FAILED | The observed result does not match the expected result. |
| SKIPPED | The test case was not run. |

A failed result can include an optional note.

Test execution in this MVP is manual; it does not run the application under test automatically.

## Current Scope and Limitations

This MVP focuses on authentication, AI-assisted test case generation, test case review and editing, manual execution, and basic result monitoring.

Not included in this version:

- Automated browser execution with Playwright or Selenium.
- A full defect/bug tracking workflow.
- Full project CRUD or team collaboration.
- Full requirement approval and lifecycle management.
- CI/CD integration, notifications, or advanced reporting.

## Security Notes

- Keep real `.env` files out of Git.
- Use a unique, strong `JWT_SECRET` for each environment.
- Never put AI API keys in frontend code or commit them to the repository.
- The backend uses parameterized SQL queries for user-provided values.
- Do not use development credentials in production.

## Application Screenshots

### 1. Login Page

![Login Page](screenshots/Screenshot%202026-11-24%20164804.png)

### 2. Dashboard

The dashboard provides an overview of test cases and their latest execution results.

![TestPilot-AI Dashboard](screenshots/Screenshot%202026-11-24%20164804.png)

### 3. Test Case Studio

Users can submit software requirements and generate test scenarios with Gemini AI assistance.

![Test Case Studio](screenshots/Screenshot%202026-11-24%20164851.png)

### 4. Generated Test Cases

Generated test cases can be reviewed, edited, and saved.

![Generated Test Cases](screenshots/Screenshot%202026-11-24%20164851.png)

### 5. Test Executions

Users can manually execute test cases and record PASSED, FAILED, and SKIPPED results.

![Test Executions](screenshots/Screenshot%202026-11-24%20164912.png)

## Author

**Malshi Dewmini**  
Undergraduate Software Engineering Student

---

*TestPilot-AI — Making software test design and manual execution easier to organize.*