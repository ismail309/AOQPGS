-- ==========================================
-- 1. CENTRAL STATUSES
-- ==========================================
CREATE TABLE IF NOT EXISTS statuses (
    sta_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sta_group VARCHAR(50) NOT NULL,
    sta_name VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE (sta_group, sta_name)
);

-- ==========================================
-- 2. ACCOUNT TYPES
-- ==========================================
CREATE TABLE IF NOT EXISTS account_types (
    act_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    act_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- ==========================================
-- 3. ROLES
-- ==========================================
CREATE TABLE IF NOT EXISTS roles (
    rol_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rol_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    sta_id INT REFERENCES statuses(sta_id) DEFAULT 1
);

-- ==========================================
-- 4. USERS
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    usr_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    act_id INT REFERENCES account_types(act_id) ON DELETE RESTRICT,
    sta_id INT REFERENCES statuses(sta_id) DEFAULT 1,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. HEAD OFFICES
-- ==========================================
CREATE TABLE IF NOT EXISTS head_offices (
    head_off_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    head_off_name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    phone_no VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    sta_id INT REFERENCES statuses(sta_id) DEFAULT 1, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. CAMPUSES
-- ==========================================
CREATE TABLE IF NOT EXISTS campuses (
    cam_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    head_off_id INT NOT NULL REFERENCES head_offices(head_off_id) ON DELETE RESTRICT,
    cam_name VARCHAR(255) NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    sta_id INT REFERENCES statuses(sta_id) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Capmus name should be unique under head office
ALTER TABLE campuses ADD CONSTRAINT unique_org_campus UNIQUE (head_off_id, cam_id);

-- ==========================================
-- 7. USER ROLES
-- ==========================================
CREATE TABLE IF NOT EXISTS user_roles (
    uro_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usr_id INT NOT NULL REFERENCES users(usr_id) ON DELETE RESTRICT,
    rol_id INT NOT NULL REFERENCES roles(rol_id) ON DELETE RESTRICT,
    
    -- If Head Office role (e.g. Org Admin), link here.
    head_off_id INT DEFAULT NULL REFERENCES head_offices(head_off_id) ON DELETE SET NULL, 
    
    -- If Campus role (e.g. Teacher, Campus Admin), link here.
    cam_id INT DEFAULT NULL REFERENCES campuses(cam_id) ON DELETE SET NULL,
    
    sta_id INT REFERENCES statuses(sta_id) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (usr_id, rol_id, head_off_id, cam_id)
);

-- ==========================================
-- 8. ORGANISATION MEMBERS (Head Office Level)
-- ==========================================
CREATE TABLE IF NOT EXISTS organisation_members (
    omb_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    head_off_id INT NOT NULL REFERENCES head_offices(head_off_id) ON DELETE RESTRICT,
    usr_id INT NOT NULL REFERENCES users(usr_id) ON DELETE RESTRICT,
    
    -- Tracks if they are invited, pending, active, or suspended
    sta_id INT NOT NULL REFERENCES statuses(sta_id) DEFAULT 1, 
    
    invited_by INT REFERENCES users(usr_id) ON DELETE SET NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- A user can only have one membership record per Head Office
    UNIQUE (head_off_id, usr_id)
);

-- ==========================================
-- 9. CAMPUS MEMBERS (Campus Level)
-- ==========================================
CREATE TABLE IF NOT EXISTS campus_members (
    cmb_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    -- These two columns MUST exist together in the organisation_members table
    head_off_id INT NOT NULL,
    usr_id INT NOT NULL,
    
    -- The campus they belong to
    cam_id INT NOT NULL,
    
    sta_id INT NOT NULL REFERENCES statuses(sta_id) DEFAULT 1,
    invited_by INT REFERENCES users(usr_id) ON DELETE SET NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 1. Link to organisation_members (Enforces the rule!)
    FOREIGN KEY (head_off_id, usr_id) 
        REFERENCES organisation_members(head_off_id, usr_id) 
        ON DELETE RESTRICT,
        
    -- 2. Link to campuses
    FOREIGN KEY (head_off_id, cam_id) 
        REFERENCES campuses(head_off_id, cam_id) 
        ON DELETE RESTRICT,
        
    -- 3. A user can only be a member of a specific campus once
    UNIQUE (cam_id, usr_id)
);