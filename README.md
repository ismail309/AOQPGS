# AOQPGS - Automated Online Question Paper Generation System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

AOQPGS is a full-stack web application designed to automate the process of generating examination papers. It allows educators to dynamically create randomized question papers based on subject, difficulty, and custom criteria, eliminating manual effort and ensuring fair, unique exams for every student.

## 🚀 Features

*   **Dynamic Question Generation:** Randomly selects questions from a centralized question bank based on user-defined difficulty levels (Easy, Medium, Hard).
*   **Answer Key Toggle:** A secure frontend toggle that allows teachers to reveal or hide the correct answers instantly.
*   **Relational Database:** Built on PostgreSQL to enforce strict data integrity (Foreign Keys, Check Constraints).
*   **Modern Python Tooling:** Uses `uv` for lightning-fast dependency management and virtual environments.
*   **Secure Configuration:** Database credentials are isolated and ignored by Git to prevent leaks.

## 🛠️ Tech Stack

*   **Backend:** Python, Flask
*   **Database:** PostgreSQL
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
*   **Database Driver:** `psycopg2`

## 📂 Project Structure

```text
AOQPGS/
│
├── app.py                  # Main Flask application & API routes
├── config.py               # Database credentials (ignored by Git)
├── config.example.py       # Template for database credentials
├── pyproject.toml          # Python project configuration (uv)
├── requirements.txt        # Python dependencies
│
├── database/               # Database Engineering Scripts
│   ├── 01_schema.sql       # Table creation (DDL)
│   ├── 02_seed_data.sql    # Initial dummy data
│   └── deploy.py           # Automated database deployment script
│
├── templates/              # HTML Frontend
│   └── index.html          
│
└── static/                 # CSS & JavaScript Frontend
    ├── script.js           
    └── style.css

💻 How to Run Locally
1. Clone the repository
git clone https://github.com/ismail309/AOQPGS.git
cd AOQPGS

2. Set up the environment (using uv)

# Create virtual environment
uv venv

# Install dependencies
uv pip install -r requirements.txt
3. Configure the Database
Ensure PostgreSQL is running on your machine.

Create a database named aoqpgs_db.

Duplicate config.example.py and rename it to config.py.

Open config.py and update the DB_PASS with your PostgreSQL password.

4. Deploy the Database Schema
Run the automated deployment script to create the tables and insert the initial dummy questions:
uv run python database/deploy.py

5. Start the Web Server
uv run python app.py

6. Open in Browser
Navigate to http://127.0.0.1:5000 in your web browser. Select a subject, choose the number of questions, and click Generate Exam.

## 👨‍💻 Author
**Muhammad Ismail** 
*Data Engineer*

* 🔗 [LinkedIn Profile](https://www.linkedin.com/in/mohammad-ismail-382087105/)
* 💻 [GitHub Profile](https://github.com/ismail309)
