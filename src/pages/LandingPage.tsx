import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/landing/css/styles.css';
import '../assets/landing/css/new-hero.css';
import '../assets/landing/css/remix-icon.css';
import logoImage from '../assets/landing/images/logo.png';
import landingImage from '../assets/landing/images/Landing.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path === 'cm-dashboard') {
      navigate('/cm-dashboard');
    } else if (path === 'cm-sku-details') {
      navigate('/cm-sku-details');
    } else if (path === 'audit-log') {
      // You can add the audit log route when it's implemented
      console.log('Audit log navigation not yet implemented');
    }
    // Add other navigation handlers as needed
  };

  return (
    <div className="landing-page">
      {/* Top Navigation */}
      <div className="top-nav flex">
        <img 
          src={logoImage} 
          alt="Haleon Logo" 
          className="logoImage"
        />
        <ul className="flex">
          <li><a onClick={() => navigate('/landing')} style={{ cursor: 'pointer' }}><i className="ri-home-5-line"></i> Home </a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="LandingPage">
        <div className="main">
          <div className="main-inner">
            <h2>Welcome to</h2>
            <h1>Sustainability Data Portal</h1>
            <p>
              The Sustainability Data Portal is a centralized platform designed to collect, 
              manage, and analyze data related to sustainability initiatives. It serves as a 
              comprehensive resource for organizations to track their environmental impact, 
              social responsibility efforts, and governance practices.
            </p>
            
            <div className="homeButtons flex">
              <a onClick={() => handleNavigation('cm-dashboard')}>
                <div>
                  <span><i className="ri-file-chart-fill"></i></span>
                </div>
                <span>CM Details</span>
              </a>
              
              <a onClick={() => handleNavigation('cm-sku-details')}>
                <div>
                  <span><i className="ri-file-text-fill"></i></span>
                </div>
                <span>CM SKU Details</span>
              </a>
              
              <a onClick={() => handleNavigation('audit-log')}>
                <div>
                  <span><i className="ri-file-list-3-fill"></i></span>
                </div>
                <span>Audit Log Report</span>
              </a>
            </div>
            <div className="clearfix"></div>
          </div>

          <div className="RightImage">
            <img src={landingImage} alt="Landing" />
            <div className="Quote">
              <i className="ri-double-quotes-l"></i>
              Embrace the journey of growth, for every step forward is a step towards your dreams
              <i className="ri-double-quotes-r"></i>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>

      <footer></footer>
    </div>
  );
};

export default LandingPage;
