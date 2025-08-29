import React, { useMemo } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  color: string;
  path?: string;
  category: 'operativas' | 'organizativas' | 'recursos';
  description: string;
  status: 'active' | 'beta' | 'new' | 'coming-soon';
}

export const useMenuItems = (): MenuItem[] => {
  return useMemo(() => [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      color: '#007AFF',
      path: '/overview-menu',
      category: 'operativas',
      description: 'Panel de control principal',
      status: 'active'
    },
    {
      id: 'sales-force',
      label: 'Sales Force',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 12l4-4 4 4 6-6" />
        </svg>
      ),
      color: '#007AFF',
      category: 'operativas',
      description: 'CRM y ventas',
      status: 'active'
    },
    {
      id: 'workhub',
      label: 'WorkHub',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: '#007AFF',
      path: '/workhub',
      category: 'operativas',
      description: 'Centro de colaboración',
      status: 'active'
    },
    {
      id: 'trackline',
      label: 'TrackLine',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      color: '#007AFF',
      path: '/construction',
      category: 'operativas',
      description: 'Gestión de proyectos',
      status: 'active'
    },
    {
      id: 'people-ops',
      label: 'People Operations',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      color: '#007AFF',
      category: 'operativas',
      description: 'Recursos humanos',
      status: 'active'
    },
    {
      id: 'agenda',
      label: 'Agenda Espora',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      color: '#5856D6',
      category: 'organizativas',
      description: 'Calendario inteligente',
      status: 'active'
    },
    {
      id: 'gestion-acuerdos',
      label: 'Gestión de Acuerdos',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
      color: '#5856D6',
      category: 'organizativas',
      description: 'Gestión de contratos',
      status: 'active'
    },
    {
      id: 'moneyflow',
      label: 'MoneyFlow',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <line x1="18" y1="12" x2="18" y2="12" />
        </svg>
      ),
      color: '#5856D6',
      category: 'organizativas',
      description: 'Análisis financiero',
      status: 'active'
    },
    {
      id: 'boveda-cliente',
      label: 'Bóveda del Cliente',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <rect x="8" y="11" width="8" height="7" rx="1" ry="1" />
          <path d="M10 11V9a2 2 0 1 1 4 0v2" />
        </svg>
      ),
      color: '#5856D6',
      category: 'organizativas',
      description: 'Archivos del cliente',
      status: 'active'
    },
    {
      id: 'chat',
      label: 'Espora Chat',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      color: '#5856D6',
      category: 'organizativas',
      description: 'Mensajería empresarial',
      status: 'active'
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      color: '#FF9500',
      category: 'recursos',
      description: 'Base de conocimiento',
      status: 'active'
    },
    {
      id: 'campus',
      label: 'Espora Campus',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      color: '#FF9500',
      category: 'recursos',
      description: 'Plataforma de aprendizaje',
      status: 'active'
    },
    {
      id: 'boveda-espora',
      label: 'Bóveda Espora',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      color: '#FF9500',
      category: 'recursos',
      description: 'Documentos internos',
      status: 'active'
    },
    {
      id: 'lab',
      label: 'Espora Lab',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6v7.5l6 6.5a1 1 0 0 1-.7 1.7H3.7a1 1 0 0 1-.7-1.7l6-6.5V3z" />
          <path d="M12 9v6" />
        </svg>
      ),
      color: '#FF9500',
      category: 'recursos',
      description: 'Laboratorio de innovación',
      status: 'active'
    }
  ], []);
};