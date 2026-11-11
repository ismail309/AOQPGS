# config.py
SERVER = 'localhost' 
DATABASE = 'AOQPGS_DB'
USERNAME = 'sa' 
PASSWORD = 'YOUR_PASSWORD_HERE'

def get_connection_string(db_name=None):
    target_db = db_name if db_name else DATABASE
    return f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SERVER};DATABASE={target_db};UID={USERNAME};PWD={PASSWORD}'