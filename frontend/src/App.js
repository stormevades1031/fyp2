import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Questionnaire from './components/Questionnaire';
import AssessmentStart from './components/AssessmentStart';
import PersonalInfo from './components/PersonalInfo';
import AssessmentResults from './components/AssessmentResults';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import AccountSettings from './components/AccountSettings';
import ForgotPassword from './components/ForgotPassword';
import './HomePage.css';
import { Link } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

function App() {
  // Add the useEffect hook here
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Navbar behavior
      if (scrollTop > 50) {
        navbar?.classList.add('scrolled');
        navbar?.classList.remove('at-top');
      } else {
        navbar?.classList.remove('scrolled');
        navbar?.classList.add('at-top');
      }
      
      // Back to top button behavior
      if (scrollTop > 300) {
        backToTopBtn?.classList.add('visible');
      } else {
        backToTopBtn?.classList.remove('visible');
      }
    };
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    backToTopBtn?.addEventListener('click', scrollToTop);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      backToTopBtn?.removeEventListener('click', scrollToTop);
    };
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
              <Route path="/assessment-start" element={<AssessmentStart />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/assessment-results" element={<AssessmentResults />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
          <button className="back-to-top" aria-label="Back to top">
          </button>
        </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

// Custom HomePage component
const HomePage = () => {
  const { t } = useLanguage();
  return (
    <div className="home-container">
      {/* Hero Section with Start Assessment Button */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_sub')}</p>
          <Link to="/assessment-start" className="start-assessment-btn">{t('btn_start_assessment')}</Link>
        </div>
      </section>
      
      <main className="home-main">
        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>{t('feat_analysis_title')}</h3>
            <p>{t('feat_analysis_desc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>{t('feat_recs_title')}</h3>
            <p>{t('feat_recs_desc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h3>{t('feat_progress_title')}</h3>
            <p>{t('feat_progress_desc')}</p>
          </div>
        </div>
        
        <div className="home-card">
          <h2>{t('card_title')}</h2>
          <p>
            {t('card_body')}
          </p>
          <Link to="/about" className="start-btn">{t('btn_learn_more')}</Link>
        </div>
      </main>
    </div>
  );
};

// NotFound component for 404 errors
const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="home-container" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1 style={{ color: 'var(--primary-yellow)' }}>{t('notfound_title')}</h1>
      <p>{t('notfound_desc')}</p>
      <a href="/" className="start-btn" style={{ marginTop: '20px' }}>{t('notfound_return')}</a>
    </div>
  );
};

export default App;
