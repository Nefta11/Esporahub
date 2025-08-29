import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import { storage } from '@/utils/storage';
import { AccountStorageService } from '@/services/accountStorageService';
import InputModal from '@/components/modals/InputModal';
import TabNavigation from '@/components/workhub/TabNavigation';
import TimeCategories from '@/components/workhub/TimeCategories';
import TasksSection from '@/components/workhub/TasksSection';
import ProjectTable from '@/components/workhub/ProjectTable';
import AccountSelector from '@/components/workhub/AccountSelector';
import '@/styles/workhub/workhub.css';

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

interface Account {
  id: number;
  name: string;
  position: string;
  color: string;
  isActive: boolean;
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
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Referencias para sincronizar los scrolls
  const topScrollRef = React.useRef<HTMLDivElement>(null);
  const tableScrollRef = React.useRef<HTMLDivElement>(null);

  // Función para sincronizar scrolls
  const syncScrollFromTop = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      const table = tableScrollRef.current.querySelector('table');
      if (table) {
        const scrollLeft = topScrollRef.current.scrollLeft;
        const maxScroll = topScrollRef.current.scrollWidth - topScrollRef.current.clientWidth;

        // Aplicar transformación suave
        table.style.transform = `translateX(-${scrollLeft}px)`;

        // Feedback visual mejorado
        if (scrollLeft > 0) {
          const scrollPercentage = scrollLeft / maxScroll;
          table.style.boxShadow = `5px 0 15px rgba(0, 122, 255, ${0.1 + scrollPercentage * 0.2})`;
        } else {
          table.style.boxShadow = 'none';
        }
      }
    }
  };

  // Función para ajustar el ancho del scroll al ancho real de la tabla
  const adjustScrollWidth = React.useCallback(() => {
    if (topScrollRef.current && tableScrollRef.current) {
      const table = tableScrollRef.current.querySelector('table');
      const scrollContent = topScrollRef.current.querySelector('.table-scroll-content');

      if (table && scrollContent) {
        // Obtener el ancho real necesario para el scroll
        // El scrollWidth es el ancho total del contenido que se puede hacer scroll
        const actualScrollWidth = table.scrollWidth;

        // El ancho del scroll debe ser igual al scrollWidth de la tabla + margen de seguridad
        const scrollWidth = actualScrollWidth + 0; // 50px extra para asegurar que llegue al final


        (scrollContent as HTMLElement).style.minWidth = `${scrollWidth}px`;
        (scrollContent as HTMLElement).style.width = `${scrollWidth}px`;
      }
    }
  }, []);

  // Ajustar el ancho del scroll cuando se cargan los items del proyecto
  React.useEffect(() => {
    if (projectItems.length > 0) {
      // Múltiples intentos para asegurar el ajuste correcto
      setTimeout(adjustScrollWidth, 200);
      setTimeout(adjustScrollWidth, 800);
      setTimeout(adjustScrollWidth, 1500);
    }
  }, [projectItems, adjustScrollWidth]);

  // También ajustar después de que el tab esté activo
  React.useEffect(() => {
    if (activeTab === 'proyecto' && projectItems.length > 0) {
      setTimeout(adjustScrollWidth, 200);
    }
  }, [activeTab, projectItems.length, adjustScrollWidth]);

  // También ajustar cuando cambie el tamaño de la ventana
  React.useEffect(() => {
    const handleResize = () => {
      adjustScrollWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustScrollWidth]);

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

  // Función para cargar los ítems del proyecto desde localStorage filtrados por cuenta
  const loadProjectItems = React.useCallback((accountId?: number) => {
    try {
      if (!accountId) {
        setProjectItems([]);
        return;
      }

      // Usar el servicio de almacenamiento por cuenta
      const selectedItems = AccountStorageService.getAccountData<{ [key: string]: boolean }>(
        AccountStorageService.KEYS.SELECTED_ITEMS,
        accountId
      ) || {};
      
      const formData = AccountStorageService.getAccountData<{ [key: string]: FormDataItem[] }>(
        AccountStorageService.KEYS.FORM_DATA,
        accountId
      );

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
      } else {
        setProjectItems([]);
      }
    } catch (error) {
      console.error('Error loading project items:', error);
      setProjectItems([]);
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
    loadProjectItems(selectedAccount?.id);

    // Configurar un intervalo para verificar periódicamente si hay nuevas tareas
    const intervalId = setInterval(loadTasks, 3000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [user, loadProjectItems, selectedAccount?.id]);

  // Recargar los items del proyecto cuando cambie la cuenta seleccionada
  useEffect(() => {
    if (selectedAccount) {
      loadProjectItems(selectedAccount.id);
    }
  }, [selectedAccount, loadProjectItems]);

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

  // Función para manejar la selección de cuenta
  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account);
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
              <div className="workhub-header-top">
                <div className="workhub-header-title">
                  <h2>Mi WorkHub</h2>
                  <p>Gestiona tus tareas y proyectos</p>
                </div>
                {activeTab === 'proyecto' && (
                  <div className="workhub-header-selector">
                    <AccountSelector
                      selectedAccount={selectedAccount}
                      onAccountSelect={handleAccountSelect}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}
              </div>
            </div>

            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isDarkMode={isDarkMode}
            />

            {activeTab === 'tareas' && (
              <TimeCategories
                selectedCategory={selectedCategory}
                onCategoryClick={handleCategoryClick}
                taskAssignments={taskAssignments}
              />
            )}

            {activeTab === 'tareas' ? (
              <TasksSection filteredTasks={filteredTasks} />
            ) : (
              <div className="proyecto-section">
                <ProjectTable
                  projectItems={projectItems}
                  fieldValues={fieldValues}
                  setFieldValues={setFieldValues}
                  openModal={openModal}
                  getFieldValue={getFieldValue}
                  isDarkMode={isDarkMode}
                  topScrollRef={topScrollRef}
                  tableScrollRef={tableScrollRef}
                  syncScrollFromTop={syncScrollFromTop}
                  storage={storage}
                  selectedAccount={selectedAccount}
                />
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