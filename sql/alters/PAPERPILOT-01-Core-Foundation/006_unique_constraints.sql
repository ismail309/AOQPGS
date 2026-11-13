-- 1. Prevent duplicate Head Office names
ALTER TABLE head_offices ADD CONSTRAINT unique_head_off_name UNIQUE (head_off_name);

-- 2. Prevent duplicate Campus names WITHIN the same Head Office
-- (e.g., Two "Main Campus" are allowed if they belong to different organisations)
ALTER TABLE campuses ADD CONSTRAINT unique_campus_per_org UNIQUE (head_off_id, cam_name);