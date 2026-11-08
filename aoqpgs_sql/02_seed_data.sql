-- Insert Subjects
INSERT INTO Subjects (SubjectName) 
VALUES ('Python'), ('SQL'), ('Data Engineering')
ON CONFLICT (SubjectName) DO NOTHING; -- PostgreSQL syntax for "ignore if exists"

-- Insert Questions
INSERT INTO Questions (SubjectID, Difficulty, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectAnswer)
VALUES 
(1, 'Easy', 'What is the keyword to define a function?', 'func', 'def', 'define', 'function', 'B'),
(1, 'Medium', 'What does PEP 8 stand for?', 'Python Enhancement Proposal', 'Python Execution Plan', 'Primary Error Protocol', 'None', 'A'),
(2, 'Easy', 'Which SQL statement is used to extract data?', 'EXTRACT', 'SELECT', 'GET', 'OPEN', 'B'),
(2, 'Hard', 'What is a correlated subquery?', 'A query inside a query', 'A subquery that depends on the outer query', 'A join', 'A primary key', 'B');