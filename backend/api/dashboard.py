from fastapi import APIRouter, HTTPException
from backend.config import get_connection_string
from psycopg.rows import dict_row
import psycopg

router = APIRouter()

@router.get("/me")
def get_user_dashboard(usr_id: int):
    try:
        conn = psycopg.connect(get_connection_string())
        with conn.cursor(row_factory=dict_row) as cursor:
            
            # 1. Get User Info & Roles
            cursor.execute("""
                SELECT u.usr_id, u.first_name, u.last_name, u.email, r.rol_name 
                FROM users u
                JOIN user_roles ur ON u.usr_id = ur.usr_id
                JOIN roles r ON ur.rol_id = r.rol_id
                WHERE u.usr_id = %s
            """, (usr_id,))
            roles = cursor.fetchall()
            
            if not roles:
                raise HTTPException(status_code=404, detail="User not found or has no roles")
            
            user_info = {
                "usr_id": roles[0]["usr_id"],
                "first_name": roles[0]["first_name"],
                "last_name": roles[0]["last_name"],
                "email": roles[0]["email"],
            }
            role_names = [r["rol_name"] for r in roles]

            # 2. Determine Dashboard Type and Fetch Data
            if "platform_admin" in role_names:
                # PLATFORM ADMIN DASHBOARD
                cursor.execute("SELECT COUNT(*) AS total FROM head_offices")
                total_ho = cursor.fetchone()["total"]
                
                cursor.execute("SELECT COUNT(*) AS total FROM campuses")
                total_camp = cursor.fetchone()["total"]
                
                cursor.execute("SELECT COUNT(*) AS total FROM users")
                total_usr = cursor.fetchone()["total"]

                return {
                    "dashboard_type": "platform",
                    "user": user_info,
                    "roles": role_names,
                    "stats": {
                        "total_head_offices": total_ho,
                        "total_campuses": total_camp,
                        "total_users": total_usr
                    }
                }
            else:
                # TENANT DASHBOARD (Teacher, Campus Admin, etc.)
                cursor.execute("""
                    SELECT r.rol_name, c.cam_name, h.head_off_name
                    FROM user_roles ur
                    JOIN roles r ON ur.rol_id = r.rol_id
                    LEFT JOIN campuses c ON ur.cam_id = c.cam_id
                    LEFT JOIN head_offices h ON ur.head_off_id = h.head_off_id
                    WHERE ur.usr_id = %s
                """, (usr_id,))
                contexts = cursor.fetchall()

                return {
                    "dashboard_type": "tenant",
                    "user": user_info,
                    "roles": role_names,
                    "contexts": contexts,
                    "stats": {
                        "total_questions": 1240, # Mock data for now
                        "upcoming_exams": 3,
                        "students_enrolled": 450
                    }
                }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()