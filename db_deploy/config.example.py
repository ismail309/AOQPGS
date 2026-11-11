# db_deploy/config.example.py
# Copy this file to config.py and fill in your credentials.

DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'paperpilot'
DB_USER = 'paperpilot_db_migrator'
DB_PASS = 'YOUR_MIGRATOR_PASSWORD_HERE'

def get_migration_connection_string():
    return f"host={DB_HOST} port={DB_PORT} dbname={DB_NAME} user={DB_USER} password={DB_PASS}"