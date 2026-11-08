-- 1. Subjects Table
CREATE TABLE IF NOT EXISTS Subjects (
    SubjectID SERIAL PRIMARY KEY, -- PostgreSQL uses SERIAL for auto-increment
    SubjectName VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Questions Table
CREATE TABLE IF NOT EXISTS Questions (
    QuestionID SERIAL PRIMARY KEY,
    SubjectID INT REFERENCES Subjects(SubjectID) ON DELETE CASCADE,
    Difficulty VARCHAR(20) NOT NULL CHECK (Difficulty IN ('Easy', 'Medium', 'Hard')),
    QuestionText TEXT NOT NULL, -- PostgreSQL uses TEXT instead of NVARCHAR(MAX)
    OptionA TEXT,
    OptionB TEXT,
    OptionC TEXT,
    OptionD TEXT,
    CorrectAnswer VARCHAR(10) CHECK (CorrectAnswer IN ('A', 'B', 'C', 'D'))
);