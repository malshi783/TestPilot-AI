# TestPilot AI
## System Architecture Document

**Document Version:** 1.0  
**Architecture Style:** Client-Server Architecture  
**Application Type:** AI-Powered Web Application

---

## 1. Introduction

This document describes the high-level system architecture of TestPilot AI.

TestPilot AI is a web-based software quality engineering platform that combines AI-assisted analysis, test management, and automated browser testing.

The system follows a modular client-server architecture consisting of a frontend, backend, database, AI integration layer, and test automation component.

## 2. Architecture Overview

The system consists of five major components:

1. Frontend
2. Backend
3. Database
4. AI Integration
5. Test Automation

### 2.1 Frontend

**Technology:** React, Vite, Tailwind CSS

Responsibilities:

- Provide the user interface.
- Display project information.
- Manage user interactions.
- Display AI-generated suggestions.
- Display test execution results.
- Communicate with the backend through REST APIs.

### 2.2 Backend

**Technology:** Node.js and Express.js

Responsibilities:

- Handle API requests.
- Manage authentication and authorization.
- Process business logic.
- Manage projects and requirements.
- Communicate with the database.
- Communicate with the AI service.
- Coordinate automated test execution.

### 2.3 Database

**Technology:** PostgreSQL

Responsibilities:

- Store user information.
- Store project information.
- Store software requirements.
- Store test cases.
- Store test execution results.
- Store defect analysis information.
- Maintain relationships between system entities.

### 2.4 AI Integration Layer

**Technology:** External LLM API

Responsibilities:

- Analyze software requirements.
- Generate test case suggestions.
- Identify potential coverage gaps.
- Analyze test failure information.
- Generate testing summaries.

AI-generated outputs must be validated and reviewed by users before approval.

### 2.5 Test Automation Component

**Technology:** Playwright

Responsibilities:

- Execute automated browser tests.
- Capture test execution results.
- Record screenshots and relevant failure information.
- Provide execution information to the backend.

Automated tests must only run against applications and environments authorized by the user.

---

## 3. High-Level Architecture Diagram

```text
              USERS
                |
                v
       +------------------+
       |  React Frontend  |
       |   (Vite + UI)    |
       +------------------+
                |
             REST API
                |
                v
       +------------------+
       |  Express Backend |
       |   (Node.js)      |
       +------------------+
          |      |      |
          |      |      |
          v      v      v
     +--------+ +------+ +-------------+
     |PostgreSQL| | AI  | | Playwright  |
     |Database | | API  | | Automation |
     +--------+ +------+ +-------------+
          |       |           |
          v       v           v
       Data    AI Results   Test Results
       Storage & Suggestions
```

## 4. System Architecture Layers

### 4.1 Presentation Layer

The presentation layer is responsible for displaying information and receiving user input.

Main components:

- Login Page
- Dashboard
- Project Management
- Requirement Management
- AI Test Case Generator
- Test Coverage Analysis
- Test Execution
- Defect Analysis
- Reports

### 4.2 Application Layer

The application layer handles the main business operations.

Main modules:

- Authentication Module
- Project Management Module
- Requirement Management Module
- Test Case Management Module
- AI Integration Module
- Test Execution Module
- Reporting Module

### 4.3 Data Layer

The data layer manages persistent information using PostgreSQL.

It provides data access operations for the backend application.

### 4.4 AI