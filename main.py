# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from psycopg.rows import dict_row
import random
from config import get_connection_string

app = FastAPI(title="AOQPGS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "success", "message": "AOQPGS FastAPI is running!"}

@app.get("/generate")
def generate_paper(subject: str = "Python", easy: int = 1, medium: int = 1, hard: int = 1):
    try:
        # 1. Connect to DB using psycopg (v3)
        conn = psycopg.connect(get_connection_string())
        
        # 2. Create cursor with dict_row factory
        with conn.cursor(row_factory=dict_row) as cursor:
            final_paper = []
            
            def fetch_questions(difficulty: str, count: int):
                if count == 0: 
                    return []
                
                query = """
                    SELECT q.* 
                    FROM Questions q
                    JOIN Subjects s ON q.SubjectID = s.SubjectID
                    WHERE s.SubjectName = %s AND q.Difficulty = %s
                """
                cursor.execute(query, (subject, difficulty))
                # Fetch all and convert to a standard list of dicts
                questions = [dict(row) for row in cursor.fetchall()]
                
                if len(questions) <= count:
                    return questions
                return random.sample(questions, count)

            final_paper.extend(fetch_questions("Easy", easy))
            final_paper.extend(fetch_questions("Medium", medium))
            final_paper.extend(fetch_questions("Hard", hard))
            
        # Close connection
        conn.close()
        
        random.shuffle(final_paper)

        if not final_paper:
            raise HTTPException(status_code=404, detail="No questions found for this subject/difficulty combination.")

        return {
            "project": "AOQPGS",
            "subject": subject,
            "total_questions": len(final_paper),
            "paper": final_paper
        }
        
    except Exception as e:
        print(f"Database Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
