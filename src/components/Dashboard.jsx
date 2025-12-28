import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [assessment, setAssessment] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const dashboardRef = useRef(null);
  const [expandedTips, setExpandedTips] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/assessment/results', {
          headers: { 'x-auth-token': token }
        });
        setAssessment(res.data);
        
        // Fetch assessment history
        const historyRes = await axios.get('/api/assessment/history', {
          headers: { 'x-auth-token': token }
        });
        setAssessmentHistory(historyRes.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load assessment results');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div>Loading your results...</div>;
  if (error) return <div>{error}</div>;
  if (!assessment) return <div>No assessment found. Take the assessment first!</div>;

  // Prepare chart data based on digital type
  const chartData = {
    labels: ['Security Awareness', 'Risk Level', 'Improvement Potential'],
    datasets: [
      {
        data: getChartValues(assessment.digitalType),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare history chart data if available
  const historyData = {
    labels: assessmentHistory.map(item => format(new Date(item.completedAt), 'MMM d, yyyy')),
    datasets: [
      {
        label: 'Security Awareness Score',
        data: assessmentHistory.map(item => getChartValues(item.digitalType)[0]),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Risk Level',
        data: assessmentHistory.map(item => getChartValues(item.digitalType)[1]),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      }
    ],
  };

  const historyOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Security Progress Over Time',
      },
    },
  };

  const exportToPDF = async () => {
    toast.info('Generating PDF, please wait...', {
      position: "top-right",
      autoClose: 2000
    });
    
    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`digital-security-profile-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast.success('PDF exported successfully!', {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF. Please try again.', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const toggleTip = (index) => {
    setExpandedTips(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <>
      <div className="dashboard-container" ref={dashboardRef}>
        <h1>Your Digital Security Profile</h1>
        
        <div className="profile-card">
          <h2>Your Digital Type: <span className="highlight">{assessment.digitalType}</span></h2>
          <p>{getTypeDescription(assessment.digitalType)}</p>
        </div>
        
        <div className="dashboard-grid">
          <div className="chart-container">
            <h3>Security Overview</h3>
            <Doughnut data={chartData} />
          </div>
          
          <div className="key-mistakes">
            <h3>Key Areas for Improvement</h3>
            <ul>
              {assessment.keyMistakes.map((mistake, index) => (
                <li key={index}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {assessmentHistory.length > 1 && (
          <div className="history-section">
            <div className="history-header">
              <h3>Your Assessment History</h3>
              <button 
                className="toggle-history-btn"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
            
            {showHistory && (
              <div className="history-chart">
                <Line options={historyOptions} data={historyData} />
                <p className="history-note">
                  This chart shows how your security awareness and risk levels have changed over time.
                  {assessmentHistory.length > 2 && ' Keep taking assessments to track your progress!'}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="recommendations">
          <h3>Personalized Recommendations</h3>
          <div className="recommendation-cards">
            {getRecommendations(assessment.digitalType).map((rec, index) => (
              <div className="recommendation-card" key={index}>
                <div className="recommendation-header">
                  <h4>{rec.title}</h4>
                  <button 
                    className="tip-toggle-btn"
                    onClick={() => toggleTip(index)}
                    aria-label={expandedTips[index] ? "Collapse tip" : "Expand tip"}
                  >
                    {expandedTips[index] ? '−' : '+'}
                  </button>
                </div>
                <p>{rec.description}</p>
                
                {expandedTips[index] && (
                  <div className="expanded-tip">
                    <h5>Why This Matters</h5>
                    <p>{rec.whyItMatters}</p>
                    
                    <h5>How To Implement</h5>
                    <ol>
                      {rec.implementationSteps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                <div className="recommendation-footer">
                  <a href={rec.link} target="_blank" rel="noopener noreferrer">Learn more</a>
                  <button 
                    className="tip-button"
                    onClick={() => toggleTip(index)}
                  >
                    {expandedTips[index] ? 'Show Less' : 'Show More Tips'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="actions-section">
          <h3>Next Steps</h3>
          <div className="action-buttons">
            <button 
              className="action-btn print-btn" 
              onClick={() => {
                toast.info('Preparing to print...', {
                  position: "top-right",
                  autoClose: 2000
                });
                window.print();
              }}
            >
              Print Results
            </button>
            <button className="action-btn export-btn" onClick={exportToPDF}>
              Export as PDF
            </button>
            <button 
              className="action-btn retake-btn" 
              onClick={() => {
                toast.info('Redirecting to assessment...', {
                  position: "top-right",
                  autoClose: 2000
                });
                window.location.href = '/assessment';
              }}
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

// Helper functions for dashboard
function getChartValues(digitalType) {
  // Return appropriate values based on digital type
  switch(digitalType) {
    case 'Careless Clicker':
      return [30, 80, 90];
    case 'Password Reuser':
      return [45, 70, 75];
    case 'Update Avoider':
      return [50, 65, 70];
    case 'Oversharer':
      return [40, 75, 80];
    case 'Security Savvy':
      return [85, 25, 40];
    default:
      return [50, 50, 50];
  }
}

function getTypeDescription(digitalType) {
  // Return description based on digital type
  switch(digitalType) {
    case 'Careless Clicker':
      return 'You tend to click on links without verifying their authenticity, making you vulnerable to phishing attacks and malware.';
    case 'Password Reuser':
      return 'You often use the same password across multiple accounts, which increases your risk if one account is compromised.';
    case 'Update Avoider':
      return 'You frequently postpone software updates, leaving your devices vulnerable to known security vulnerabilities.';
    case 'Oversharer':
      return 'You share too much personal information online, increasing your risk of identity theft and targeted attacks.';
    case 'Security Savvy':
      return 'You demonstrate good security practices and awareness. Keep up the good work!';
    default:
      return 'Your digital security profile shows mixed habits.';
  }
}

function getRecommendations(digitalType) {
  // Return tailored recommendations based on digital type
  const baseRecommendations = [
    {
      title: 'Use a Password Manager',
      description: 'Store unique, complex passwords securely with a password manager.',
      link: 'https://www.nist.gov/blogs/cybersecurity-insights/password-managers-store-memorize-and-create',
      whyItMatters: 'Password managers help you create and store strong, unique passwords for all your accounts, significantly reducing the risk of account compromise. They also auto-fill credentials, protecting you from keyloggers and phishing sites.',
      implementationSteps: [
        'Research reputable password managers like LastPass, 1Password, or Bitwarden.',
        'Install the password manager on all your devices.',
        'Import any saved passwords from your browsers.',
        'Gradually replace weak or reused passwords with strong, generated ones.',
        'Enable two-factor authentication on your password manager account.'
      ]
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your important accounts.',
      link: 'https://www.cisa.gov/mfa',
      whyItMatters: 'Two-factor authentication requires something you know (password) and something you have (like your phone), making it much harder for attackers to access your accounts even if they have your password.',
      implementationSteps: [
        'Start with your most critical accounts: email, banking, and cloud storage.',
        'Use an authenticator app like Google Authenticator or Authy instead of SMS when possible.',
        'Save backup codes in a secure location in case you lose your device.',
        'Consider a hardware security key like YubiKey for maximum security.',
        'Review your 2FA settings periodically to ensure they're up to date.'
      ]
    }
  ];
  
  // Add type-specific recommendations
  switch(digitalType) {
    case 'Careless Clicker':
      return [
        ...baseRecommendations,
        {
          title: 'Verify Before You Click',
          description: 'Always check email sender addresses and hover over links before clicking.',
          link: 'https://www.ftc.gov/business-guidance/small-businesses/cybersecurity/phishing',
          whyItMatters: 'Phishing attacks are becoming increasingly sophisticated. Taking a moment to verify links and sender addresses can prevent malware infections, account compromise, and even financial loss.',
          implementationSteps: [
            'Hover over links to see the actual URL before clicking.',
            'Check the sender's email address carefully, not just the display name.',
            'Be suspicious of urgent requests, especially those involving money or credentials.',
            'When in doubt, contact the supposed sender through a different channel.',
            'Use a browser extension that checks links against known phishing sites.'
          ]
        }
      ];
    case 'Password Reuser':
      return [
        ...baseRecommendations,
        {
          title: 'Create Strong, Unique Passwords',
          description: 'Use different passwords for each account, especially for financial and email accounts.',
          link: 'https://www.cisa.gov/secure-our-world/create-strong-passwords',
          whyItMatters: 'When you reuse passwords, a breach at one service puts all your accounts at risk. Unique passwords contain the damage from any single breach.',
          implementationSteps: [
            'Aim for passwords at least 12 characters long with a mix of character types.',
            'Consider using passphrases - several random words strung together.',
            'Prioritize changing passwords for financial, email, and work accounts.',
            'Set a schedule to update critical passwords every 3-6 months.',
            'Use your password manager's security dashboard to identify weak or reused passwords.'
          ]
        }
      ];
    case 'Update Avoider':
      return [
        ...baseRecommendations,
        {
          title: 'Set Up Automatic Updates',
          description: 'Configure your devices to install security updates automatically whenever possible.',
          link: 'https://www.cisa.gov/news-events/news/update-your-software-now-check-auto-updates',
          whyItMatters: 'Software updates often patch security vulnerabilities that hackers actively exploit. Delaying updates leaves your system exposed to known threats that could have been prevented.',
          implementationSteps: [
            'Enable automatic updates in your operating system settings.',
            'Configure browsers and critical applications to update automatically.',
            'Set a specific time for updates to occur when you're not using your devices.',
            'Review update settings after major OS upgrades, as they sometimes reset.',
            'Consider using a patch management tool for multiple devices.'
          ]
        },
        {
          title: 'Schedule Regular Update Checks',
          description: 'Set a recurring calendar reminder to check for and install updates on devices that can't update automatically.',
          link: 'https://www.ncsc.gov.uk/guidance/alert-update-all-devices',
          whyItMatters: 'Some devices and software don't support automatic updates. Regular manual checks ensure these systems don't fall behind on critical security patches.',
          implementationSteps: [
            'Create a monthly calendar reminder to check all devices.',
            'Make a list of all devices that need manual updates (IoT devices, appliances, etc.).',
            'Check manufacturer websites for firmware updates for older devices.',
            'Document your update process for complex systems.',
            'Consider replacing devices that no longer receive security updates.'
          ]
        }
      ];
    case 'Oversharer':
      return [
        ...baseRecommendations,
        {
          title: 'Review Privacy Settings',
          description: 'Regularly audit and adjust privacy settings on all your social media accounts and online services.',
          link: 'https://www.ftc.gov/business-guidance/privacy-security/privacy-choices',
          whyItMatters: 'Default privacy settings often favor sharing more information than necessary. Regular reviews help limit your digital footprint and reduce exposure to identity theft and targeted attacks.',
          implementationSteps: [
            'Schedule a quarterly "privacy checkup" for all major accounts.',
            'Review who can see your posts, photos, and personal information.',
            'Check which third-party apps have access to your accounts and revoke unnecessary permissions.',
            'Use privacy tools like Facebook's Privacy Checkup or Google's Privacy Dashboard.',
            'Consider using privacy-focused alternatives for sensitive activities.'
          ]
        },
        {
          title: 'Think Before You Share',
          description: 'Consider the potential security implications before posting personal information online.',
          link: 'https://www.stopthinkconnect.org/tips-advice/general-tips-and-advice',
          whyItMatters: 'Information shared online can be used for social engineering, identity theft, or to answer your security questions. Once information is online, it's difficult to completely remove.',
          implementationSteps: [
            'Avoid sharing your full birth date, address, or phone number publicly.',
            'Be cautious about sharing real-time location information.',
            'Don't post photos of identification documents, tickets with barcodes, or keys.',
            'Consider the "billboard test" - would you put this information on a public billboard?',
            'Regularly search for yourself online to see what information is publicly available.'
          ]
        }
      ];
    case 'Security Savvy':
      return [
        ...baseRecommendations,
        {
          title: 'Stay Updated on Security Trends',
          description: 'Follow cybersecurity news sources to stay informed about emerging threats.',
          link: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
          whyItMatters: 'The cybersecurity landscape evolves rapidly. Staying informed helps you adapt your security practices to address new threats before they affect you.',
          implementationSteps: [
            'Subscribe to reputable security newsletters like Krebs on Security or SANS NewsBites.',
            'Follow cybersecurity organizations on social media.',
            'Set up Google Alerts for security topics relevant to your technology stack.',
            'Join online communities focused on cybersecurity awareness.',
            'Attend webinars or virtual conferences on emerging security topics.'
          ]
        },
        {
          title: 'Consider Security Mentoring',
          description: 'Help friends and family improve their security practices by sharing your knowledge.',
          link: 'https://www.nist.gov/blogs/cybersecurity-insights/cybersecurity-awareness-month-2023-it-everyones-job',
          whyItMatters: 'Your security is only as strong as your network. By helping others improve their practices, you reduce the chance of attacks spreading through your connections.',
          implementationSteps: [
            'Offer to help family members set up password managers and 2FA.',
            'Share digestible security tips on social media.',
            'Create simple guides for common security tasks for less tech-savvy contacts.',
            'Host informal "security checkup" sessions for friends or colleagues.',
            'Lead by example by discussing your own security practices.'
          ]
        }
      ];
    default:
      return baseRecommendations;
  }
}

export default Dashboard;