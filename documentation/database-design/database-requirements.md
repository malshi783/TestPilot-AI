# TestPilot AI
## Database Requirements Document

**Document Version:** 1.0  
**Database Management System:** PostgreSQL

## 1. Introduction

This document describes the database requirements of the TestPilot AI platform.

The database will store and manage information related to users, projects, software requirements, test cases, test executions, and defect analysis.

The database must maintain data accuracy, consistency, and relationships between different entities.

## 2. Database Objectives

The main objectives are:

- Store user account information securely.
- Manage multiple software testing projects.
- Store software requirements.
- Maintain test cases associated with requirements.
- Store test execution history.
- Maintain defect information.
- Store AI analysis records.
- Support dashboard statistics and reports.

## 3. Identified Database Entities

The initial database will contain the following entities.

| No. | Entity | Purpose |
|---|---|---|
| 1 | Users | Store user account information |
| 2 | Roles | Define user access roles |
| 3 | Projects | Store project information |
| 4 | Project_Members | Connect users with projects |
| 5 | Requirements | Store software requirements |
| 6 | Test_Cases | Store manual and automated test cases |
| 7 | Requirement_Test_Cases | Connect requirements with test cases |
| 8 | Test_Executions | Store automated test execution details |
| 9 | Defects | Store identified defects |
| 10 | AI_Analysis_Records | Store AI analysis information |

## 4. Entity Descriptions

### 4.1 Users

Stores registered user information.

Main attributes:

- user_id (Primary Key)
- full_name
- email
- password_hash
- role_id (Foreign Key)
- created_at

### 4.2 Roles

Stores available user roles.

Main attributes:

- role_id (Primary Key)
- role_name
- description

### 4.3 Projects

Stores software testing project information.

Main attributes:

- project_id (Primary Key)
- project_name
- description
- created_by (Foreign Key)
- created_at
- updated_at

### 4.4 Project_Members

Stores the users assigned to each project.

Main attributes:

- project_member_id (Primary Key)
- project_id (Foreign Key)
- user_id (Foreign Key)
- assigned_at

### 4.5 Requirements

Stores software requirements belonging to projects.

Main attributes:

- requirement_id (Primary Key)
- project_id (Foreign Key)
- requirement_code
- title
- description
- priority
- status
- created_at

### 4.6 Test_Cases

Stores test case information.

Main attributes:

- test_case_id (Primary Key)
- project_id (Foreign Key)
- title
- description
- preconditions
- test_steps
- expected_result
- test_type
- status
- created_at

### 4.7 Requirement_Test_Cases

Maintains relationships between requirements and test cases.

Main attributes:

- requirement_id (Foreign Key)
- test_case_id (Foreign Key)

This entity supports requirement traceability.

### 4.8 Test_Executions

Stores automated test execution information.

Main attributes:

- execution_id (Primary Key)
- test_case_id (Foreign Key)
- executed_by (Foreign Key)
- execution_status
- started_at
- completed_at
- error_message

### 4.9 Defects

Stores information about identified software defects.

Main attributes:

- defect_id (Primary Key)
- project_id (Foreign Key)
- execution_id (Foreign Key)
- title
- description
- severity
- status
- created_at

### 4.10 AI_Analysis_Records

Stores information about AI-assisted operations.

Main attributes:

- analysis_id (Primary Key)
- project_id (Foreign Key)
- analysis_type
- input_reference
- ai_response
- review_status
- created_by (Foreign Key)
- created_at

## 5. Entity Relationships

The main database relationships are:

| Relationship | Type |
|---|---|
| Roles → Users | One-to-Many |
| Users → Projects | One-to-Many (creator relationship) |
| Users ↔ Projects | Many-to-Many through Project_Members |
| Projects → Requirements | One-to-Many |
| Projects → Test_Cases | One-to-Many |
| Requirements ↔ Test_Cases | Many-to-Many |
| Test_Cases → Test_Executions | One-to-Many |
| Projects → Defects | One-to-Many |
| Test_Executions → Defects | One-to-Many (optional execution reference) |
| Projects → AI_Analysis_Records | One-to-Many |

## 6. Database Constraints

The database should implement:

- Primary key constraints.
- Foreign key constraints.
- NOT NULL constraints for required fields.
- UNIQUE constraints for user email addresses.
- Appropriate data types.
- Referential integrity.
- Validation of allowed status values.

## 7. Security Requirements

- Passwords must be stored as secure hashes.
- Database credentials must be stored in environment variables.
- Database access must be restricted.
- User permissions must be checked by the backend.
- Sensitive information must not be unnecessarily stored in AI analysis records.

## 8. Data Integrity and Backup

- Related records must maintain valid foreign key relationships.
- Important database operations should use transactions when necessary.
- Regular database backups should be considered for deployed environments.
- Deletion operations must not create unintended orphan records.

## 9. Future Database Enhancements

Future versions may introduce:

- Test execution attachments.
- Defect comments and assignments.
- AI agent activity logs.
- GitHub integration records.
- Advanced audit logs.
- Team collaboration information.

## 10. Conclusion

The proposed database structure provides a foundation for managing the information required by TestPilot AI.

PostgreSQL will support relational data management, requirement traceability, test execution history, and future system expansion.