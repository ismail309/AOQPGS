from fastapi import APIRouter, HTTPException
from backend.config import get_connection_string
from psycopg.rows import dict_row
import psycopg

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data(usr_id: int):
    try:
        conn = psycopg.connect(get_connection_string())
        with conn.cursor(row_factory=dict_row) as cursor:
            
            # 1. Get User Info
            cursor.execute("""
                SELECT usr_id, first_name, last_name, email 
                FROM public.users 
                WHERE usr_id = %s
            """, (usr_id,))
            user = cursor.fetchone()
            
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            # 2. Get their Roles and Contexts (Multi-tenant mapping)
            cursor.execute("""
                SELECT 
                    r.rol_name, 
                    c.cam_name, 
                    h.head_off_name
                FROM public.user_roles ur
                JOIN public.roles r ON ur.rol_id = r.rol_id
                LEFT JOIN public.campuses c ON ur.cam_id = c.cam_id
                LEFT JOIN public.head_offices h ON ur.head_off_id = h.head_off_id
                WHERE ur.usr_id = %s
            """, (usr_id,))
            roles = cursor.fetchall()

        conn.close()

        # For now, we will return mock stats so the UI looks nice.
        # Later, we will query actual counts from the database.
        return {
            "user": user,
            "roles": roles,
            "stats": {
                "total_questions": 1240,
                "upcoming_exams": 3,
                "students_enrolled": 450
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))