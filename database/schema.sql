-- =====================================================
-- TestPilot AI
-- PostgreSQL Database Schema
-- Version: 1.0
-- =====================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE RESTRICT
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_users
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);

-- 4. PROJECT MEMBERS TABLE
CREATE TABLE IF NOT EXISTS project_members (
    project_member_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_members_projects
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_members_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_project_member
        UNIQUE (project_id, user_id)
);

-- 5. REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS requirements (
    requirement_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL,
    requirement_code VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requirements_projects
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_requirement_code
        UNIQUE (project_id, requirement_code),

    CONSTRAINT check_requirement_priority
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    CONSTRAINT check_requirement_status
        CHECK (status IN ('DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'))
);

-- 6. TEST CASES TABLE
CREATE TABLE IF NOT EXISTS test_cases (
    test_case_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    preconditions TEXT,
    test_steps JSONB NOT NULL DEFAULT '[]'::JSONB,
    expected_result TEXT NOT NULL,
    test_type VARCHAR(30) NOT NULL DEFAULT 'MANUAL',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    automation_script TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_test_cases_projects
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT check_test_type
        CHECK (test_type IN ('MANUAL', 'AUTOMATED')),

    CONSTRAINT check_test_case_status
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- 7. REQUIREMENT TEST CASES TABLE
CREATE TABLE IF NOT EXISTS requirement_test_cases (
    requirement_id INTEGER NOT NULL,
    test_case_id INTEGER NOT NULL,

    PRIMARY KEY (requirement_id, test_case_id),

    CONSTRAINT fk_rtc_requirements
        FOREIGN KEY (requirement_id)
        REFERENCES requirements(requirement_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rtc_test_cases
        FOREIGN KEY (test_case_id)
        REFERENCES test_cases(test_case_id)
        ON DELETE CASCADE
);

-- 8. TEST EXECUTIONS TABLE
CREATE TABLE IF NOT EXISTS test_executions (
    execution_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    test_case_id INTEGER NOT NULL,
    executed_by INTEGER NOT NULL,
    execution_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,

    CONSTRAINT fk_executions_test_cases
        FOREIGN KEY (test_case_id)
        REFERENCES test_cases(test_case_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_executions_users
        FOREIGN KEY (executed_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT check_execution_status
        CHECK (
            execution_status IN (
                'PENDING',
                'RUNNING',
                'PASSED',
                'FAILED',
                'SKIPPED'
            )
        ),

    CONSTRAINT check_execution_dates
        CHECK (
            completed_at IS NULL
            OR started_at IS NULL
            OR completed_at >= started_at
        )
);

-- 9. DEFECTS TABLE
CREATE TABLE IF NOT EXISTS defects (
    defect_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL,
    execution_id INTEGER,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_defects_projects
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_defects_executions
        FOREIGN KEY (execution_id)
        REFERENCES test_executions(execution_id)
        ON DELETE SET NULL,

    CONSTRAINT check_defect_severity
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    CONSTRAINT check_defect_status
        CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

-- 10. AI ANALYSIS RECORDS TABLE
CREATE TABLE IF NOT EXISTS ai_analysis_records (
    analysis_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL,
    analysis_type VARCHAR(50) NOT NULL,
    input_reference TEXT,
    ai_response TEXT,
    review_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_records_projects
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ai_records_users
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT check_ai_review_status
        CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_created_by
    ON projects(created_by);

CREATE INDEX IF NOT EXISTS idx_project_members_user
    ON project_members(user_id);

CREATE INDEX IF NOT EXISTS idx_requirements_project
    ON requirements(project_id);

CREATE INDEX IF NOT EXISTS idx_test_cases_project
    ON test_cases(project_id);

CREATE INDEX IF NOT EXISTS idx_test_executions_test_case
    ON test_executions(test_case_id);

CREATE INDEX IF NOT EXISTS idx_defects_project
    ON defects(project_id);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_project
    ON ai_analysis_records(project_id);

-- =====================================================
-- INITIAL ROLE DATA
-- =====================================================

INSERT INTO roles (role_name, description)
VALUES
    ('ADMIN', 'System administrator'),
    ('QA_ENGINEER', 'Manages software testing activities'),
    ('BUSINESS_ANALYST', 'Manages and analyzes requirements'),
    ('DEVELOPER', 'Investigates and fixes software defects'),
    ('PROJECT_MANAGER', 'Monitors project progress')
ON CONFLICT (role_name) DO NOTHING;
-- =====================================================
-- END OF SCHEMA
-- =====================================================

