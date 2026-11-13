-- ==========================================
-- SEED DATA: PLATFORM ADMIN (Ismail)
-- ==========================================

INSERT INTO  users (act_id, sta_id, first_name, last_name, email, password_hash) VALUES
(fn_get_account_type_id('platform'), fn_get_status_id('general', 'active'), 'Ismail', 'Rana', 'ismail@paperpilot.live', '$argon2id$v=19$m=65536,t=3,p=4$H0qEDwUSRB05ISMuLQa3xg$2JKFTDSPqAHF5j+Yc7Tuse7pTk5JHDlRew6j2hDxRXU')
ON CONFLICT (email) DO NOTHING;

INSERT INTO  user_roles (usr_id, rol_id) VALUES
(fn_get_user_id_by_email('ismail@paperpilot.live'), fn_get_role_id('platform_admin'))
ON CONFLICT DO NOTHING;