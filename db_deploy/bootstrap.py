# db_deploy/bootstrap.py
import os
import psycopg
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SUPERUSER_PASS = os.getenv("PG_SUPERUSER_PASS")
MIGRATOR_PASS = os.getenv("MIGRATOR_PASS")
APP_PASS = os.getenv("APP_PASS")

def bootstrap_database():
    print("=== PaperPilot DB Bootstrap ===")
    
    if not all([SUPERUSER_PASS, MIGRATOR_PASS, APP_PASS]):
        print("❌ Error: Missing environment variables. Check your .env file.")
        return

    try:
        # 1. Connect to the default 'postgres' database as superuser
        print("Connecting to PostgreSQL as superuser...")
        conn = psycopg.connect(
            host="localhost", port="5432", dbname="postgres", 
            user="postgres", password=SUPERUSER_PASS, autocommit=True
        )
        cursor = conn.cursor()

        # 2. Create the Database
        print("Checking if database 'paperpilot' exists...")
        cursor.execute("SELECT 1 FROM pg_database WHERE datname='paperpilot'")
        if not cursor.fetchone():
            print("Creating database 'paperpilot'...")
            cursor.execute("CREATE DATABASE paperpilot")
        else:
            print("Database 'paperpilot' already exists.")

        # 3. Create the Roles
        print("Creating roles...")
        cursor.execute(f"""
            DO $$
            BEGIN
               IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'paperpilot_db_migrator') THEN
                  CREATE ROLE paperpilot_db_migrator WITH LOGIN PASSWORD '{MIGRATOR_PASS}';
               END IF;
               IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'paperpilot_app') THEN
                  CREATE ROLE paperpilot_app WITH LOGIN PASSWORD '{APP_PASS}';
               END IF;
            END
            $$;
        """)

        # 4. Configure Permissions
        print("Configuring permissions...")
        cursor.execute("ALTER DATABASE paperpilot OWNER TO paperpilot_db_migrator;")
        
        # Connect to the new database to set schema ownership
        conn.close()
        conn = psycopg.connect(
            host="localhost", port="5432", dbname="paperpilot", 
            user="postgres", password=SUPERUSER_PASS, autocommit=True
        )
        cursor = conn.cursor()
        
        cursor.execute("ALTER SCHEMA public OWNER TO paperpilot_db_migrator;")
        cursor.execute("GRANT CONNECT ON DATABASE paperpilot TO paperpilot_app;")
        cursor.execute("GRANT USAGE ON SCHEMA public TO paperpilot_app;")

        print("✅ Bootstrap successful! You can now run `uv run python db_deploy/deploy.py`")
        conn.close()

    except Exception as e:
        print(f"❌ Bootstrap failed: {e}")

if __name__ == "__main__":
    bootstrap_database()