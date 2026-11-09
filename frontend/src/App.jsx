import { useState } from 'react';
import './App.css';

function App() {
  const [subject, setSubject] = useState('Python');
  const [easy, setEasy] = useState(1);
  const [medium, setMedium] = useState(1);
  const [hard, setHard] = useState(1);
  
  const [paper, setPaper] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePaper = async () => {
    setLoading(true);
    setError(null);
    setPaper([]);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/generate?subject=${subject}&easy=${easy}&medium=${medium}&hard=${hard}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate paper');
      }

      setPaper(data.paper);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AOQPGS</h1>
      <p className="subtitle">Automated Online Question Paper Generation System</p>

      <div className="controls">
        <div className="input-group">
          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
            <option value="Data Engineering">Data Engineering</option>
          </select>
        </div>

        <div className="input-group">
          <label>Easy Qs</label>
          <input type="number" min="0" value={easy} onChange={(e) => setEasy(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Medium Qs</label>
          <input type="number" min="0" value={medium} onChange={(e) => setMedium(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Hard Qs</label>
          <input type="number" min="0" value={hard} onChange={(e) => setHard(e.target.value)} />
        </div>

        <button onClick={generatePaper} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Exam'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="paper-container">
        {paper.map((q, index) => (
          <div key={q.questionid} className="question-card">
            <div className="question-text">
              Q{index + 1}. {q.questiontext} <span className="difficulty">({q.difficulty})</span>
            </div>
            <ul className="options">
              <li>A) {q.optiona}</li>
              <li>B) {q.optionb}</li>
              <li>C) {q.optionc}</li>
              <li>D) {q.optiond}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;