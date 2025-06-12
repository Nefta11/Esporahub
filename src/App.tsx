import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import OverviewMainPage from './pages/OverviewMainPage';
import OverviewPage from './pages/OverviewPage';
import AccountPage from './pages/AccountPage';
import ConstructionPage from './pages/ConstructionPage';
import ChecklistCapturaPage from './pages/ChecklistCapturaPage';
import './styles/global.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={{
          enter: 1500,
          exit: 1500
        }}
        classNames={{
          enter: 'page-enter',
          enterActive: 'page-enter-active',
          exit: 'page-exit',
          exitActive: 'page-exit-active'
        }}
        mountOnEnter
        unmountOnExit
      >
        <Routes location={location}>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<MenuPage />} />
          <Route path="/overview-main" element={<OverviewMainPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/construction" element={<ConstructionPage />} />
          <Route path="/checklist-captura" element={<ChecklistCapturaPage />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;