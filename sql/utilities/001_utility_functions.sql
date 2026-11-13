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

-- ==========================================
-- UTILITY: Get User ID by Email
-- ==========================================
CREATE OR REPLACE FUNCTION fn_get_user_id_by_email(p_email VARCHAR)
RETURNS INT AS $$
DECLARE
    v_usr_id INT;
BEGIN
    SELECT usr_id INTO v_usr_id
    FROM  users
    WHERE email = p_email;

    IF v_usr_id IS NULL THEN
        RAISE EXCEPTION 'User not found with email: %', p_email;
    END IF;
    RETURN v_usr_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- UTILITY: Get Role ID by Name (NEW)
-- ==========================================
CREATE OR REPLACE FUNCTION fn_get_role_id(p_role_name VARCHAR)
RETURNS INT AS $$
DECLARE
    v_rol_id INT;
BEGIN
    SELECT rol_id INTO v_rol_id
    FROM public.roles
    WHERE rol_name = p_role_name;

    IF v_rol_id IS NULL THEN
        RAISE EXCEPTION 'Role not found: %', p_role_name;
    END IF;
    RETURN v_rol_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- UTILITY: Get Account Type ID by Name (NEW)
-- ==========================================
CREATE OR REPLACE FUNCTION fn_get_account_type_id(p_type_name VARCHAR)
RETURNS INT AS $$
DECLARE
    v_act_id INT;
BEGIN
    SELECT act_id INTO v_act_id
    FROM public.account_types
    WHERE act_name = p_type_name;

    IF v_act_id IS NULL THEN
        RAISE EXCEPTION 'Account Type not found: %', p_type_name;
    END IF;
    RETURN v_act_id;
END;
$$ LANGUAGE plpgsql;