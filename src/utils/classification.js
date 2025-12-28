const questions = require('./questions');

const DIGITAL_TYPES = {
  STRATEGIC_CUSTODIAN: {
    name: 'The Strategic Custodian',
    definition: 'An individual responsible for high-level decision-making, management of sensitive organizational assets, or financial oversight. They possess elevated authority and access rights.',
    riskProfile: {
      highValueTarget: 'Targeted for Business Email Compromise (BEC) and Impersonation (e.g., Fake CEO/Director scams).',
      authorityExploitation: 'Susceptible to "Macau Scams" (Fake LHDN/Police calls) due to fear of reputational damage or legal repercussions.'
    },
    occupations: [
      'Banking/Finance/Insurance',
      'Business/Management/Consulting',
      'Government/Public Safety/Legal'
    ]
  },
  TECHNICAL_ARCHITECT: {
    name: 'The Technical Architect',
    definition: 'A specialist with advanced technical proficiency who designs, builds, or maintains digital infrastructure. They often hold administrative privileges and manage critical system back-ends.',
    riskProfile: {
      infrastructureGatekeeper: 'Targeted for Supply Chain Attacks and Ransomware (e.g., the Swinburne Sarawak incident).',
      intellectualPropertyTheft: 'Risk of data exfiltration regarding proprietary code, blueprints, or patient data (PDPA violations).'
    },
    occupations: [
      'IT/Computers/Electronics',
      'Building/Construction/Engineering',
      'Biotechnology/Life Sciences/Healthcare'
    ]
  },
  NETWORK_LIAISON: {
    name: 'The Network Liaison',
    definition: 'A professional whose primary role involves extensive external communication, public engagement, and relationship building across various digital channels.',
    riskProfile: {
      socialEngineeringEntryPoint: 'Highly exposed to Phishing via WhatsApp/Email and Malicious Links disguised as customer inquiries or invoices.',
      accountTakeover: 'High risk of "WhatsApp Hijacking" (asking friends for money) due to their wide public visibility.'
    },
    occupations: [
      'Customer Service/Sales/Retail',
      'Education/Academia',
      'Hospitality/Food Services',
      'Creative/Design/Media'
    ]
  },
  OPERATIONAL_ANALYST: {
    name: 'The Operational Analyst',
    definition: 'An individual focused on execution, logistics, and routine processing. They utilize technology to complete specific operational tasks and ensure workflow continuity.',
    riskProfile: {
      paymentFraud: 'Vulnerable to Fake Payment Receipts and E-Wallet Scams (S-Pay Global) during daily transactions.',
      deviceCompromise: 'Risk of "Juice Jacking" or malware from unverified apps (APKs) used for logistics/tracking on personal devices.'
    },
    occupations: [
      'Agriculture/Farming/Fisheries',
      'Manufacturing/Operations/Logistics'
    ]
  },
  DIGITAL_CONSUMER: {
    name: 'The Digital Consumer',
    definition: 'An independent user who primarily utilizes digital platforms for personal development, lifestyle, financial transactions, or social connectivity, without organizational oversight.',
    riskProfile: {
      predatoryScams: 'The primary demographic for Job Scams (Students), Mule Account Recruitment (Youth), and Investment Fraud (Retirees/Unemployed).',
      lifestyleAttacks: 'Targets for E-commerce Fraud (Fake Shopee/Facebook sellers) and Romance Scams.'
    },
    occupations: [
      'Student',
      'Unemployed',
      'Retired',
      'Other',
      'Other (please specify)'
    ]
  }
};

const classifyDigitalType = (responses, profile) => {
  const cats = ['Phishing','Scams','Passwords & 2FA','Malware','Data Handling & Wi-Fi','Social Engineering'];
  const catRisk = Object.fromEntries(cats.map(c=>[c,0]));
  const catWeightedRisk = Object.fromEntries(cats.map(c=>[c,0]));
  const qById = new Map(questions.map(q=>[q.id,q]));
  const diffW = { Easy: 1, Medium: 2, Hard: 3, Expert: 4 };
  const normalizeCat = (raw) => {
    if (!raw) return null;
    const s = String(raw);
    if (s.startsWith('Phishing')) return 'Phishing';
    if (s.startsWith('Scams')) return 'Scams';
    if (s.startsWith('Passwords') || s.startsWith('Password')) return 'Passwords & 2FA';
    if (s.startsWith('Malware')) return 'Malware';
    if (s.startsWith('Data')) return 'Data Handling & Wi-Fi';
    if (s.startsWith('Social')) return 'Social Engineering';
    return cats.includes(s) ? s : null;
  };
  
  // Calculate risk scores based on responses
  responses.forEach(response => {
    const { category, answer, questionId } = response;
    const q = qById.get(questionId);
    const rc = normalizeCat(q?.category || category);
    const opt = q?.options?.find(o=>o.value===answer);
    const rs = typeof opt?.riskScore==='number' ? opt.riskScore : 0;
    const w = diffW[q?.difficulty] || 1;
    if (rc && catRisk[rc]!=null) catRisk[rc]+=rs;
    if (rc && catWeightedRisk[rc]!=null) catWeightedRisk[rc]+=rs*w;
  });
  
  // Determine Digital Type based on Occupation and Behavior
  let occupationType = null;
  const occupation = profile?.occupation;
  
  if (occupation) {
    for (const key in DIGITAL_TYPES) {
      if (DIGITAL_TYPES[key].occupations.includes(occupation)) {
        occupationType = DIGITAL_TYPES[key].name;
        break;
      }
    }
  }

  // Calculate Type Scores based on Risks
  const typeScores = {
    [DIGITAL_TYPES.STRATEGIC_CUSTODIAN.name]: (catWeightedRisk['Phishing'] || 0) + (catWeightedRisk['Social Engineering'] || 0),
    [DIGITAL_TYPES.TECHNICAL_ARCHITECT.name]: (catWeightedRisk['Malware'] || 0) + (catWeightedRisk['Data Handling & Wi-Fi'] || 0),
    [DIGITAL_TYPES.NETWORK_LIAISON.name]: (catWeightedRisk['Phishing'] || 0) + (catWeightedRisk['Passwords & 2FA'] || 0),
    [DIGITAL_TYPES.OPERATIONAL_ANALYST.name]: (catWeightedRisk['Scams'] || 0) + (catWeightedRisk['Data Handling & Wi-Fi'] || 0),
    [DIGITAL_TYPES.DIGITAL_CONSUMER.name]: (catWeightedRisk['Scams'] || 0) + (catWeightedRisk['Social Engineering'] || 0)
  };

  // Determine Behavioral Type (Highest Risk Score)
  let behavioralType = DIGITAL_TYPES.DIGITAL_CONSUMER.name;
  let maxScore = 0;
  let secondScore = 0;
  
  for (const [type, score] of Object.entries(typeScores)) {
    if (score > maxScore) {
      secondScore = maxScore;
      maxScore = score;
      behavioralType = type;
    } else if (score > secondScore) {
      secondScore = score;
    }
  }

  let primaryType = behavioralType; 
  if (occupationType && maxScore > 0 && typeScores[occupationType] >= maxScore * 0.8) {
     primaryType = occupationType;
  }
  if (maxScore === 0 && occupationType) {
    primaryType = occupationType;
  }

  // Retrieve definitions for the selected type
  let typeDefinition = '';
  let typeRiskProfile = {};
  
  for (const key in DIGITAL_TYPES) {
    if (DIGITAL_TYPES[key].name === primaryType) {
      typeDefinition = DIGITAL_TYPES[key].definition;
      typeRiskProfile = DIGITAL_TYPES[key].riskProfile;
      break;
    }
  }


  // Identify key mistakes (Keep existing logic)
  const keyMistakes = [];
  
  const clickingResponses = responses.filter(r => normalizeCat(r.category) === 'Social Engineering');
  if (clickingResponses.some(r => r.answer === 'often' || r.answer === 'always' || r.answer === 'click_pay' || r.answer === 'click_tng')) {
    keyMistakes.push('Clicking on suspicious links without verification');
  }
  
  const passwordResponses = responses.filter(r => normalizeCat(r.category) === 'Passwords & 2FA');
  if (passwordResponses.some(r => r.answer === 'often' || r.answer === 'always' || r.answer === 'share_trust' || r.answer === 'share_trusted')) {
    keyMistakes.push('Sharing or reusing passwords');
  }

  const scamResponses = responses.filter(r => normalizeCat(r.category) === 'Scams');
  if (scamResponses.some(r => r.answer === 'pay' || r.answer === 'lucky' || r.answer === 'transfer_urgent' || r.answer === 'invest_test')) {
    keyMistakes.push('Falling for common scam tactics');
  }
  
  const norm = {};
  cats.forEach(c=>{
    const v = catWeightedRisk[c];
    const n = Math.max(0, 100 - v*5);
    norm[c]=Math.round(n);
  });
  
  const sortedCats = cats.slice().sort((a,b)=>norm[a]-norm[b]);
  const weaknesses = sortedCats.slice(0,3);
  const strengths = sortedCats.slice(-3).reverse();
  
  // Calculate confidence
  let digitalTypeConfidence = 0;

  if (occupationType) {
    if (occupationType === primaryType) {
      digitalTypeConfidence += 5;
    } else {
      digitalTypeConfidence -= 5;
    }
  } else {
    digitalTypeConfidence += 0;
  }
  const distinctiveness = (maxScore - secondScore) / Math.max(1, (maxScore + secondScore));
  const totalRisk = Object.values(catRisk).reduce((a,b)=>a+(b||0),0);
  const riskDensity = Math.min(1, totalRisk / Math.max(1, responses.length));
  digitalTypeConfidence += 40 + Math.round(distinctiveness * 40) + Math.round(riskDensity * 20);
  
  // Cap at 100
  digitalTypeConfidence = Math.min(100, Math.max(0, digitalTypeConfidence));

  const recs = [];
  weaknesses.forEach(c=>{
    if (c==='Phishing') {
      recs.push('Verify sender and hover links before clicking');
      recs.push('Log in via official app or website instead of email links');
      recs.push('Inspect domain carefully; beware lookalikes and shortened URLs');
      recs.push('Disable remote image loading to reduce tracking in emails');
    }
    if (c==='Scams') {
      recs.push('Avoid payments via links or calls; verify via official channels');
      recs.push('Never share OTP/TAC codes; banks will not ask for them');
      recs.push('Confirm claims using trusted numbers, not those in messages');
      recs.push('Research sellers and check reviews before transacting online');
    }
    if (c==='Passwords & 2FA') {
      recs.push('Use a password manager and enable 2FA');
      recs.push('Create unique passphrases per account to stop credential stuffing');
      recs.push('Prefer authenticator apps or hardware keys over SMS 2FA');
      recs.push('Rotate old passwords and revoke sessions after breaches');
    }
    if (c==='Malware') {
      recs.push('Keep software updated and avoid cracked downloads');
      recs.push('Install apps only from official stores; block unknown APKs');
      recs.push('Back up data offline to mitigate ransomware impact');
      recs.push('Run antivirus/EDR and remove unused browser extensions');
    }
    if (c==='Data Handling & Wi-Fi') {
      recs.push('Use VPN or mobile data on public Wi‑Fi and protect PII');
      recs.push('Avoid accessing banking on open Wi‑Fi; use cellular or VPN');
      recs.push('Limit data sharing; remove sensitive metadata from files/photos');
      recs.push('Set device auto-lock and use screen privacy filters in public');
    }
    if (c==='Social Engineering') {
      recs.push('Challenge unexpected requests and validate identities');
      recs.push('Use dual-channel verification for urgent requests (call back via known numbers)');
      recs.push('Establish no‑secrets policy: never share passwords or 2FA codes');
      recs.push('Train yourself to slow down when messages impose artificial urgency');
    }
  });

  return {
    digitalType: primaryType,
    digitalTypeDefinition: typeDefinition, // New field
    digitalTypeRiskProfile: typeRiskProfile, // New field
    keyMistakes,
    categoryRisk: catRisk,
    categoryWeightedRisk: catWeightedRisk,
    categoryScores: norm,
    strengths,
    weaknesses,
    digitalTypeConfidence,
    recommendations: recs,
    typeScores,
    occupationType,
    behavioralType,
    debug: {
      maxScore,
      secondScore,
      distinctiveness,
      totalRisk,
      riskDensity,
      responsesCount: responses.length
    }
  };
};

module.exports = { classifyDigitalType, DIGITAL_TYPES };
