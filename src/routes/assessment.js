const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const questions = require('../utils/questions');
const { classifyDigitalType } = require('../utils/classification');
const auth = require('../middleware/auth');
const { validate, assessmentSchema } = require('../middleware/validation');
const { determineDigitalType, runVulnerabilityMatrix, getInitialDifficulty } = require('../utils/assessmentLogic');

// Get all questions
router.get('/questions', (req, res) => {
  res.json(questions);
});

router.post('/questions/filtered', (req, res) => {
  try {
    const body = req.body || {};
    const profile = body.profile || {};
    const answeredCodeIds = Array.isArray(body.answeredCodeIds) ? body.answeredCodeIds : [];
    const max = typeof body.max === 'number' && body.max > 0 ? body.max : 30;
    const targetModules = runVulnerabilityMatrix(profile);
    const initLevel = getInitialDifficulty(profile.education);
    const difficultyOrder = initLevel === 3 ? ['Hard', 'Medium', 'Easy'] : initLevel === 2 ? ['Medium', 'Easy', 'Hard'] : ['Easy', 'Medium', 'Hard'];
    const modules = targetModules.includes('M6') ? targetModules : [...targetModules, 'M6'];
    const taken = new Set(answeredCodeIds);
    const out = [];
    for (const m of modules) {
      for (const d of difficultyOrder) {
        if (out.length >= max) break;
        const pool = questions.filter(q => q.codeId.startsWith(m + '_') && q.difficulty === d && !taken.has(q.codeId));
        for (const q of pool) {
          if (out.length >= max) break;
          out.push(q);
          taken.add(q.codeId);
        }
      }
      if (out.length >= max) break;
    }
    if (out.length < max) {
      const fillPool = questions.filter(q => q.codeId.startsWith('M6_') && !taken.has(q.codeId));
      for (const q of fillPool) {
        if (out.length >= max) break;
        out.push(q);
        taken.add(q.codeId);
      }
    }
    if (out.length < max) {
      const anyPool = questions.filter(q => !taken.has(q.codeId));
      for (const q of anyPool) {
        if (out.length >= max) break;
        out.push(q);
        taken.add(q.codeId);
      }
    }
    res.json({ questions: out.slice(0, max), modules, difficultyOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter questions', error: error.message });
  }
});

// Get prioritized questions based on profile (Legacy, but kept for reference if needed)
router.post('/questions', (req, res) => {
  // ... (Legacy implementation omitted for brevity as we are using /next)
  res.json(questions.slice(0, 30)); 
});

// Helper to map difficulty number to string
const difficultyMap = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard' // Using Hard for level 3. 'Expert' is level 4? The prompt only mentions 1, 2, 3.
};

// New Adaptive Logic Endpoint
router.post('/next', (req, res) => {
  try {
    const {
      profile = {},
      previous = null,
      answeredCodeIds = [],
      count = 0,
      state = null
    } = req.body || {};

    let currentState = state;
    
    // INITIALIZATION (Start of Assessment)
    if (!currentState || count === 0) {
      const digitalType = determineDigitalType(profile.occupation);
      const targetModules = runVulnerabilityMatrix(profile);
      const currentDifficulty = getInitialDifficulty(profile.education);
      
      currentState = {
        digitalType,
        targetModules,
        currentDifficulty,
        moduleIndex: 0,
        totalScore: 0,
        rawPoints: 0,
        questionCount: 0
      };
    } else {
      // UPDATE STATE based on previous answer
      if (previous) {
        const prevQ = questions.find(q => q.codeId === previous.questionCodeId);
        if (prevQ) {
          const isCorrect = prevQ.options.find(o => o.value === previous.answerValue)?.riskScore === 0; // Assuming 0 risk is "correct" answer in this context?
          // Wait, the prompt says: "IF User_Answer == Question.Correct_Answer".
          // In `questions.js`, `riskScore: 0` usually means the safe/correct option. `riskScore: 1` is risky/wrong.
          // Let's assume riskScore 0 is Correct.
          
          if (isCorrect) {
            const points = currentState.currentDifficulty;
            currentState.totalScore = (currentState.totalScore || 0) + points;
            currentState.rawPoints = (currentState.rawPoints || 0) + points;
            if (currentState.currentDifficulty < 3) {
              currentState.currentDifficulty += 1;
            }
          } else {
            if (currentState.currentDifficulty > 1) {
              currentState.currentDifficulty -= 1;
            }
          }
          currentState.questionCount = (currentState.questionCount || 0) + 1;
        }
        
        // Move to next module (Round Robin)
        currentState.moduleIndex = (currentState.moduleIndex + 1) % currentState.targetModules.length;
      }
    }

    // SELECT NEXT QUESTION
    const currentModule = currentState.targetModules[currentState.moduleIndex];
    const difficultyStr = difficultyMap[currentState.currentDifficulty];

    // Filter questions by Module and Difficulty, excluding answered ones
    const candidates = questions.filter(q => 
      q.codeId.startsWith(currentModule + '_') && // Check if codeId starts with "M1_" etc.
      q.difficulty === difficultyStr &&
      !answeredCodeIds.includes(q.codeId)
    );

    let nextQuestion = null;

    if (candidates.length > 0) {
      // Pick a random one or the first one
      nextQuestion = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      // Fallback: If no question at current difficulty, try other difficulties in the same module
      const fallbackCandidates = questions.filter(q => 
        q.codeId.startsWith(currentModule + '_') &&
        !answeredCodeIds.includes(q.codeId)
      );
      
      if (fallbackCandidates.length > 0) {
         // Sort by proximity to current difficulty? Or just pick any.
         // Let's pick one close to current difficulty.
         nextQuestion = fallbackCandidates[0];
      } else {
         // Fallback 2: If module is exhausted, try next module
         // (This edge case shouldn't happen often if question bank is large enough)
         const otherModuleCandidates = questions.filter(q => !answeredCodeIds.includes(q.codeId));
         if (otherModuleCandidates.length > 0) {
           nextQuestion = otherModuleCandidates[0];
         }
      }
    }

    if (!nextQuestion) {
      const anyCandidate = questions.find(q => !answeredCodeIds.includes(q.codeId));
      if (anyCandidate) {
        nextQuestion = anyCandidate;
      } else {
        return res.status(404).json({ message: 'No questions available', state: currentState });
      }
    }

    res.json({ question: nextQuestion, state: currentState });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to compute next question', error: error.message });
  }
});

// Helper to compute total risk score, vulnerability topics, and correct count from responses
const computeRisk = (responses) => {
  let totalRiskScore = 0;
  let correctCount = 0;
  const vulnerabilityTopics = new Set();
  const mapById = new Map(questions.map((q) => [q.id, q]));
  responses.forEach((r) => {
    const q = mapById.get(r.questionId);
    if (!q) return;
    const opt = (q.options || []).find((o) => o.value === r.answer);
    const rs = typeof opt?.riskScore === 'number' ? opt.riskScore : 1;
    totalRiskScore += rs;
    if (opt && rs === 0) {
      correctCount += 1;
    } else if (rs >= 1) {
      const cat = q.category || r.category;
      if (cat) vulnerabilityTopics.add(cat);
    }
  });
  return { totalRiskScore, vulnerabilityTopics: Array.from(vulnerabilityTopics), correctCount };
};

const computeAnswerReview = (responses) => {
  const byId = new Map(questions.map(q => [q.id, q]));
  return responses.map(r => {
    const q = byId.get(r.questionId);
    const userOpt = q?.options?.find(o => o.value === r.answer);
    const correctOpt = q?.options?.find(o => o.riskScore === 0) || null;
    const isCorrect = !!userOpt && typeof userOpt.riskScore === 'number' && userOpt.riskScore === 0;
    return {
      questionId: r.questionId,
      codeId: q?.codeId || null,
      category: q?.category || r.category || null,
      difficulty: q?.difficulty || null,
      answer: r.answer,
      correctAnswer: correctOpt?.value || null,
      isCorrect
    };
  });
};

const computeFinalScoreFromResponses = (responses) => {
  if (!Array.isArray(responses) || responses.length === 0) return null;
  const byId = new Map(questions.map(q => [q.id, q]));
  const diffW = { Easy: 1, Medium: 2, Hard: 3, Expert: 4 };
  let gained = 0;
  let maxPoints = responses.length * 3;
  responses.forEach(r => {
    const q = byId.get(r.questionId);
    const w = diffW[q?.difficulty] || 1;
    const opt = q?.options?.find(o => o.value === r.answer);
    const rs = typeof opt?.riskScore === 'number' ? opt.riskScore : 1;
    if (rs === 0) gained += w;
  });
  return Math.round((gained / maxPoints) * 100);
};

// Submit assessment with validation
router.post('/submit', auth, validate(assessmentSchema), async (req, res) => {
  try {
    const { responses, profile, state } = req.body; // state might be passed here too
    const userId = req.user.id;
    
    // Validate responses
    if (!responses || !Array.isArray(responses) || responses.length < 5) {
      return res.status(400).json({ message: 'Invalid assessment data' });
    }
    
    let digitalTypeResult = classifyDigitalType(responses, profile);
    let finalScore = computeFinalScoreFromResponses(responses);
    if (finalScore === null && state?.questionCount > 0) {
      const denom = state.questionCount * 3;
      finalScore = Math.round(((state.rawPoints || 0) / denom) * 100);
    }
    const { determineDynamicPersona } = require('../utils/assessmentLogic');
    const persona = determineDynamicPersona(profile?.occupation, typeof finalScore==='number' ? finalScore : 0, digitalTypeResult.digitalType);

    const { digitalType, digitalTypeDefinition, digitalTypeRiskProfile, keyMistakes, categoryRisk, categoryWeightedRisk, categoryScores, strengths, weaknesses, digitalTypeConfidence, recommendations, typeScores, occupationType, behavioralType, debug } = digitalTypeResult;
    const { totalRiskScore, vulnerabilityTopics } = computeRisk(responses);
    const answersReview = computeAnswerReview(responses);
    const correctCount = answersReview.filter(a => a.isCorrect).length;
    
    // Save assessment results
    const assessment = new Assessment({
      user: userId,
      responses,
      digitalType,
      keyMistakes
    });
    
    await assessment.save();
    
    // Update user's digital type
    await User.findByIdAndUpdate(userId, { digitalType }, { runValidators: true });
    
    res.status(201).json({ 
      message: 'Assessment completed successfully',
      digitalType,
      digitalTypeDefinition,
      digitalTypeRiskProfile,
      keyMistakes,
      persona,
      finalScore,
      totalRiskScore,
      correctCount,
      answersReview,
      vulnerabilityTopics,
      categoryRisk,
      categoryWeightedRisk,
      categoryScores,
      strengths,
      weaknesses,
      digitalTypeConfidence,
      recommendations,
      persona,
      typeScores,
      occupationType,
      behavioralType,
      debug
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Guest assessment submission (no auth, no persistence)
router.post('/submit-guest', validate(assessmentSchema), (req, res) => {
  try {
    const { responses, profile, state } = req.body;
    if (!responses || !Array.isArray(responses) || responses.length < 5) {
      return res.status(400).json({ message: 'Invalid assessment data' });
    }
    
    let digitalTypeResult = classifyDigitalType(responses, profile);
    let finalScore = computeFinalScoreFromResponses(responses);
    if (finalScore === null && state?.questionCount > 0) {
      const denom = state.questionCount * 3;
      finalScore = Math.round(((state.rawPoints || 0) / denom) * 100);
    }
    const { determineDynamicPersona } = require('../utils/assessmentLogic');
    const persona = determineDynamicPersona(profile?.occupation, typeof finalScore==='number' ? finalScore : 0, digitalTypeResult.digitalType);

    const { digitalType, digitalTypeDefinition, digitalTypeRiskProfile, keyMistakes, categoryRisk, categoryWeightedRisk, categoryScores, strengths, weaknesses, digitalTypeConfidence, recommendations, typeScores, occupationType, behavioralType, debug } = digitalTypeResult;
    const { totalRiskScore, vulnerabilityTopics } = computeRisk(responses);
    const answersReview = computeAnswerReview(responses);
    const correctCount = answersReview.filter(a => a.isCorrect).length;
    res.status(200).json({ 
      message: 'Assessment evaluated (guest)',
      digitalType,
      digitalTypeDefinition,
      digitalTypeRiskProfile,
      keyMistakes,
      persona,
      finalScore,
      totalRiskScore,
      correctCount,
      answersReview,
      vulnerabilityTopics,
      categoryRisk,
      categoryWeightedRisk,
      categoryScores,
      strengths,
      weaknesses,
      digitalTypeConfidence,
      recommendations,
      persona,
      typeScores,
      occupationType,
      behavioralType,
      debug
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's latest assessment
router.get('/results', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ user: req.user.id })
      .sort({ completedAt: -1 })
      .limit(1);
    
    if (!assessment) {
      return res.status(404).json({ message: 'No assessment found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id })
      .sort({ completedAt: -1 })
      .select('digitalType keyMistakes completedAt')
      .limit(10); // Limit to last 10 assessments for performance
    
    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: 'No assessment history found' });
    }
    
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/overview', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort({ completedAt: -1 });
    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: 'No assessment found' });
    }
    const latest = assessments[0];
    const scores = [];
    const indices = [];
    for (const a of assessments) {
      const s = computeFinalScoreFromResponses(a.responses || []);
      if (typeof s === 'number') scores.push(s);
      const dt = classifyDigitalType(a.responses || [], {});
      const cs = dt.categoryScores || {};
      const vals = Object.values(cs);
      if (vals.length) {
        indices.push(Math.round(vals.reduce((acc, v) => acc + v, 0) / vals.length));
      }
    }
    const latestScore = computeFinalScoreFromResponses(latest.responses || []);
    const dtLatest = classifyDigitalType(latest.responses || [], {});
    const csLatest = dtLatest.categoryScores || {};
    const latestIndex = (() => {
      const vals = Object.values(csLatest);
      return vals.length ? Math.round(vals.reduce((acc, v) => acc + v, 0) / vals.length) : 0;
    })();
    const meanScore = scores.length ? Math.round(scores.reduce((acc, v) => acc + v, 0) / scores.length) : (typeof latestScore === 'number' ? latestScore : 0);
    const meanIndex = indices.length ? Math.round(indices.reduce((acc, v) => acc + v, 0) / indices.length) : latestIndex;
    const trend = indices.length > 1 ? latestIndex - Math.round(indices.slice(1).reduce((a,b)=>a+b,0)/(indices.length-1)) : 0;
    res.json({
      digitalType: latest.digitalType,
      lastAssessment: latest.completedAt,
      latestScore: typeof latestScore === 'number' ? latestScore : 0,
      meanScore,
      totalAssessments: assessments.length,
      securityIndex: latestIndex,
      meanIndex,
      trend
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Delete all assessment history for current user
router.delete('/history', auth, async (req, res) => {
  try {
    await Assessment.deleteMany({ user: req.user.id });
    res.json({ message: 'All assessment history deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get full details for a specific assessment by id
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Assessment.findOne({ _id: id, user: req.user.id });
    if (!doc) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    // Recompute detailed result from stored responses
    const responses = doc.responses || [];
    const digitalType = doc.digitalType;
    const { totalRiskScore, vulnerabilityTopics, correctCount } = computeRisk(responses);
    const answersReview = computeAnswerReview(responses);
    let finalScore = computeFinalScoreFromResponses(responses);
    const profile = {};
    const digitalTypeResult = classifyDigitalType(responses, profile);
    const out = {
      message: 'Assessment details',
      digitalType: digitalType || digitalTypeResult.digitalType,
      digitalTypeDefinition: digitalTypeResult.digitalTypeDefinition,
      digitalTypeRiskProfile: digitalTypeResult.digitalTypeRiskProfile,
      keyMistakes: digitalTypeResult.keyMistakes || doc.keyMistakes || [],
      finalScore,
      totalRiskScore,
      correctCount,
      answersReview,
      vulnerabilityTopics,
      categoryRisk: digitalTypeResult.categoryRisk,
      categoryWeightedRisk: digitalTypeResult.categoryWeightedRisk,
      categoryScores: digitalTypeResult.categoryScores,
      strengths: digitalTypeResult.strengths,
      weaknesses: digitalTypeResult.weaknesses,
      digitalTypeConfidence: digitalTypeResult.digitalTypeConfidence,
      recommendations: digitalTypeResult.recommendations,
      typeScores: digitalTypeResult.typeScores,
      occupationType: digitalTypeResult.occupationType,
      behavioralType: digitalTypeResult.behavioralType,
      debug: digitalTypeResult.debug,
      completedAt: doc.completedAt
    };
    res.json(out);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a specific assessment by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Assessment.findOneAndDelete({ _id: id, user: req.user.id });
    if (!doc) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted', id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
