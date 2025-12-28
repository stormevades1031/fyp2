const { runVulnerabilityMatrix } = require('../src/utils/assessmentLogic.js');

const profiles = [
  { occupation: 'IT/Computers/Electronics', ageGroup: '35 - 44', gender: 'Male', education: "Bachelor's Degree" }, // M1
  { occupation: 'Business/Management/Consulting', ageGroup: '25 - 34', gender: 'Male', education: 'Primary/Secondary School' }, // M2
  { occupation: 'Retired', ageGroup: '65 or above', gender: 'Female', education: 'Primary/Secondary School' }, // M3
  { occupation: 'Student', ageGroup: '18 - 24', gender: 'Male', education: 'Diploma/Certificate' }, // M4
  { occupation: 'Customer Service/Sales/Retail', ageGroup: '25 - 34', gender: 'Female', education: 'No formal education' }, // M5
  { occupation: 'Other (please specify)', ageGroup: '35 - 44', gender: 'Prefer not to say', education: 'Primary/Secondary School' }, // M6 baseline
];

profiles.forEach((p, i) => {
  const selected = runVulnerabilityMatrix(p);
  console.log(`Case ${i + 1}:`, selected);
});

