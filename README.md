# AOQPGS - Automated Online Question Paper Generation System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📌 Project Overview
AOQPGS is a **full-stack web application and automated data pipeline** built with Python, Flask, and PostgreSQL. It dynamically generates randomized examination papers by querying a relational database based on user-defined subjects and difficulty levels. This project demonstrates enterprise-level database engineering, backend API development, and frontend data visualization.

## 🚀 Features
- **Automated Paper Generation** using dynamic SQL queries and Python's `random` module
- **Relational Database Storage** with PostgreSQL (enforcing data integrity and foreign keys)
- **Interactive UI** with a secure "Show Answer Key" toggle
- **Database Deployment Scripts** for version-controlled schema management
- **Modular Design** separating frontend logic, backend routes, and database scripts
- **Modern Python Tooling** using `uv` for dependency management

## 🛠️ Tech Stack
- **Python 3.x** (Backend logic)
- **Flask** (Web framework & API routing)
- **PostgreSQL** (Relational database)
- **psycopg2** (Python driver for PostgreSQL)
- **HTML/CSS/JavaScript** (Frontend interface)
- **uv** (Fast Python package manager)


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
```

## 💻 How to Run Locally
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/ismail309/AOQPGS.git
cd AOQPGS
```
### 2️⃣ Set up the environment (using uv)
```sh
# Create virtual environment
uv venv

# Install dependencies
uv pip install -r requirements.txt
```

## 🕷️ How to Use
### 1️⃣ Configure the Database
Ensure PostgreSQL is running on your machine.
Create a database named aoqpgs_db.
Duplicate config.example.py and rename it to config.py.
Open config.py and update the DB_PASS with your PostgreSQL password.

### 2️⃣ Deploy the Database Schema
Run the automated deployment script to create the tables and insert the initial dummy questions:
```sh
uv run python database/deploy.py
```

### 2️⃣ Run the Web Application
```sh
uv run python app.py
```
Navigate to http://127.0.0.1:5000 in your web browser.

## 🔥 Future Enhancements
- 📡 User Authentication (So only teachers can generate papers)
- 📊 PDF Export (Download the generated paper and answer key as a PDF)
- 🕵️ Admin Dashboard (Create and edit questions directly from the UI)

## 🤝 Contribution
Feel free to fork this repository and submit pull requests! Contributions are welcome.

## 📜 License
This project is licensed under the MIT License.
 
For queries or collaborations, reach out to me at:
* 🔗 [LinkedIn Profile](https://www.linkedin.com/in/mohammad-ismail-382087105/)
* 💻 [GitHub Profile](https://github.com/ismail309)
