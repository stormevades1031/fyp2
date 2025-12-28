import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/questionnaire">Assessment</Link></li>
            {!isAuthenticated && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/account-settings">Account Settings</Link></li>
              </>
            )}
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Social Media</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <address>
            <p><i className="fas fa-map-marker-alt"></i> 123 Security Street, Digital City</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-envelope"></i> info@digitaltypeassessment.com</p>
          </address>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HornbillSentinel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;