-- sql/stored_procedures/sp_manage_questions.sql

-- We use CREATE OR REPLACE so the deployment tool can run this file every time safely.
CREATE OR REPLACE FUNCTION sp_manage_questions(
    p_action VARCHAR,          -- 'ADD', 'UPDATE', 'DELETE'
    p_question_id INT DEFAULT NULL,
    p_subject_id INT DEFAULT NULL,
    p_difficulty VARCHAR DEFAULT NULL,
    p_question_text TEXT DEFAULT NULL,
    p_option_a TEXT DEFAULT NULL,
    p_option_b TEXT DEFAULT NULL,
    p_option_c TEXT DEFAULT NULL,
    p_option_d TEXT DEFAULT NULL,
    p_correct_answer VARCHAR DEFAULT NULL
) RETURNS TEXT AS $$
BEGIN
    -- 1. ADD ACTION
    IF UPPER(p_action) = 'ADD' THEN
        INSERT INTO Questions (
            SubjectID, Difficulty, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectAnswer
        ) VALUES (
            p_subject_id, p_difficulty, p_question_text, p_option_a, p_option_b, p_option_c, p_option_d, p_correct_answer
        );
        RETURN 'Question added successfully.';

    -- 2. UPDATE ACTION
    ELSIF UPPER(p_action) = 'UPDATE' THEN
        IF p_question_id IS NULL THEN
            RETURN 'Error: QuestionID is required for UPDATE.';
        END IF;

        UPDATE Questions
        SET 
            SubjectID = COALESCE(p_subject_id, SubjectID),
            Difficulty = COALESCE(p_difficulty, Difficulty),
            QuestionText = COALESCE(p_question_text, QuestionText),
            OptionA = COALESCE(p_option_a, OptionA),
            OptionB = COALESCE(p_option_b, OptionB),
            OptionC = COALESCE(p_option_c, OptionC),
            OptionD = COALESCE(p_option_d, OptionD),
            CorrectAnswer = COALESCE(p_correct_answer, CorrectAnswer)
        WHERE QuestionID = p_question_id;
        
        IF FOUND THEN
            RETURN 'Question updated successfully.';
        ELSE
            RETURN 'Error: Question not found.';
        END IF;

    -- 3. DELETE ACTION
    ELSIF UPPER(p_action) = 'DELETE' THEN
        IF p_question_id IS NULL THEN
            RETURN 'Error: QuestionID is required for DELETE.';
        END IF;

        DELETE FROM Questions WHERE QuestionID = p_question_id;
        
        IF FOUND THEN
            RETURN 'Question deleted successfully.';
        ELSE
            RETURN 'Error: Question not found.';
        END IF;

    ELSE
        RETURN 'Error: Invalid action. Use ADD, UPDATE, or DELETE.';
    END IF;
END;
$$ LANGUAGE plpgsql;