import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/assessment/questions', {
          headers: { 'x-auth-token': token }
        });
        const limited = Array.isArray(res.data) ? res.data.slice(0, 30) : [];
        setQuestions(limited);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      category: questions[currentQuestion].category,
      answer
    };
    
    setResponses(newResponses);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment(newResponses);
    }
  };

  const submitAssessment = async (finalResponses) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/assessment/submit', 
        { responses: finalResponses },
        { headers: { 'x-auth-token': token } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit assessment');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions available</div>;

  const question = questions[currentQuestion];

  return (
    <div className="questionnaire-container">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(currentQuestion / Math.max(questions.length - 1, 1)) * 100}%` }}
        ></div>
      </div>
      
      <h2>Question {currentQuestion + 1} of {Math.min(questions.length, 30)}</h2>
      <div className="question-card">
        <h3>{question.text}</h3>
        
        <div className="tip-box">
          <p><strong>Tip:</strong> {question.tip}</p>
        </div>
        
        <div className="options">
          {question.options.map((option, index) => (
            <button 
              key={index}
              className="option-button"
              onClick={() => handleAnswer(option.value)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
