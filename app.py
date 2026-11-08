from flask import Flask, jsonify, request, render_template
import psycopg2
import psycopg2.extras # Required for RealDictCursor
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

    try:
        conn = psycopg2.connect(get_connection_string())
        # RealDictCursor turns the database rows into Python dictionaries
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        final_paper = []
        
        def fetch_questions(difficulty, count):
            if count == 0: return []
            
            query = """
                SELECT q.* 
                FROM Questions q
                JOIN Subjects s ON q.SubjectID = s.SubjectID
                WHERE s.SubjectName = %s AND q.Difficulty = %s
            """
            cursor.execute(query, (subject, difficulty))
            questions = cursor.fetchall()
            
            # Convert RealDictRow to standard dict (just in case)
            questions = [dict(q) for q in questions]
            
            if len(questions) <= count:
                return questions
            return random.sample(questions, count)

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
        
    except Exception as e:
        # This will print the exact error to your terminal
        print(f"BACKEND ERROR: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)