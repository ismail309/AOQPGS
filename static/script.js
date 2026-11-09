let answersHidden = true;

async function generatePaper() {
    const subject = document.getElementById('subject').value;
    const easy = document.getElementById('easy').value;
    const medium = document.getElementById('medium').value;
    const hard = document.getElementById('hard').value;

    const container = document.getElementById('paper-container');
    const loading = document.getElementById('loading');
    const toggleBtn = document.getElementById('toggle-btn');

    container.innerHTML = '';
    loading.style.display = 'block';
    toggleBtn.style.display = 'none'; // Hide button while generating

    try {
        const response = await fetch(`/generate?subject=${subject}&easy=${easy}&medium=${medium}&hard=${hard}`);

         // NEW: Check if the response is a 404 (No questions found)
        if (response.status === 404) {
            loading.style.display = 'none';
            container.innerHTML = '<p style="color:#e67e22; text-align:center; font-weight:bold;">No questions found in the database for this subject/difficulty combination. Please choose a different criteria or add more questions.</p>';
            return;
        }
        
        const data = await response.json();

        loading.style.display = 'none';

         // NEW: Check if the response is a 404 (No questions found)
        if (response.status === 404) {
            loading.style.display = 'none';
            container.innerHTML = '<p style="color:#e67e22; text-align:center; font-weight:bold;">No questions found in the database for this subject/difficulty combination. Please choose a different criteria or add more questions.</p>';
            return;
        }


        if (data.total_questions === 0) {
            container.innerHTML = '<p style="color:red; text-align:center;">No questions found for this criteria.</p>';
            return;
        }

        // Show the toggle button now that we have a paper
        toggleBtn.style.display = 'inline-block';
        toggleBtn.innerText = 'Show Answer Key';
        answersHidden = true;

        data.paper.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.innerHTML = `
            <div class="question-text">Q${index + 1}. ${q.questiontext} <span style="font-size:12px; color:gray;">(${q.difficulty})</span></div>
            <ul class="options">
                <li>A) ${q.optiona}</li>
                <li>B) ${q.optionb}</li>
                <li>C) ${q.optionc}</li>
                <li>D) ${q.optiond}</li>
            </ul>
            <div class="answer-key" style="display:none; margin-top:10px; color:#27ae60; font-weight:bold;">
                Correct Answer: ${q.correctanswer}
            </div>
        `;
            container.appendChild(card);
        });

    } catch (error) {
        loading.style.display = 'none';
        container.innerHTML = '<p style="color:red; text-align:center;">Error connecting to AOQPGS backend.</p>';
        console.error(error);
    }
}

// NEW: Toggle Answer Key Function
function toggleAnswers() {
    const answers = document.querySelectorAll('.answer-key');
    const toggleBtn = document.getElementById('toggle-btn');

    if (answersHidden) {
        answers.forEach(a => a.style.display = 'block');
        toggleBtn.innerText = 'Hide Answer Key';
        toggleBtn.style.backgroundColor = '#e74c3c'; // Turn red
        answersHidden = false;
    } else {
        answers.forEach(a => a.style.display = 'none');
        toggleBtn.innerText = 'Show Answer Key';
        toggleBtn.style.backgroundColor = '#27ae60'; // Turn green
        answersHidden = true;
    }
}