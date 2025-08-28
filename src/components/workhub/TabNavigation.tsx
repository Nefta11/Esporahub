import React from 'react';

interface TabNavigationProps {
  activeTab: 'tareas' | 'proyecto';
  onTabChange: (tab: 'tareas' | 'proyecto') => void;
  isDarkMode: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  isDarkMode
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '0'
    }}>
      <button
        className={`tab-selector ${activeTab === 'tareas' ? 'active' : ''}`}
        onClick={() => onTabChange('tareas')}
        style={{
          padding: '12px 24px',
          borderRadius: activeTab === 'tareas' ? '22px 0 0 22px' : '22px 0 0 22px',
          border: 'none',
          fontSize: '17px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '120px',
          ...(isDarkMode ? {
            background: activeTab === 'tareas' ? 'rgba(0, 122, 255, 0.8)' : 'rgba(118, 118, 128, 0.12)',
            color: activeTab === 'tareas' ? 'white' : 'rgba(255, 255, 255, 0.8)',
            borderRight: '0.5px solid rgba(84, 84, 88, 0.65)'
          } : {
            background: activeTab === 'tareas' ? 'rgba(0, 122, 255, 0.8)' : 'rgba(118, 118, 128, 0.12)',
            color: activeTab === 'tareas' ? 'white' : 'rgba(60, 60, 67, 0.8)',
            borderRight: '0.5px solid rgba(60, 60, 67, 0.29)'
          })
        }}
      >
        TAREAS
      </button>
      <button
        className={`tab-selector ${activeTab === 'proyecto' ? 'active' : ''}`}
        onClick={() => onTabChange('proyecto')}
        style={{
          padding: '12px 24px',
          borderRadius: activeTab === 'proyecto' ? '0 22px 22px 0' : '0 22px 22px 0',
          border: 'none',
          fontSize: '17px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '120px',
          ...(isDarkMode ? {
            background: activeTab === 'proyecto' ? 'rgba(0, 122, 255, 0.8)' : 'rgba(118, 118, 128, 0.12)',
            color: activeTab === 'proyecto' ? 'white' : 'rgba(255, 255, 255, 0.8)'
          } : {
            background: activeTab === 'proyecto' ? 'rgba(0, 122, 255, 0.8)' : 'rgba(118, 118, 128, 0.12)',
            color: activeTab === 'proyecto' ? 'white' : 'rgba(60, 60, 67, 0.8)'
          })
        }}
      >
        PROYECTO
      </button>
    </div>
  );
};

export default TabNavigation;