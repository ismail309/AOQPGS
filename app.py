# app.py
from flask import Flask, jsonify, request, render_template
import pyodbc
import random
from config import get_connection_string

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['GET'])
def generate_paper():
    subject = request.args.get('subject', default='Python')
    easy_count = int(request.args.get('easy', default=1))
    medium_count = int(request.args.get('medium', default=1))
    hard_count = int(request.args.get('hard', default=1))

    conn = pyodbc.connect(get_connection_string())
    cursor = conn.cursor()
    final_paper = []
    
    def fetch_questions(difficulty, count):
        if count == 0: return []
        cursor.execute("SELECT * FROM Questions WHERE Subject = ? AND Difficulty = ?", (subject, difficulty))
        columns = [column[0] for column in cursor.description]
        questions = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return random.sample(questions, count) if len(questions) > count else questions

    final_paper.extend(fetch_questions("Easy", easy_count))
    final_paper.extend(fetch_questions("Medium", medium_count))
    final_paper.extend(fetch_questions("Hard", hard_count))
    
    conn.close()
    random.shuffle(final_paper)

    if not final_paper:
        return jsonify({"error": "No questions found."}), 404

    return jsonify({
        "project": "AOQPGS",
        "subject": subject,
        "total_questions": len(final_paper),
        "paper": final_paper
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)