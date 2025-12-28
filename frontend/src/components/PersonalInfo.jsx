import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../QuestionnaireStyles.css';
import { useLanguage } from '../context/LanguageContext';

const ageOptions = [
  'Under 18',
  '18 - 24',
  '25 - 34',
  '35 - 44',
  '45 - 54',
  '55 - 64',
  '65 or above',
];

const genderOptions = ['Male', 'Female', 'Prefer not to say'];

const educationOptions = [
  'No formal education',
  'Primary/Secondary School',
  'Diploma/Certificate',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate (Ph.D.) or higher',
  'Other',
];

const occupationOptions = [
  'Agriculture/Farming/Fisheries',
  'Banking/Finance/Insurance',
  'Biotechnology/Life Sciences/Healthcare',
  'Building/Construction/Engineering',
  'Business/Management/Consulting',
  'Creative/Design/Media',
  'Customer Service/Sales/Retail',
  'Education/Academia',
  'Government/Public Safety/Legal',
  'IT/Computers/Electronics',
  'Manufacturing/Operations/Logistics',
  'Hospitality/Food Services',
  'Student',
  'Retired',
  'Other (please specify)',
  'Unemployed',
];

function PersonalInfo() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ageGroup: '', gender: '', education: '', occupation: '' });

  const optionSets = [
    { label: t('personal_age_label'), key: 'ageGroup', options: ageOptions },
    { label: t('personal_gender_label'), key: 'gender', options: genderOptions },
    { label: t('personal_education_label'), key: 'education', options: educationOptions },
    { label: t('personal_occupation_label'), key: 'occupation', options: occupationOptions },
  ];

  const current = optionSets[step];

  const handleSelect = (value) => {
    setForm({ ...form, [current.key]: value });
  };

  const handleNext = () => {
    if (!form[current.key]) return;
    if (step < optionSets.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const existing = sessionStorage.getItem('assessmentData');
        const base = existing ? JSON.parse(existing) : {};
        const data = { ...base, ...form, usedBefore: true };
        sessionStorage.setItem('assessmentData', JSON.stringify(data));
      } catch {}
      navigate('/questionnaire');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="questionnaire-container">
      <div className="question-card">
        <h2>{current.label}</h2>
        <div className="options">
          {current.options.map((opt) => {
            const mapKey = (val) => {
              if (current.key==='ageGroup') {
                if (val==='Under 18') return 'opt_age_under_18';
                if (val==='18 - 24') return 'opt_age_18_24';
                if (val==='25 - 34') return 'opt_age_25_34';
                if (val==='35 - 44') return 'opt_age_35_44';
                if (val==='45 - 54') return 'opt_age_45_54';
                if (val==='55 - 64') return 'opt_age_55_64';
                if (val==='65 or above') return 'opt_age_65_plus';
              }
              if (current.key==='gender') {
                if (val==='Male') return 'opt_gender_male';
                if (val==='Female') return 'opt_gender_female';
                if (val==='Prefer not to say') return 'opt_gender_na';
              }
              if (current.key==='education') {
                if (val==='No formal education') return 'opt_edu_none';
                if (val==='Primary/Secondary School') return 'opt_edu_school';
                if (val==='Diploma/Certificate') return 'opt_edu_diploma';
                if (val==="Bachelor's Degree") return 'opt_edu_bachelor';
                if (val==="Master's Degree") return 'opt_edu_master';
                if (val==='Doctorate (Ph.D.) or higher') return 'opt_edu_phd';
                if (val==='Other') return 'opt_other';
              }
              if (current.key==='occupation') {
                if (val==='Agriculture/Farming/Fisheries') return 'opt_occ_agriculture';
                if (val==='Banking/Finance/Insurance') return 'opt_occ_banking';
                if (val==='Biotechnology/Life Sciences/Healthcare') return 'opt_occ_biotech';
                if (val==='Building/Construction/Engineering') return 'opt_occ_construction';
                if (val==='Business/Management/Consulting') return 'opt_occ_business';
                if (val==='Creative/Design/Media') return 'opt_occ_creative';
                if (val==='Customer Service/Sales/Retail') return 'opt_occ_customer';
                if (val==='Education/Academia') return 'opt_occ_education';
                if (val==='Government/Public Safety/Legal') return 'opt_occ_gov';
                if (val==='IT/Computers/Electronics') return 'opt_occ_it';
                if (val==='Manufacturing/Operations/Logistics') return 'opt_occ_manufacturing';
                if (val==='Hospitality/Food Services') return 'opt_occ_hospitality';
                if (val==='Student') return 'opt_occ_student';
                if (val==='Retired') return 'opt_occ_retired';
                if (val==='Other (please specify)') return 'opt_occ_other';
                if (val==='Unemployed') return 'opt_occ_unemployed';
              }
              return null;
            };
            const key = mapKey(opt);
            const label = key ? t(key) : opt;
            return (
              <button
                key={opt}
                className={`option-button${form[current.key] === opt ? ' selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="navigation-buttons" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="option-button" onClick={handleBack} disabled={step === 0}>{t('back')}</button>
          <button className="option-button" onClick={handleNext}>{t('next')}</button>
        </div>
        <div className="progress-bar" style={{ marginTop: '24px' }}>
          <div className="progress" style={{ width: `${((step + 1) / optionSets.length) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
