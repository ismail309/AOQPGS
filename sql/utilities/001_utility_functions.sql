-- ==========================================
-- UTILITY: Auto-Update Timestamps
-- ==========================================
-- Attach this trigger to any table with an 'updated_at' column
-- to automatically update it on every UPDATE.

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==========================================
-- UTILITY: Get Status ID by Name
-- ==========================================
-- Instead of hardcoding sta_id = 1, you can call:
-- SELECT fn_get_status_id('question', 'draft');

CREATE OR REPLACE FUNCTION fn_get_status_id(p_group VARCHAR, p_name VARCHAR)
RETURNS INT AS $$
DECLARE
    v_sta_id INT;
BEGIN
    SELECT sta_id INTO v_sta_id
    FROM statuses
    WHERE sta_group = p_group AND sta_name = p_name;

    IF v_sta_id IS NULL THEN
        RAISE EXCEPTION 'Status not found for group: %, name: %', p_group, p_name;
    END IF;

    RETURN v_sta_id;
END;
$$ LANGUAGE plpgsql;