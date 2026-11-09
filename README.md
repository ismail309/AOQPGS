# AOQPGS - Automated Online Question Paper Generation System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📌 Project Overview
AOQPGS is a **modern, decoupled full-stack web application** designed to automate the process of generating examination papers. It allows educators to dynamically create randomized question papers based on subject and difficulty criteria.

This project demonstrates an enterprise-grade architecture, featuring a **React** frontend, a **FastAPI** backend, a **PostgreSQL** database, and an automated **Python-based database deployment tool** that migrates SQL scripts directly from GitHub.

## 🚀 Features
- **Automated Paper Generation:** Dynamically queries the PostgreSQL database and randomly selects questions based on user-defined difficulty levels.
- **Decoupled Architecture:** Separate React frontend and FastAPI backend communicating via a REST API.
- **Database Migration Tool:** A custom Python tool (`db_deploy`) that fetches SQL scripts from the GitHub `dev` branch and applies them to the database in sequence, tracking executed scripts in an `alters` table.
- **Stored Procedures:** Complex CRUD operations handled at the database level using PostgreSQL functions.
- **Modern Python Tooling:** Uses `uv` for lightning-fast dependency management.

## 🛠️ Tech Stack
- **Frontend:** React (via Vite), HTML/CSS, JavaScript
- **Backend:** Python, FastAPI, Uvicorn
- **Database:** PostgreSQL
- **Database Driver:** `psycopg` (v3)
- **Package Managers:** `npm` (Frontend), `uv` (Backend)

## 📂 Project Structure
```text
AOQPGS/
│
├── frontend/               # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main UI logic
│   │   └── App.css         # Styling
│   └── package.json        
│
├── db_deploy/              # Database Engineering Tool
│   └── deploy.py           # Fetches SQL from GitHub & deploys
│
├── sql/                    # SQL Scripts
│   ├── alters/             # Schema changes (run once)
│   │   └── AOQPGS-01-Initilize-database/
│   │       ├── 001_schema.sql
│   │       └── 002_seed_data.sql
│   └── stored_procedures/  # Business logic (run every deployment)
│       └── sp_manage_questions.sql
│
├── main.py                 # FastAPI Application & API routes
├── config.py               # Database credentials (ignored by Git)
├── config.example.py       # Template for database credentials
├── requirements.txt        # Python dependencies
└── pyproject.toml          # uv project configuration
```

## 💻 How to Run Locally
### 1️⃣ Prerequisites
Ensure you have the following installed on your machine:

Python 3.10+
PostgreSQL (running on port 5432)
Node.js & npm (for the React frontend)
uv (Python package manager)

### 2️⃣ Set Up the Database
Create a PostgreSQL database named aoqpgs_db.
Duplicate config.example.py and rename it to config.py.
Open config.py and update the DB_PASS with your PostgreSQL password.

### 3️⃣ Run the Database Migration Tool
This tool will fetch the latest SQL scripts from the GitHub dev branch and execute them:
```sh
# Create virtual environment and install dependencies
uv venv
uv pip install -r requirements.txt

# Run the deployment tool
uv run python db_deploy/deploy.py
```

### 4️⃣ Start the FastAPI Backend
Open a terminal and run:
```sh
uv run uvicorn main:app --reload
```
The API will run at http://127.0.0.1:8000
You can view the interactive Swagger API documentation at http://127.0.0.1:8000/docs

### 5️⃣ Start the React Frontend
Open a new terminal window, navigate to the frontend folder, and run:
```sh
cd frontend
npm install
npm run dev
```
The React app will run at http://localhost:5173

## 🔥 Future Enhancements
- 📝 Admin Dashboard: A React form to add/edit questions directly from the UI.
- 🔐 User Authentication: Restrict paper generation to logged-in teachers.
- 📄 PDF Export: Export the generated paper as a printable PDF.
- 📱 Mobile App: React Native app communicating with the same FastAPI backend

## 🤝 Contribution
Feel free to fork this repository and submit pull requests! Contributions are welcome.

## 📜 License
This project is licensed under the MIT License.
 
For queries or collaborations, reach out to me at:
* 🔗 [LinkedIn Profile](https://www.linkedin.com/in/mohammad-ismail-382087105/)
* 💻 [GitHub Profile](https://github.com/ismail309)
