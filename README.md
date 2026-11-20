# TestPilot-AI
### An Agentic AI-Powered Software Quality Engineering Platform

TestPilot-AI is an intelligent software quality engineering platform designed to support software development teams in managing requirements, test cases, test execution, defects and AI-assisted quality analysis through a unified environment.

The project aims to explore how Agentic AI can enhance traditional Software Quality Assurance (SQA) workflows, improve testing efficiency and support better software quality management.

**Project Status:** 🚧 Under Development

---

## 🎯 Project Objectives

- Centralise software requirements and testing activities.
- Improve traceability between requirements and test cases.
- Organise test execution and defect tracking.
- Explore AI-assisted software quality analysis.
- Support collaboration between different software project roles.
- Investigate intelligent automation in Software Quality Engineering.

---

## ✨ Planned Core Modules

### 1. User and Role Management
Manage platform users and their responsibilities through role-based access.

Planned roles:
- Administrator
- QA Engineer
- Business Analyst
- Developer
- Project Manager

### 2. Project Management
Organise software projects and manage project-related information and team members.

### 3. Requirements Management
Create, organise and manage software requirements throughout the development lifecycle.

### 4. Test Case Management
Create and maintain test cases and establish relationships between requirements and test cases.

### 5. Test Execution Management
Organise test executions and maintain testing results.

### 6. Defect Management
Record, track and manage software defects identified during testing.

### 7. AI-Assisted Quality Analysis
Explore AI-powered analysis to support software quality engineering activities.

*These modules describe the planned platform scope. They are not all implemented yet.*

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| Database Client | node-postgres (`pg`) |
| Authentication Development | bcrypt-based password handling |
| Environment Configuration | dotenv |
| Cross-Origin Support | CORS |
| Development Tool | Nodemon |
| Version Control | Git and GitHub |

**Planned areas:** Frontend development, AI integration and QA automation.

---

## 🏗️ System Architecture

The planned architecture separates the user interface, backend services, database and AI-assisted capabilities.

```text
             USERS
               |
               v
        FRONTEND APPLICATION
               |
               v
          REST API
               |
               v
       EXPRESS.JS BACKEND
               |
       +-------+-------+
       |       |       |
       v       v       v
   SERVICES  ROUTES  MIDDLEWARE
       |
       v
   POSTGRESQL DATABASE
       |
       v
   AI ANALYSIS MODULE
       |
       v
 QUALITY INSIGHTS
```

---

## 🗄️ Database Design

The PostgreSQL database is named `testpilot_ai`.

The initial database design contains 10 tables:

| Table | Purpose |
|---|---|
| roles | Stores system roles |
| users | Stores user information |
| projects | Stores project details |
| project_members | Manages project membership |
| requirements | Stores software requirements |
| test_cases | Stores test case information |
| requirement_test_cases | Connects requirements with test cases |
| test_executions | Stores test execution records |
| defects | Tracks identified defects |
| ai_analysis_records | Stores AI analysis records |

The initial database setup also includes five predefined roles:

`ADMIN`, `QA_ENGINEER`, `BUSINESS_ANALYST`, `DEVELOPER`, `PROJECT_MANAGER`.

---

## 📁 Backend Project Structure

The backend is being organised using a modular structure.

```text
backend/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │
│   ├── routes/
│   │
│   ├── middleware/
│   │
│   ├── services/
│   │
│   └── server.js
│
├── .env
├── .gitignore
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Node.js 24 or a compatible version
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/malshi783/TestPilot-AI.git
```

### 2. Navigate to the Backend

```bash
cd TestPilot-AI/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory.

Add the database and server configuration required by the project.

Example configuration (adjust variable names to match `src/config/database.js`):

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=testpilot_ai
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

Never commit your actual `.env` file or database credentials to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

The backend development server is configured to use port `5000`.

---

## 📌 Development Progress

| Component | Progress |
|---|---|
| Business Analysis | Completed |
| Requirements Engineering | Completed |
| System Architecture | Initial design completed |
| Use Case Design | Completed |
| Database Design | Initial schema completed |
| PostgreSQL Database Setup | Initial setup completed |
| Backend Development | In Progress |
| Frontend Development | Planned |
| AI Integration | Planned |
| QA Automation | Planned |

---

## 🎓 Learning Outcomes

This project provides an opportunity to develop practical knowledge and experience in:

- Software Quality Assurance and Testing.
- Requirements Engineering.
- Software Architecture and System Design.
- REST API Development.
- Node.js and Express.js.
- PostgreSQL Database Design.
- Role-Based Access Control.
- AI-assisted Software Engineering.
- Git and GitHub Version Control.

---

## 👩‍💻 Developer

**Malshi Dewmini**

BSc (Hons) Software Engineering Undergraduate  
NSBM Green University, Sri Lanka

- GitHub: [malshi783](https://github.com/malshi783)
- LinkedIn: [Malshi Dewmini](https://linkedin.com/in/malshidewmini)
- Email: malshi783@gmail.com

---

⭐ *Building intelligent tools to explore the future of Software Quality Engineering.*

**Note:** TestPilot-AI is an ongoing development project. Features and architecture may evolve as development progresses.
