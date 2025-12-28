import React from 'react';
import '../AboutContactStyles.css';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t('about_title')}</h1>
        <p>{t('about_subtitle')}</p>
      </div>

      {/* Mission Section */}
      <section className="content-section">
        <h2>{t('about_mission_title')}</h2>
        <p>{t('about_mission_body')}</p>
      </section>

      {/* Story Section */}
      <section className="content-section">
        <h2>{t('about_story_title')}</h2>
        <p>{t('about_story_body')}</p>
      </section>

      {/* Approach Section */}
      <section className="content-section">
        <h2>{t('about_approach_title')}</h2>
        <p>{t('about_approach_body1')}</p>
        <p>{t('about_approach_body2')}</p>
      </section>

      {/* Team Section */}
      <section className="content-section">
        <h2>{t('about_team_title')}</h2>
        <div className="team-grid">
          {/* Founder & Lead Researcher */}
          <div className="team-member">
            <div className="team-member-image image-tristan"></div>
            <h3>Mr. Tristan Lo</h3>
            <p className="team-title">{t('role_founder')}</p>
            <p>
              BSc (Hons) Computer Science candidate at UTS, Tristan spearheads the research
              and platform architecture.
            </p>
          </div>

          {/* Supervisor & Advisor */}
          <div className="team-member">
            <div className="team-member-image image-gary"></div>
            <h3>Ts. Dr. Gary Loh Chee Wyai</h3>
            <p className="team-title">{t('role_supervisor')}</p>
            <p>
              An expert in cybersecurity, Dr. Loh ensures methodological rigour
              and academic integrity throughout the project.
            </p>
          </div>

          {/* UX Designer */}
          <div className="team-member">
            <div className="team-member-image image-emily"></div>
            <h3>Mr. Patrick Yung</h3>
            <p className="team-title">{t('role_project_lead')}</p>
            <p>
              Mr. Patrick is in charge of overseeing key aspects of HornbillSentinel, as well
              as future improvements that can be made to the platform.
            </p>
          </div>

          <div className="team-member">
            <div className="team-member-image image-dicky"></div>
            <h3>Mr. Dicky Teo</h3>
            <p className="team-title">{t('role_backend')}</p>
            <p>
              Dicky focuses on server‑side architecture, APIs, and data models powering the assessment
              and scoring engine.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
