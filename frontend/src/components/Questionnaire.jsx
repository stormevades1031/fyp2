import React, { useState, useEffect } from 'react';
import { makeUnauthenticatedRequest, makeAuthenticatedRequest } from '../utils/csrf';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../QuestionnaireStyles.css';
import { useLanguage } from '../context/LanguageContext';

function Questionnaire() {
  const { t, language, qdict, odict, qtx, qtipx, otx } = useLanguage();
  const [question, setQuestion] = useState(null);
  const [count, setCount] = useState(0);
  const [responses, setResponses] = useState([]);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [vulnerabilityTopics, setVulnerabilityTopics] = useState([]);
  const [probedCategories, setProbedCategories] = useState({ PHISH: false, SCAM: false, PASS: false, MAL: false, DATA: false, SOC: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [selections, setSelections] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [optionOrderMap, setOptionOrderMap] = useState({});
  const [currentState, setCurrentState] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAnswer = async (answer) => {
    const newResponses = [...responses, { questionId: question.id, category: question.category, answer }];
    setResponses(newResponses);
    const newAnswered = [...answeredIds, question.codeId];
    setAnsweredIds(newAnswered);
    const newCount = count + 1;
    setCount(newCount);
    
    // Legacy client-side tracking (kept for compatibility if needed, but logic moved to backend)
    const opt = question.options.find((o) => o.value === answer);
    const riskScore = opt?.riskScore ?? 0;
    const catShort = question.category.startsWith('Phishing') ? 'PHISH'
      : question.category.startsWith('Scams') ? 'SCAM'
      : question.category.startsWith('Passwords') ? 'PASS'
      : question.category.startsWith('Malware') ? 'MAL'
      : question.category.startsWith('Data') ? 'DATA'
      : question.category.startsWith('Social') ? 'SOC'
      : '';
    if (catShort && probedCategories[catShort] === false) {
      setProbedCategories({ ...probedCategories, [catShort]: true });
    }
    if (riskScore > 1) {
      const vt = [...vulnerabilityTopics];
      if (!vt.includes(catShort)) {
        vt.push(catShort);
      }
      setVulnerabilityTopics(vt);
    }

    if (newCount >= 30) {
      try {
        if (isAuthenticated) {
          const res = await makeAuthenticatedRequest('post', '/api/assessment/submit', { responses: newResponses, profile: profile || {}, state: currentState });
          navigate('/assessment-results', { state: { result: res.data } });
        } else {
          const res = await makeUnauthenticatedRequest('post', '/api/assessment/submit-guest', { responses: newResponses, profile: profile || {}, state: currentState });
          navigate('/assessment-results', { state: { result: res.data } });
        }
        return;
      } catch (e) {
        navigate('/assessment-results', { state: { result: null } });
        return;
      }
    }
    try {
      setTransitioning(true);
      // The check for >= 30 is duplicated here in original code, but logic is same.
      
      const res = await makeUnauthenticatedRequest('post', '/api/assessment/next', {
        profile: profile || {},
        previous: { questionCodeId: question.codeId, answerValue: answer },
        answeredCodeIds: newAnswered,
        count: newCount,
        state: currentState,
        // Legacy params
        probedCategories,
        vulnerabilityTopics,
      });
      
      const nextQ = res.data.question;
      const nextState = res.data.state;

      setQuestion(nextQ);
      setCurrentState(nextState);
      setCurrentSelection(null);
      setQuestionHistory((prev) => {
        const base = [...prev];
        base[newCount] = nextQ;
        return base;
      });
      setTransitioning(false);
    } catch (e) {
      setError(t('failed_fetch_next'));
      setTransitioning(false);
    }
  };

  const recomputeFromResponses = (list) => {
    const probed = { PHISH: false, SCAM: false, PASS: false, MAL: false, DATA: false, SOC: false };
    const vuln = [];
    list.forEach((r) => {
      const catShort = r.category.startsWith('Phishing') ? 'PHISH'
        : r.category.startsWith('Scams') ? 'SCAM'
        : r.category.startsWith('Passwords') ? 'PASS'
        : r.category.startsWith('Malware') ? 'MAL'
        : r.category.startsWith('Data') ? 'DATA'
        : r.category.startsWith('Social') ? 'SOC' : '';
      if (catShort && probed[catShort] === false) probed[catShort] = true;
    });
    setProbedCategories(probed);
    setVulnerabilityTopics(vuln);
  };

  const handleBack = () => {
    if (transitioning) return;
    if (count === 0) return;
    const newCount = count - 1;
    const newResponses = responses.slice(0, newCount);
    const newAnswered = answeredIds.slice(0, newCount);
    setResponses(newResponses);
    setAnsweredIds(newAnswered);
    setCount(newCount);
    recomputeFromResponses(newResponses);
    const prevQ = questionHistory[newCount] || questionHistory[newCount - 1];
    if (prevQ) {
      setQuestion(prevQ);
      const prevSel = newResponses[newCount - 1]?.answer || null;
      setCurrentSelection(prevSel);
    }
  };

  const handleNextClick = () => {
    if (transitioning) return;
    if (!currentSelection) return;
    handleAnswer(currentSelection);
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('assessmentData');
      if (raw) {
        setProfile(JSON.parse(raw));
      }
      const sel = sessionStorage.getItem('assessmentSelections');
      if (sel) {
        setSelections(JSON.parse(sel));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const loadFirst = async () => {
      try {
        const res = await makeUnauthenticatedRequest('post', '/api/assessment/next', {
          profile: profile || {},
          previous: null,
          answeredCodeIds: [],
          count: 0,
          probedCategories,
          vulnerabilityTopics,
        });
        
        const nextQ = res.data.question;
        const nextState = res.data.state;

        setQuestion(nextQ);
        setCurrentState(nextState);
        setQuestionHistory([nextQ]);
        setLoading(false);
      } catch (e) {
        setError(t('failed_start_assessment'));
        setLoading(false);
      }
    };
    loadFirst();
  }, [profile, probedCategories, vulnerabilityTopics, t]);

  useEffect(() => {
    if (question?.codeId) {
      setCurrentSelection(selections[question.codeId] || null);
    }
  }, [question, selections]);

  useEffect(() => {
    try {
      sessionStorage.setItem('assessmentSelections', JSON.stringify(selections));
    } catch {}
  }, [selections]);

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    if (!question?.codeId || !Array.isArray(question.options)) {
      setShuffledOptions([]);
      return;
    }
    const cid = question.codeId;
    const values = question.options.map((o) => o.value);
    let order = optionOrderMap[cid];
    if (!order) {
      order = shuffleArray(values);
      setOptionOrderMap((prev) => ({ ...prev, [cid]: order }));
    }
    const orderedOpts = order
      .map((v) => question.options.find((o) => o.value === v))
      .filter(Boolean);
    setShuffledOptions(orderedOpts);
  }, [question, optionOrderMap]);

  if (loading) return (
    <div className="questionnaire-container">
      <div className="loading">{t('loading_questions')}</div>
    </div>
  );
  if (error) return (
    <div className="questionnaire-container">
      <div className="loading">{error}</div>
    </div>
  );
  if (!question) return (
    <div className="questionnaire-container">
      <div className="loading">{t('no_question_available')}</div>
    </div>
  );

  const progress = ((count) / 30) * 100;
  const displayNum = Math.min(count + 1, 30);

  return (
    <div className="questionnaire-container">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <h2>{t('question_label')} {displayNum} {t('of_30')}</h2>
      <div className="question-card">
        <h3>{(qdict?.[language]?.[question.codeId]?.text) || qtx(language, question.text)}</h3>
        
        <div className="tip-box">
          <p><strong>{t('tip')}</strong> {(qdict?.[language]?.[question.codeId]?.tip) || qtipx(language, question.tip)}</p>
        </div>
        
        <div className="options">
          {(shuffledOptions.length ? shuffledOptions : question.options).map((option, index) => (
            <button 
              key={index}
              className={`option-button${transitioning ? ' disabled' : ''}${currentSelection === option.value ? ' selected' : ''}`}
              disabled={transitioning}
              onClick={() => {
                setCurrentSelection(option.value);
                if (question?.codeId) {
                  setSelections((prev) => ({ ...prev, [question.codeId]: option.value }));
                }
              }}
            >
              {(qdict?.[language]?.[question.codeId]?.options?.[option.value]) || (odict?.[language]?.[option.value]) || (otx(language, option.text))}
            </button>
          ))}
        </div>
        <div className="nav-buttons">
          <button className="option-button" onClick={handleBack} disabled={transitioning || count === 0}>{t('back')}</button>
          <button className="option-button" onClick={handleNextClick} disabled={transitioning || !currentSelection}>{t('next')}</button>
        </div>
        {transitioning && (
          <div className="card-overlay">
            <div className="overlay-spinner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
