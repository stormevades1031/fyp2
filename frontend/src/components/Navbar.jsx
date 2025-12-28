import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../NavbarStyles.css';
import logo from '../images/logo.png';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
    setProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  const closeProfileDropdown = () => {
    setProfileDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Mobile menu icon */}
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        {/* Logo - using imported logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo} alt={t('alt_logo')} className="navbar-logo-img" />
        </Link>
        
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>{t('nav_home')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>{t('nav_about')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>{t('nav_contact')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/assessment-start" className="nav-link" onClick={closeMobileMenu}>{t('nav_assessment')}</Link>
          </li>
          {/* Mobile language selector inside the menu */}
          <li className="nav-item mobile-only">
            <div className="language-select-mobile">
              <span className="language-label">{t('language_label')}:</span>
              <select
                aria-label="Select language"
                value={language}
                onChange={(e)=>{ setLanguage(e.target.value); closeMobileMenu(); }}
                className="language-dropdown"
              >
                <option value="en">{t('lang_en')}</option>
                <option value="zh">{t('lang_zh')}</option>
                <option value="ms">{t('lang_ms')}</option>
                <option value="swk">{t('lang_swk')}</option>
              </select>
            </div>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>{t('nav_dashboard')}</Link>
              </li>
              {/* Keep Account Settings only for mobile */}
              <li className="nav-item mobile-only">
                <Link to="/account-settings" className="nav-link" onClick={closeMobileMenu}>{t('nav_account')}</Link>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li className="nav-item mobile-only">
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>{t('nav_login')}</Link>
              </li>
              <li className="nav-item mobile-only">
                <Link to="/register" className="nav-link" onClick={closeMobileMenu}>{t('nav_register')}</Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li className="nav-item mobile-only">
              <button className="nav-link logout-btn mobile-logout" onClick={handleLogout}>{t('nav_logout')}</button>
            </li>
          )}
        </ul>
        
        {/* User profile for desktop only */}
        <div className="user-profile desktop-only">
          {/* Language selector */}
          <div className="language-select desktop-only">
            <span className="language-label">{t('language_label')}:</span>
            <select
              aria-label={t('aria_select_language')}
              value={language}
              onChange={(e)=>setLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="en">{t('lang_en')}</option>
              <option value="zh">{t('lang_zh')}</option>
              <option value="ms">{t('lang_ms')}</option>
              <option value="swk">{t('lang_swk')}</option>
            </select>
          </div>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">{t('nav_login')}</Link>
              <Link to="/register" className="nav-link">{t('nav_register')}</Link>
            </>
          ) : (
            <>
              <span className="welcome-text">{t('dash_hello')}, {user?.name}!</span>
              <div className="profile-dropdown-container">
                <button 
                  className="nav-link profile-btn" 
                  onClick={toggleProfileDropdown}
                  onMouseEnter={() => setProfileDropdown(true)}
                >
                  {t('nav_profile')}
                  <i className="fas fa-chevron-down profile-arrow"></i>
                </button>
                {profileDropdown && (
                  <div 
                    className="profile-dropdown"
                    onMouseLeave={closeProfileDropdown}
                  >
                    <Link 
                      to="/account-settings" 
                      className="dropdown-item"
                      onClick={closeProfileDropdown}
                    >
                      <i className="fas fa-cog"></i>
                      {t('nav_account')}
                    </Link>
                    <button 
                      className="dropdown-item logout-dropdown" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
