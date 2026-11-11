# db_deploy/deploy.py
import os
import re
import psycopg
import sys
import urllib.request
import zipfile
import shutil

# Import your database credentials
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_migration_connection_string

# --- GITHUB CONFIGURATION ---
GITHUB_REPO = "ismail309/AOQPGS"
GITHUB_BRANCH = "dev"
# ----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQL_DIR = os.path.join(BASE_DIR, 'sql')
TEMP_DIR = os.path.join(BASE_DIR, 'db_deploy', 'temp_fetch')
ALTERS_DIR = os.path.join(TEMP_DIR, 'sql', 'alters')
UTILS_DIR = os.path.join(SQL_DIR, 'utilities')
PROCS_DIR = os.path.join(TEMP_DIR, 'sql', 'stored_procedures')

def fetch_from_github():
    """Downloads the latest SQL folder from the dev branch on GitHub."""
    print(f"⬇️ Fetching latest SQL scripts from {GITHUB_REPO} ({GITHUB_BRANCH} branch)...")
    
    # Clean up old temp folder if it exists
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR)

    # GitHub API URL to download the repo as a zip file
    zip_url = f"https://github.com/{GITHUB_REPO}/archive/refs/heads/{GITHUB_BRANCH}.zip"
    zip_path = os.path.join(TEMP_DIR, "repo.zip")

    try:
        urllib.request.urlretrieve(zip_url, zip_path)
        
        # Extract the zip file
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(TEMP_DIR)
        
        # GitHub extracts into a folder named like "PaperPilot-{GITHUB_BRANCH}"
        extracted_folder = os.path.join(TEMP_DIR, f"PaperPilot-{GITHUB_BRANCH}")
        
        # UPDATE ALL THREE PATHS TO THE TEMP FOLDER
        global ALTERS_DIR, UTILS_DIR, PROCS_DIR
        ALTERS_DIR = os.path.join(extracted_folder, 'sql', 'alters')
        UTILS_DIR = os.path.join(extracted_folder, 'sql', 'utilities') # <-- ADDED THIS
        PROCS_DIR = os.path.join(extracted_folder, 'sql', 'stored_procedures')
        
        print("✅ Fetch successful.")
    except Exception as e:
        print(f"❌ Failed to fetch from GitHub: {e}")
        sys.exit(1)

def get_db_connection():
    return psycopg.connect(get_migration_connection_string())

def setup_tracking_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alters (
            alt_id SERIAL PRIMARY KEY,
            task_name VARCHAR(200) NOT NULL,
            num INT DEFAULT NULL,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ended_at TIMESTAMP DEFAULT NULL,
            UNIQUE (task_name, num)
        );
    ''')

def run_alter_folders(conn, cursor):
    if not os.path.exists(ALTERS_DIR):
        print("No 'alters' directory found. Skipping.")
        return

    folders = sorted([f for f in os.listdir(ALTERS_DIR) if os.path.isdir(os.path.join(ALTERS_DIR, f))])

    for folder_name in folders:
        folder_path = os.path.join(ALTERS_DIR, folder_name)
        sql_files = sorted([f for f in os.listdir(folder_path) if f.endswith('.sql')])

        for file in sql_files:
            match = re.match(r'^(\d+)', file)
            if not match:
                continue
            
            script_num = int(match.group(1))

            cursor.execute(
                "SELECT alt_id FROM alters WHERE task_name = %s AND num = %s", 
                (folder_name, script_num)
            )
            if cursor.fetchone():
                print(f"✅ {folder_name} -> {file} already executed. Skipping.")
                continue

            print(f"\n🚀 Executing: {folder_name} -> {file}...")
            
            try:
                cursor.execute(
                    "INSERT INTO alters (task_name, num, started_at) VALUES (%s, %s, CURRENT_TIMESTAMP)", 
                    (folder_name, script_num)
                )
                conn.commit()

                filepath = os.path.join(folder_path, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    cursor.execute(f.read())
                
                cursor.execute(
                    "UPDATE alters SET ended_at = CURRENT_TIMESTAMP WHERE task_name = %s AND num = %s", 
                    (folder_name, script_num)
                )
                conn.commit()
                print(f"   -> ✅ Success.")
                
            except Exception as e:
                conn.rollback()
                print(f"❌ Error executing {file}: {e}")
                sys.exit(1)

def run_utilities(conn, cursor):
    if not os.path.exists(UTILS_DIR): return
    files = sorted([f for f in os.listdir(UTILS_DIR) if f.endswith('.sql')])
    if not files: return

    print("\n🛠️ Updating Utility Functions...")
    for filename in files:
        print(f"   -> Executing {filename}...")
        filepath = os.path.join(UTILS_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                cursor.execute(f.read())
            except Exception as e:
                conn.rollback()
                print(f"❌ Error in utility {filename}: {e}")
                sys.exit(1)

def run_stored_procedures(conn, cursor):
    if not os.path.exists(PROCS_DIR): return
    files = sorted([f for f in os.listdir(PROCS_DIR) if f.endswith('.sql')])
    if not files: return

    print("\n🔄 Updating Stored Procedures...")
    for filename in files:
        print(f"   -> Executing {filename}...")
        filepath = os.path.join(PROCS_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                cursor.execute(f.read())
            except Exception as e:
                conn.rollback()
                print(f"❌ Error in stored procedure {filename}: {e}")
                sys.exit(1)

def main():
    print("=== PAPERPILOT DB Deployment ===")
    
    # 1. Fetch latest code from GitHub Dev branch
    fetch_from_github()
    
    # 2. Deploy to Database
    try:
        conn = get_db_connection()
        conn.autocommit = False 
        cursor = conn.cursor()

        # 1. Setup Tracking Table
        setup_tracking_table(cursor)
        conn.commit()

        # 2. Run Alters (Only once per folder)
        run_alter_folders(conn, cursor)

        # 3. Run Utilities (Every time, before procs)
        run_utilities(conn, cursor)

        # 4. Run Stored Procedures (Every time)
        run_stored_procedures(conn, cursor)

        print("\n🎉 Deployment completed successfully!")
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"\n❌ Critical Deployment Error: {e}")
    finally:
        # 3. Cleanup temp folder
        if os.path.exists(TEMP_DIR):
            shutil.rmtree(TEMP_DIR)

if __name__ == "__main__":
    main()