# database.py
import pyodbc
from config import get_connection_string, DATABASE

def setup_db():
    try:
        # 1. Create DB
        master_conn = pyodbc.connect(get_connection_string('master'), autocommit=True)
        master_cursor = master_conn.cursor()
        master_cursor.execute(f"IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '{DATABASE}') CREATE DATABASE {DATABASE}")
        master_conn.close()

        # 2. Connect to DB
        conn = pyodbc.connect(get_connection_string())
        cursor = conn.cursor()

        # 3. Create Table
        cursor.execute('''
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Questions' and xtype='U')
            CREATE TABLE Questions (
                QuestionID INT IDENTITY(1,1) PRIMARY KEY,
                Subject NVARCHAR(50) NOT NULL,
                Difficulty NVARCHAR(20) NOT NULL,
                QuestionText NVARCHAR(MAX) NOT NULL,
                OptionA NVARCHAR(MAX),
                OptionB NVARCHAR(MAX),
                OptionC NVARCHAR(MAX),
                OptionD NVARCHAR(MAX),
                CorrectAnswer NVARCHAR(10)
            )
        ''')

        # 4. Insert Dummy Data (Shortened for brevity, add the full list here)
        cursor.execute("SELECT COUNT(*) FROM Questions")
        if cursor.fetchone()[0] == 0:
            dummy_questions = [
                ("Python", "Easy", "What is the keyword to define a function?", "func", "def", "define", "function", "B"),
                ("SQL", "Easy", "Which SQL statement is used to extract data?", "EXTRACT", "SELECT", "GET", "OPEN", "B"),
            ]
            cursor.executemany('''
                INSERT INTO Questions (Subject, Difficulty, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectAnswer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', dummy_questions)
            conn.commit()
            
        print("AOQPGS Database initialized successfully!")
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_db()