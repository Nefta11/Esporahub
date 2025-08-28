import React, { useEffect, useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, FileText, ArrowUp, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import { storage } from '@/utils/storage';
import InputModal from '@/components/modals/InputModal';
import '@/styles/worhub/workhub.css';

interface TaskAssignment {
  itemId: string;
  userId: string;
  concept: string;
  dueDate: string;
  section: string;
  sectionId?: string;
  completed?: boolean;
  code?: string;
}

interface ProjectItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed?: boolean;
}

interface FormDataItem {
  id: string;
  concept: string;
}

const WorkHubPage: React.FC = () => {
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'tareas' | 'proyecto'>('tareas');
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>(() => {
    // Intentar cargar los valores de los campos desde localStorage
    const savedValues = storage.getItem<{ [key: string]: string }>('fieldValues');
    return savedValues || {};
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    fieldName: '',
    fieldType: 'text' as 'text' | 'number' | 'select',
    initialValue: '',
    selectOptions: [] as { value: string; label: string }[],
    onSave: () => { }
  });
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Función para cargar los ítems del proyecto desde localStorage
  const loadProjectItems = React.useCallback(() => {
    try {
      // Cargar los ítems seleccionados y los datos del formulario
      const selectedItems = storage.getItem<{ [key: string]: boolean }>('selectedItems') || {};
      const formData = storage.getItem<{ [key: string]: FormDataItem[] }>('formData');

      if (formData) {
        const items: ProjectItem[] = [];

        // Procesar cada sección
        Object.entries(formData).forEach(([sectionId, data]: [string, FormDataItem[]]) => {
          data.forEach((item) => {
            if (selectedItems[item.id]) {
              items.push({
                id: item.id,
                concept: item.concept,
                section: getSectionName(sectionId),
                sectionId: sectionId
              });
            }
          });
        });

        setProjectItems(items);
      }
    } catch (error) {
      console.error('Error loading project items:', error);
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);

    // Función para cargar las tareas
    const loadTasks = () => {
      try {
        // Cargar las asignaciones de tareas desde localStorage 
        const savedAssignments = storage.getItem<TaskAssignment[]>('taskAssignments') || [];

        // Filtrar solo las tareas asignadas al usuario actual
        if (user) {
          const userTasks = savedAssignments.filter(task => task.userId === user.id);
          setTaskAssignments(userTasks);
        }
      } catch (error) {
        console.error('Error loading task assignments:', error);
      }
    };

    // Cargar tareas inicialmente
    loadTasks();
    loadProjectItems();

    // Configurar un intervalo para verificar periódicamente si hay nuevas tareas
    const intervalId = setInterval(loadTasks, 3000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [user, loadProjectItems]);

  // Función para obtener el nombre de la sección
  const getSectionName = (sectionId: string): string => {
    const sectionMapping: { [key: string]: string } = {
      'estrategia': 'Set Up Estrategia Digital',
      'antropologicos': 'Estudios Antropológicos',
      'otros-estudios': 'Otros Estudios',
      'acompanamiento': 'Set Up Acompañamiento Digital',
      'gerencia': 'Set Up Gerencia Digital',
      'produccion': 'Set Up Producción',
      'difusion': 'Set up Difusión'
    };

    return sectionMapping[sectionId] || sectionId;
  };

  // Función para obtener las tareas según la categoría seleccionada
  const getFilteredTasks = () => {
    if (!taskAssignments.length) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    return taskAssignments.filter(task => {
      // Si la categoría es "all", mostrar todas las tareas
      if (selectedCategory === 'all') return true;

      if (!task.dueDate) return selectedCategory === 'no-date';

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (selectedCategory) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week': {
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        }
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    });
  };

  const filteredTasks = getFilteredTasks();

  // Función para obtener el conteo de tareas por categoría
  const getTaskCountForCategory = (categoryId: string) => {
    if (!taskAssignments.length) return 0;

    // Si la categoría es "all", mostrar el total de tareas
    if (categoryId === 'all') return taskAssignments.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    return taskAssignments.filter(task => {
      if (!task.dueDate) return categoryId === 'no-date';

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (categoryId) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week': {
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        }
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    }).length;
  };

  const timeCategories = [
    { id: 'all', label: 'Todas', icon: <Calendar size={16} /> },
    { id: 'past', label: 'Días anteriores', icon: <Clock size={16} /> },
    { id: 'today', label: 'Hoy', icon: <Calendar size={16} /> },
    { id: 'this-week', label: 'Esta semana', icon: <Calendar size={16} /> },
    { id: 'next-week', label: 'Siguiente semana', icon: <Calendar size={16} /> },
    { id: 'later', label: 'Después', icon: <Calendar size={16} /> },
    { id: 'no-date', label: 'Sin fecha', icon: <Calendar size={16} /> }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Función para abrir el modal
  const openModal = (
    itemId: string,
    fieldName: string,
    fieldType: 'text' | 'number' | 'select' = 'text',
    selectOptions: { value: string; label: string }[] = []
  ) => {
    const fieldKey = `${itemId}-${fieldName}`;
    const currentValue = fieldValues[fieldKey] || '';

    setModalState({
      isOpen: true,
      fieldName,
      fieldType,
      initialValue: currentValue,
      selectOptions,
      onSave: () => { }
    });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  // Función para obtener el valor de un campo
  const getFieldValue = (itemId: string, fieldName: string) => {
    const fieldKey = `${itemId}-${fieldName}`;
    return fieldValues[fieldKey] || '';
  };

  return (
    <div className={`workhub-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="WorkHub"
        subtitle="Centro de colaboración y gestión de tareas"
        backButtonText="Menú"
        backButtonPath="/dashboard"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`workhub-main ${isVisible ? 'visible' : ''}`}>
        <div className="workhub-content-container">
          {/* Tab Navigation - Apple Style */}
          <section className="workhub-actions-section">
            <div className="workhub-section-header">
              <h2>Mi WorkHub</h2>
              <p>Gestiona tus tareas y proyectos</p>
            </div>

            {/* Tab Selector */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              gap: '0'
            }}>
              <button
                className={`tab-selector ${activeTab === 'tareas' ? 'active' : ''}`}
                onClick={() => setActiveTab('tareas')}
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
                onClick={() => setActiveTab('proyecto')}
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

            {/* Time Categories - Solo mostrar cuando el tab activo es 'tareas' */}
            {activeTab === 'tareas' && (
              <div className="workhub-categories-grid">
                {timeCategories.map(category => (
                  <div
                    key={category.id}
                    className={`workhub-category-card ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="workhub-category-icon">
                      {category.icon}
                    </div>
                    <h3 className="workhub-category-title">{category.label}</h3>
                    <p className="workhub-category-count">{getTaskCountForCategory(category.id)} tareas</p>
                  </div>
                ))}
              </div>
            )}

            {/* Content Area */}
            {activeTab === 'tareas' ? (
              <div className="workhub-tasks-container">
                {filteredTasks && filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.itemId}
                      className={`workhub-task-item ${task.completed ? 'completed' : ''}`}
                    >
                      <div className={`workhub-task-icon ${task.completed ? 'status-completed' : 'status-pending'}`}>
                        {task.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>

                      <div className="workhub-task-content">
                        <h3 className="workhub-task-title">
                          {task.concept || "Tarea sin nombre"}
                        </h3>
                        <p className="workhub-task-section">
                          {task.section}
                        </p>
                        <div className="workhub-task-meta">
                          <div className="workhub-task-date">
                            <Calendar size={14} />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            }) : 'Sin fecha'}
                          </div>
                          <div className="workhub-task-id">
                            {task.itemId || task.code}
                          </div>
                        </div>
                      </div>

                      <div className={`workhub-task-status ${task.completed ? 'completed' : 'pending'}`}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="workhub-empty-state">
                    <div className="workhub-empty-icon">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="workhub-empty-title">
                      No tienes tareas asignadas
                    </h3>
                    <p className="workhub-empty-description">
                      No se encontraron tareas en esta categoría
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="workhub-table-container">
                <div style={{ overflowX: 'auto' }}>
                  <table className="workhub-table">
                    <thead>
                      <tr>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Actualizaciones</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Nivel de Progreso</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Fase del Proyecto</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Línea Estratégica</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Microcampaña</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Estado Actual</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Gerente de Proyecto</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Equipo de Trabajo</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Nombre del Colaborador</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Perfil Profesional</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Fechas de Entrega</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Semana Actual</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Tipo de Elemento</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Cantidad Total</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Cantidad en Proceso</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Cantidad Aprobada</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Fecha de Finalización</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Repositorio de Contenido</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Repositorio de Firmas</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Enlaces de Repositorio</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Desarrollo creativo</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Fecha testeo</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Estatus testeo</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Entrega al cliente</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1a202c',
                          borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                          position: 'sticky',
                          top: 0,
                          background: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}>Nombre del archivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectItems.length > 0 ? (
                        projectItems.map((item) => (
                          <tr key={item.id} style={{
                            borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease'
                          }}>
                            <td style={{ padding: '12px' }}>
                              <button style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '8px',
                                color: '#007AFF',
                                transition: 'all 0.2s ease'
                              }}>
                                <FileText size={16} />
                              </button>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <button style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '8px',
                                color: '#34C759',
                                transition: 'all 0.2s ease'
                              }}>
                                <ArrowUp size={16} />
                              </button>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'fase')}
                                placeholder="Fase"
                                readOnly
                                onClick={() => openModal(item.id, 'Fase')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'linea_estrategica')}
                                placeholder="Línea estratégica"
                                readOnly
                                onClick={() => openModal(item.id, 'Línea estratégica')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'microcampana')}
                                placeholder="Microcampaña"
                                readOnly
                                onClick={() => openModal(item.id, 'Microcampaña')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'estatus')}
                                placeholder="Estatus"
                                readOnly
                                onClick={() => openModal(item.id, 'Estatus')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'gerente')}
                                placeholder="Gerente"
                                readOnly
                                onClick={() => openModal(item.id, 'Gerente')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'colaboradores')}
                                placeholder="Colaboradores"
                                readOnly
                                onClick={() => openModal(item.id, 'Colaboradores')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'nombre_colaborador')}
                                placeholder="Nombre del colaborador"
                                readOnly
                                onClick={() => openModal(item.id, 'Nombre del colaborador')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'perfil_colaborador')}
                                placeholder="Perfil de colaborador"
                                readOnly
                                onClick={() => openModal(item.id, 'Perfil de colaborador')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'solicitud_entrega')}
                                placeholder="Solicitud y entrega"
                                readOnly
                                onClick={() => openModal(item.id, 'Solicitud y entrega')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'semana_curso')}
                                placeholder="Semana en curso"
                                readOnly
                                onClick={() => openModal(item.id, 'Semana en curso')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'tipo_item')}
                                placeholder="Tipo de item"
                                readOnly
                                onClick={() => openModal(item.id, 'Tipo de item')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'cantidad_v')}
                                placeholder="Cantidad V..."
                                readOnly
                                onClick={() => openModal(item.id, 'Cantidad V...', 'number')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'cantidad_pr')}
                                placeholder="Cantidad Pr..."
                                readOnly
                                onClick={() => openModal(item.id, 'Cantidad Pr...', 'number')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'cantidad_a')}
                                placeholder="Cantidad A..."
                                readOnly
                                onClick={() => openModal(item.id, 'Cantidad A...', 'number')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="date"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'fecha_finalizacion')}
                                onChange={(e) => {
                                  const updatedValues = {
                                    ...fieldValues,
                                    [`${item.id}-fecha_finalizacion`]: e.target.value
                                  };
                                  setFieldValues(updatedValues);
                                  storage.setItem('fieldValues', updatedValues);
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'repositorio_co')}
                                placeholder="Repositorio de co..."
                                readOnly
                                onClick={() => openModal(item.id, 'Repositorio de co...')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'repositorio_firma')}
                                placeholder="Repositorio firma..."
                                readOnly
                                onClick={() => openModal(item.id, 'Repositorio firma...')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'enlace_repositorio')}
                                placeholder="Enlace de repositorio"
                                readOnly
                                onClick={() => openModal(item.id, 'Enlace de repositorio')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'desarrollo_creativo')}
                                placeholder="Desarrollo creativo"
                                readOnly
                                onClick={() => openModal(item.id, 'Desarrollo creativo')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="date"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'fecha_testeo')}
                                onChange={(e) => {
                                  const updatedValues = {
                                    ...fieldValues,
                                    [`${item.id}-fecha_testeo`]: e.target.value
                                  };
                                  setFieldValues(updatedValues);
                                  storage.setItem('fieldValues', updatedValues);
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'estatus_testeo')}
                                placeholder="Estatus testeo"
                                readOnly
                                onClick={() => openModal(item.id, 'Estatus testeo')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'entrega_cliente')}
                                placeholder="Entrega al cliente"
                                readOnly
                                onClick={() => openModal(item.id, 'Entrega al cliente')}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isDarkMode ? '1px solid rgba(118, 118, 128, 0.24)' : '1px solid rgba(0, 0, 0, 0.1)',
                                  background: isDarkMode ? 'rgba(118, 118, 128, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                                  color: isDarkMode ? 'white' : '#1a202c',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                value={getFieldValue(item.id, 'nombre_archivo')}
                                placeholder="Nombre del archivo"
                                readOnly
                                onClick={() => openModal(item.id, 'Nombre del archivo')}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={25} style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            opacity: 0.6
                          }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '1rem'
                            }}>
                              <Briefcase size={64} style={{
                                color: isDarkMode ? 'rgba(0, 122, 255, 0.6)' : 'rgba(0, 122, 255, 0.6)'
                              }} />
                              <div className="empty-project-content">
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <PageFooter
        showLogoutDialog={showLogoutDialog}
        onLogoutClick={() => setShowLogoutDialog(true)}
        onLogoutDialogClose={() => setShowLogoutDialog(false)}
      />

      <InputModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={modalState.onSave}
        initialValue={modalState.initialValue}
        fieldName={modalState.fieldName}
        fieldType={modalState.fieldType}
        selectOptions={modalState.selectOptions}
      />
    </div>
  );
};

export default WorkHubPage;