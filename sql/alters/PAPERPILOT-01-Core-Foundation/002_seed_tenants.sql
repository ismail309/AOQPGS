-- ==========================================
-- SEED DATA
-- ==========================================

INSERT INTO statuses (sta_group, sta_name, description) VALUES
('general', 'active', 'Record is active'),
('general', 'inactive', 'Record is inactive'),
('general', 'archived', 'Record is archived'),
('question', 'draft', 'Question is in draft mode'),
('question', 'pending_review', 'Question is awaiting review'),
('question', 'approved', 'Question is approved'),
('question', 'rejected', 'Question was rejected'),
('exam', 'finalised', 'Exam is finalised and locked'),
('exam', 'published', 'Exam is published to students'),
('exam', 'completed', 'Exam has been completed'),
('exam', 'cancelled', 'Exam was cancelled')
ON CONFLICT DO NOTHING;

INSERT INTO account_types (act_name, description) VALUES
('individual', 'Independent teacher'),
('organisation', 'School, College, or University'),
('platform', 'SaaS Administrator')
ON CONFLICT DO NOTHING;

INSERT INTO roles (rol_name, description) VALUES
('platform_admin', 'SaaS platform administrator'),
('organisation_admin', 'Head Office administrator for an organisation'),
('campus_admin', 'Administrator for a specific campus'),
('teacher', 'Teacher who can create exams and manage questions'),
('student', 'Student who takes exams')
ON CONFLICT DO NOTHING;

-- ==========================================
-- SEED DATA: HEAD OFFICES
-- ==========================================
INSERT INTO head_offices (head_off_name, email, phone_no, city, sta_id) VALUES
('Punjab Group of Colleges', 'info@pgc.edu.pk', '042-111-111-222', 'Lahore', fn_get_status_id('general', 'active')),
('Beaconhouse School System', 'contact@beaconhouse.edu.pk', '042-111-232-232', 'Lahore', fn_get_status_id('general', 'active')),
('The City School', 'info@thecityschool.edu.pk', '021-111-243-243', 'Karachi', fn_get_status_id('general', 'active')),
('Roots Millennium Schools', 'info@rootsinternational.edu.pk', '051-111-766-877', 'Islamabad', fn_get_status_id('general', 'active')),
('National Grammar School', 'info@ngs.edu.pk', '042-3577-8900', 'Lahore', fn_get_status_id('general', 'active'));

-- ==========================================
-- SEED DATA: CAMPUSES
-- ==========================================

-- Punjab Group Campuses
INSERT INTO campuses (head_off_id, cam_name, city, sta_id) VALUES
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'), 'PGC Gulberg Campus', 'Lahore', fn_get_status_id('general', 'active')),
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'), 'PGC Multan Campus', 'Multan', fn_get_status_id('general', 'active')),
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Punjab Group of Colleges'), 'PGC Faisalabad Campus', 'Faisalabad', fn_get_status_id('general', 'active'));

-- Beaconhouse Campuses
INSERT INTO campuses (head_off_id, cam_name, city, sta_id) VALUES
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Beaconhouse School System'), 'BSS Johar Town Campus', 'Lahore', fn_get_status_id('general', 'active')),
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Beaconhouse School System'), 'BSS DHA Campus', 'Lahore', fn_get_status_id('general', 'active'));

-- The City School Campuses
INSERT INTO campuses (head_off_id, cam_name, city, sta_id) VALUES
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'The City School'), 'TCS Clifton Campus', 'Karachi', fn_get_status_id('general', 'active')),
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'The City School'), 'TCS DHA Campus', 'Karachi', fn_get_status_id('general', 'active'));

-- Roots Millennium Campuses
INSERT INTO campuses (head_off_id, cam_name, city, sta_id) VALUES
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'Roots Millennium Schools'), 'Roots F-11 Campus', 'Islamabad', fn_get_status_id('general', 'active'));

-- National Grammar School Campuses
INSERT INTO campuses (head_off_id, cam_name, city, sta_id) VALUES
((SELECT head_off_id FROM head_offices WHERE head_off_name = 'National Grammar School'), 'NGS Main Campus', 'Lahore', fn_get_status_id('general', 'active'));