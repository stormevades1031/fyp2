const CONST_RISK_WEIGHTS = {
  AGE_GROUPS: {
    "YOUTH (Under 18-24)": { SocialMedia: 9, JobScams: 10, MuleAccount: 9 },
    "ADULT (25-44)": { Investment: 9, TaxScams: 8, WorkplaceSec: 7 },
    "SENIOR (45+)": { PhoneScams: 10, HealthFraud: 8, TechSupport: 7 }
  },
  GENDER: {
    MALE: { Investment: 3 },
    FEMALE: { Shopping: 5, LoveScams: 4 }
  },
  EDUCATION_MODIFIER: {
    "Master/PhD": "HIGH_COMPLEXITY",
    Degree: "MED_COMPLEXITY",
    School: "LOW_COMPLEXITY"
  }
};

const CONST_JOB_GROUPS = {
  "STRATEGIC": ["Banking/Finance/Insurance", "Business/Management/Consulting", "Government/Public Safety/Legal"],
  "TECHNICAL": ["IT/Computers/Electronics", "Building/Construction/Engineering", "Biotechnology/Life Sciences/Healthcare"],
  "LIAISON": ["Education/Academia", "Customer Service/Sales/Retail", "Creative/Design/Media", "Hospitality/Food Services"],
  "OPERATIONAL": ["Agriculture/Farming/Fisheries", "Manufacturing/Operations/Logistics"],
  "CONSUMER": ["Student", "Unemployed", "Retired", "Other (please specify)"]
};

function normalizeProfileForRisk(userProfile = {}) {
  const age = userProfile.ageGroup;
  let ageKey = null;
  if (age === 'Under 18' || age === '18 - 24') ageKey = 'YOUTH (Under 18-24)';
  else if (age === '25 - 34' || age === '35 - 44') ageKey = 'ADULT (25-44)';
  else if (age === '45 - 54' || age === '55 - 64' || age === '65 or above') ageKey = 'SENIOR (45+)';
  else ageKey = 'ADULT (25-44)';
  const gender = userProfile.gender;
  let genderKey = null;
  if (gender === 'Male') genderKey = 'MALE';
  else if (gender === 'Female') genderKey = 'FEMALE';
  else genderKey = null;
  const edu = userProfile.education;
  let eduKey = 'School';
  if (edu === "Bachelor's Degree") eduKey = 'Degree';
  else if (edu === "Master's Degree" || edu === 'Doctorate (Ph.D.) or higher') eduKey = 'Master/PhD';
  else eduKey = 'School';
  return { ageKey, genderKey, eduKey };
}

// Map internal module IDs to user's logic names if needed, or just use the logic directly.
// User's logic names: "M1_Corporate_Tech", "M6_General_Safety", "M4_Student_Risks", "M5_Lifestyle"
// Our module IDs: M1, M2, M3, M4, M5, M6
const MODULE_MAPPING = {
  "M1": "M1_Corporate_Tech",
  "M2": "M2_Financial_Fraud",
  "M3": "M3_Impersonation",
  "M4": "M4_Student_Risks",
  "M5": "M5_Lifestyle",
  "M6": "M6_General_Safety"
};

// Reverse mapping for scoring
const REVERSE_MODULE_MAPPING = {
  "M1_Corporate_Tech": "M1",
  "M2_Financial_Fraud": "M2",
  "M3_Impersonation": "M3",
  "M4_Student_Risks": "M4",
  "M5_Lifestyle": "M5",
  "M6_General_Safety": "M6",
  // Map risk threats to modules
  "SocialMedia": "M5",
  "JobScams": "M4",
  "MuleAccount": "M4",
  "Investment": "M2",
  "TaxScams": "M2",
  "WorkplaceSec": "M1",
  "PhoneScams": "M3",
  "HealthFraud": "M3",
  "TechSupport": "M6",
  "Sextortion": "M5",
  "Shopping": "M5",
  "LoveScams": "M5",
};

function determineDigitalType(jobTitle) {
  if (CONST_JOB_GROUPS["STRATEGIC"].includes(jobTitle)) {
    return { Type: "The Strategic Custodian", Risk: "BEC Fraud & Authority Impersonation" };
  }
  if (CONST_JOB_GROUPS["TECHNICAL"].includes(jobTitle)) {
    return { Type: "The Technical Architect", Risk: "Supply Chain Attacks & Ransomware" };
  }
  if (CONST_JOB_GROUPS["LIAISON"].includes(jobTitle)) {
    return { Type: "The Network Liaison", Risk: "Social Engineering & Phishing" };
  }
  if (CONST_JOB_GROUPS["OPERATIONAL"].includes(jobTitle)) {
    return { Type: "The Operational Analyst", Risk: "Payment Fraud & Device Compromise" };
  }
  return { Type: "The Digital Consumer", Risk: "Predatory Lifestyle Scams" };
}

function determineDynamicPersona(jobTitle, finalScore, overrideBaseType = null) {
  let baseRole = '';
  let riskFocus = '';
  
  if (overrideBaseType) {
    baseRole = overrideBaseType.replace(/^The\s+/, '');
    // Mapping base roles to risk focus (approximated based on known types)
    if (baseRole.includes('Strategic') || baseRole.includes('Custodian')) riskFocus = 'High-Value Target (BEC & Impersonation)';
    else if (baseRole.includes('Technical') || baseRole.includes('Architect')) riskFocus = 'Infrastructure Target (Ransomware)';
    else if (baseRole.includes('Network') || baseRole.includes('Liaison')) riskFocus = 'Public-Facing Target (Phishing)';
    else if (baseRole.includes('Operational') || baseRole.includes('Analyst')) riskFocus = 'Transactional Target (Fraud)';
    else riskFocus = 'Lifestyle Target (Scams)';
  } else if (CONST_JOB_GROUPS["STRATEGIC"].includes(jobTitle)) {
    baseRole = 'Strategic Custodian';
    riskFocus = 'High-Value Target (BEC & Impersonation)';
  } else if (CONST_JOB_GROUPS["TECHNICAL"].includes(jobTitle)) {
    baseRole = 'Technical Architect';
    riskFocus = 'Infrastructure Target (Ransomware)';
  } else if (CONST_JOB_GROUPS["LIAISON"].includes(jobTitle)) {
    baseRole = 'Network Liaison';
    riskFocus = 'Public-Facing Target (Phishing)';
  } else if (CONST_JOB_GROUPS["OPERATIONAL"].includes(jobTitle)) {
    baseRole = 'Operational Analyst';
    riskFocus = 'Transactional Target (Fraud)';
  } else {
    baseRole = 'Digital Consumer';
    riskFocus = 'Lifestyle Target (Scams)';
  }

  let modifier = '';
  let description = '';
  if (finalScore >= 80) {
    modifier = 'Fortified';
    description = 'You demonstrate advanced security awareness and proactive defense habits.';
  } else if (finalScore >= 60) {
    modifier = 'Vigilant';
    description = 'You have good foundational knowledge but may miss sophisticated threats.';
  } else if (finalScore >= 40) {
    modifier = 'Exposed';
    description = 'Your digital habits leave significant gaps that attackers can exploit.';
  } else {
    modifier = 'Compromised';
    description = 'Your current security posture is critically vulnerable to active threats.';
  }

  const finalTitle = `The ${modifier} ${baseRole}`;
  return {
    Type: finalTitle,
    Base_Role: baseRole,
    Risk_Profile: riskFocus,
    Status_Message: description
  };
}

function runVulnerabilityMatrix(userProfile) {
  const moduleScores = {
    "M1": 0, "M2": 0, "M3": 0, "M4": 0, "M5": 0, "M6": 0
  };

  const job = userProfile.occupation;
  const { ageKey, genderKey } = normalizeProfileForRisk(userProfile);
  
  // A. OCCUPATION SCORING
  if (CONST_JOB_GROUPS["TECHNICAL"].includes(job)) {
    moduleScores["M1"] += 10;
    moduleScores["M6"] += 5;
  } else if (CONST_JOB_GROUPS["CONSUMER"].includes(job)) {
    moduleScores["M4"] += 10;
    moduleScores["M5"] += 8;
    moduleScores["M3"] += 6;
  } else if (CONST_JOB_GROUPS["STRATEGIC"].includes(job)) {
    moduleScores["M1"] += 10; // BEC/Authority
    moduleScores["M2"] += 6;
    moduleScores["M3"] += 5;
  } else if (CONST_JOB_GROUPS["LIAISON"].includes(job)) {
    moduleScores["M3"] += 8; // Social Engineering
    moduleScores["M5"] += 5;
  } else if (CONST_JOB_GROUPS["OPERATIONAL"].includes(job)) {
    moduleScores["M2"] += 8; // Payment Fraud
    moduleScores["M3"] += 6; // Impersonation/legal threats often target ops
    moduleScores["M6"] += 5;
  }

  // B. DEMOGRAPHIC SCORING
  const ageRisk = ageKey ? CONST_RISK_WEIGHTS.AGE_GROUPS[ageKey] || {} : {};
  for (const [threat, weight] of Object.entries(ageRisk)) {
    const mod = REVERSE_MODULE_MAPPING[threat];
    if (mod) moduleScores[mod] += weight;
  }

  const genderRisk = genderKey ? CONST_RISK_WEIGHTS.GENDER[genderKey] || {} : {};
  for (const [threat, weight] of Object.entries(genderRisk)) {
    const mod = REVERSE_MODULE_MAPPING[threat];
    if (mod) moduleScores[mod] += weight;
  }

  // C0. Universal baseline for General Safety in Sarawak
  moduleScores["M6"] += 3;

  // C. SELECTION
  // Sort modules by score
  const sortedModules = Object.entries(moduleScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  // Pick top 5 (or fewer if we want to focus). User said "Pick top 5 relevant modules".
  // If we have 6 modules total, picking top 5 means we drop 1.
  return sortedModules.slice(0, 5);
}

function getInitialDifficulty(education) {
  // Degree holders start at Level 2 (Medium). Others start at Level 1 (Easy).
  const { eduKey } = normalizeProfileForRisk({ education });
  if (eduKey === 'Degree' || eduKey === 'Master/PhD') return 2;
  return 1;
}

module.exports = {
  CONST_RISK_WEIGHTS,
  CONST_JOB_GROUPS,
  determineDigitalType,
  determineDynamicPersona,
  runVulnerabilityMatrix,
  getInitialDifficulty
};
