import React, { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import Logo from './Logo';
import FlowEffect from './FlowEffect';
import MeltingText from './MeltingText';
import '../styles/header.css';
import '../styles/flow-effect.css';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Force dark mode on landing page
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }, []);

  return (
    <header className="header dark-theme">
      <FlowEffect />
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>
      <div className={`overlay ${isVisible ? 'visible' : ''}`}>
        <div className="content">
          <h1 className="title">
            <MeltingText text="esporahub" />
          </h1>
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;