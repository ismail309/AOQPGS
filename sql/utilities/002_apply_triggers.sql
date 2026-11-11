-- Apply to users
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Apply to head_offices
DROP TRIGGER IF EXISTS trg_head_offices_updated_at ON head_offices;
CREATE TRIGGER trg_head_offices_updated_at BEFORE UPDATE ON head_offices FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Apply to campuses
DROP TRIGGER IF EXISTS trg_campuses_updated_at ON campuses;
CREATE TRIGGER trg_campuses_updated_at BEFORE UPDATE ON campuses FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Apply to organisation_members
DROP TRIGGER IF EXISTS trg_org_members_updated_at ON organisation_members;
CREATE TRIGGER trg_org_members_updated_at BEFORE UPDATE ON organisation_members FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Apply to campus_members
DROP TRIGGER IF EXISTS trg_campus_members_updated_at ON campus_members;
CREATE TRIGGER trg_campus_members_updated_at BEFORE UPDATE ON campus_members FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();