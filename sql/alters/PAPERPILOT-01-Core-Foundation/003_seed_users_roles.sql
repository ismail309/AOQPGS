-- ==========================================
-- 1. CREATE MOCK USERS
-- ==========================================
-- Note: We are using a dummy password hash for now. 
-- When we build FastAPI auth, we will use real Argon2id hashes.

INSERT INTO users (act_id, sta_id, first_name, last_name, email, password_hash) VALUES
(2, 1, 'Ali', 'Khan', 'ali@pgc.edu.pk', 'hashed_password_123'),
(2, 1, 'Sara', 'Ahmed', 'sara@pgc.edu.pk', 'hashed_password_123'),
(2, 1, 'Usman', 'Raza', 'usman@pgc.edu.pk', 'hashed_password_123')
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- 2. ADD USERS TO ORGANISATION MEMBERS
-- ==========================================
-- Adding them all to Punjab Group of Colleges (Head Office)

INSERT INTO organisation_members (head_off_id, usr_id, sta_id) VALUES
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'), (SELECT usr_id FROM users WHERE email = 'ali@pgc.edu.pk'), 1),
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'), (SELECT usr_id FROM users WHERE email = 'sara@pgc.edu.pk'), 1),
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'), (SELECT usr_id FROM users WHERE email = 'usman@pgc.edu.pk'), 1)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 3. ADD USERS TO CAMPUS MEMBERS
-- ==========================================

-- Add Ali and Sara to the Gulberg Campus
INSERT INTO campus_members (cam_id, usr_id, sta_id) VALUES
((SELECT cam_id FROM campuses WHERE cam_name = 'PGC Gulberg Campus'), (SELECT usr_id FROM users WHERE email = 'ali@pgc.edu.pk'), 1),
((SELECT cam_id FROM campuses WHERE cam_name = 'PGC Gulberg Campus'), (SELECT usr_id FROM users WHERE email = 'sara@pgc.edu.pk'), 1)
ON CONFLICT DO NOTHING;

-- Add Usman to the Multan Campus
INSERT INTO campus_members (cam_id, usr_id, sta_id) VALUES
((SELECT cam_id FROM campuses WHERE cam_name = 'PGC Multan Campus'), (SELECT usr_id FROM users WHERE email = 'usman@pgc.edu.pk'), 1)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 4. ASSIGN ROLES (The Multi-Tenant Magic)
-- ==========================================

-- Ali is a TEACHER at Gulberg Campus
INSERT INTO user_roles (usr_id, rol_id, cam_id) VALUES
((SELECT usr_id FROM users WHERE email = 'ali@pgc.edu.pk'), (SELECT rol_id FROM roles WHERE rol_name = 'teacher'), (SELECT cam_id FROM campuses WHERE cam_name = 'PGC Gulberg Campus'))
ON CONFLICT DO NOTHING;

-- Sara is a CAMPUS_ADMIN at Gulberg Campus
INSERT INTO user_roles (usr_id, rol_id, cam_id) VALUES
((SELECT usr_id FROM users WHERE email = 'sara@pgc.edu.pk'), (SELECT rol_id FROM roles WHERE rol_name = 'campus_admin'), (SELECT cam_id FROM campuses WHERE cam_name = 'PGC Gulberg Campus'))
ON CONFLICT DO NOTHING;

-- Sara is ALSO a TEACHER at Multan Campus (Proving your SAD architecture works!)
INSERT INTO user_roles (usr_id, rol_id, cam_id) VALUES
((SELECT usr_id FROM users WHERE email = 'sara@pgc.edu.pk'), (SELECT rol_id FROM roles WHERE rol_name = 'teacher'), (SELECT cam_id FROM campuses WHERE cam_name = 'PGC Multan Campus'))
ON CONFLICT DO NOTHING;

-- Usman is an ORGANISATION_ADMIN at the Head Office level (No cam_id)
INSERT INTO user_roles (usr_id, rol_id, head_off_id) VALUES
((SELECT usr_id FROM users WHERE email = 'usman@pgc.edu.pk'), (SELECT rol_id FROM roles WHERE rol_name = 'organisation_admin'), (SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'))
ON CONFLICT DO NOTHING;