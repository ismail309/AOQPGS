import psycopg2
import os
import sys

# Add the parent directory to path so we can import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_connection_string, DB_NAME

def deploy():
    try:
        # Connect to the database
        conn = psycopg2.connect(get_connection_string())
        conn.autocommit = True
        cursor = conn.cursor()

        print(f"Connected to database '{DB_NAME}'.")

        # Execute schema and seed files in order
        sql_files = ['01_schema.sql', '02_seed_data.sql']
        
        for file in sql_files:
            filepath = os.path.join(os.path.dirname(__file__), file)
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    sql_script = f.read()
                
                # psycopg2 can execute the whole script at once
                cursor.execute(sql_script)
                print(f"Executed: {file}")

        print("Deployment successful!")
        conn.close()

    except Exception as e:
        print(f"Deployment failed: {e}")

if __name__ == "__main__":
    deploy()