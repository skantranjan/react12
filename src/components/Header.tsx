import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/landing');
  };

  return (
    <div className="top-nav flex">
      <img src="/images/logo.png" alt="Haleon Logo" className="logoImage" data-themekey="#" />
      <h2>Sustainability Data Portal</h2>
      <ul className="flex">
        <li><a onClick={handleHomeClick} style={{ cursor: 'pointer' }}><i className="ri-home-5-line"></i> Home </a></li>
        <li><a href="#"> <i className="ri-information-line"></i> About</a></li>
        <li><a href="#"><i className="ri-mail-line"></i> Contact</a></li>
      </ul>
    </div>
  );
};

export default Header; 