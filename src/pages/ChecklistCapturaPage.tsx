import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import InputModal from '../components/InputModal';
import LogoutDialog from '../components/LogoutDialog';
import '../styles/checklist-captura.css';
import '../styles/input-modal.css';

interface ChecklistItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed: boolean;
}

const ChecklistCapturaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    fieldName: '',
    fieldType: 'text' as 'text' | 'number' | 'select',
    initialValue: '',
    selectOptions: [] as { value: string; label: string }[],
    onSave: (value: string) => {}
  });
  const [fieldValues, setFieldValues] = useState<{[key: string]: string}>({});
  
  // Get theme from body class
  const isDarkMode = document.body.classList.contains('dark-theme');

  // Mapeo de secciones con sus títulos correctos
  const sectionMapping = {
    'estrategia': 'Set Up Estrategia Digital',
    'antropologicos': 'Estudios Antropológicos', 
    'otros-estudios': 'Otros Estudios',
    'acompanamiento': 'Set Up Acompañamiento Digital',
    'gerencia': 'Set Up Gerencia Digital',
    'produccion': 'Set Up Producción',
    'difusion': 'Set up Difusión'
  };

  useEffect(() => {
    const state = location.state as any;
    if (state?.clientName) {
      setClientName(state.clientName);
    }

    // Generate checklist items from selected data
    if (state?.selectedItems && state?.allData) {
      const items: ChecklistItem[] = [];
      const { selectedItems, allData } = state;

      // Process each section type
      Object.entries(allData).forEach(([sectionId, data]: [string, any[]]) => {
        data.forEach((item) => {
          if (selectedItems[item.id]) {
            const sectionName = sectionMapping[sectionId as keyof typeof sectionMapping] || sectionId;

            items.push({
              id: item.id,
              concept: item.concept,
              section: sectionName,
              sectionId: sectionId,
              completed: false
            });
          }
        });
      });

      // Sort items by section order and then by item ID
      const sectionOrder = ['estrategia', 'antropologicos', 'otros-estudios', 'acompanamiento', 'gerencia', 'produccion', 'difusion'];
      items.sort((a, b) => {
        const sectionIndexA = sectionOrder.indexOf(a.sectionId);
        const sectionIndexB = sectionOrder.indexOf(b.sectionId);
        
        if (sectionIndexA !== sectionIndexB) {
          return sectionIndexA - sectionIndexB;
        }
        
        // If same section, sort by item ID
        return a.id.localeCompare(b.id);
      });

      setChecklistItems(items);
    }
  }, [location]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleItemCompletion = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // Group items by section
  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Get sections in the correct order
  const orderedSections = Object.keys(sectionMapping)
    .map(sectionId => sectionMapping[sectionId as keyof typeof sectionMapping])
    .filter(sectionName => groupedItems[sectionName] && groupedItems[sectionName].length > 0);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
      onSave: (value: string) => {
        setFieldValues(prev => ({
          ...prev,
          [fieldKey]: value
        }));
      }
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

  // Opciones para los selects
  const tipoOptions = [
    { value: 'freelance', label: 'FREELANCE' },
    { value: 'interno', label: 'INTERNO' }
  ];

  const cuentasOptions = [
    { value: 'compartido', label: 'COMPARTIDO' },
    { value: 'no_compartido', label: 'NO COMPARTIDO' }
  ];

  const contratacionOptions = [
    { value: 'imss', label: 'IMSS' },
    { value: 'honorarios', label: 'HONORARIOS' },
    { value: 'imss_honorarios', label: 'IMSS+HONORARIOS' }
  ];
  return (
    <div className={`checklist-captura-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="checklist-header">
        <div className="header-left">
          <button 
            onClick={() => navigate('/account', { state: { clientName } })}
            className="back-link"
          >
            <ArrowLeft size={16} />
            <span>Volver a cuenta</span>
          </button>
        </div>
        
        <div className="header-info">
          <h1 className="page-title">Engagement Hands-Off</h1>
          <h2 className="client-name">{clientName}</h2>
        </div>
        
        <div className="header-right">
          <div className="progress-info">
            <span className="progress-text">
              {completedCount} de {totalCount} completados
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <Logo />
        </div>
      </div>

      <button 
        className="logout-button"
        onClick={() => setShowLogoutDialog(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '20px',
          fontSize: '0.875rem',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          ...(isDarkMode ? {
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)'
          } : {
            background: 'rgba(253, 253, 254, 0.95)',
            color: '#0171E2',
            border: '2px solid #0171E2',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          })
        }}
      >
        <LogOut size={16} />
        <span>Cerrar sesión</span>
      </button>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => navigate('/')}
      />

      <div className={`checklist-content ${isVisible ? 'visible' : ''}`}>
        <div className="checklist-table-container">
          <table className="checklist-table">
            <thead>
              <tr>
                <th>✓</th>
                <th>Item</th>
                <th>Perfil</th>
                <th>Tipo</th>
                <th>Kpi</th>
                <th>Meta</th>
                <th>Frecuencia</th>
                <th>Duración</th>
                <th>Sueldo/Costo</th>
                <th>Otros Items</th>
                <th>Otras Cuentas</th>
                <th>Tipo de Contratación</th>
                <th>Días de Pago</th>
                <th>Contrato a Firmar</th>
                <th>Propuesta</th>
                <th>Escritorio, Silla Etc</th>
                <th>Viajes/Hospedajes Descriptivo</th>
                <th>Viajes/Hospedajes Monto</th>
                <th>Equipo de Cómputo</th>
                <th>Recursos Tecnológicos y Materiales Adicionales Descriptivo</th>
                <th>Recursos Tecnológicos y Materiales Adicionales Monto</th>
                <th>Empresa Descriptivo</th>
                <th>Empresa Monto</th>
                <th>Pauta Descriptivo</th>
                <th>Pauta Monto</th>
                <th>Otros Gastos Descriptivos</th>
                <th>Otros Gastos Monto</th>
              </tr>
            </thead>
            <tbody>
              {orderedSections.map((sectionName) => {
                const items = groupedItems[sectionName];
                return (
                <React.Fragment key={sectionName}>
                  <tr className="section-header">
                    <td colSpan={26} className="section-title">
                      {sectionName}
                    </td>
                  </tr>
                  {items.map((item) => (
                    <tr key={item.id} className={item.completed ? 'completed' : ''}>
                      <td className="checkbox-cell">
                        <button
                          className="checkbox-button"
                          onClick={() => toggleItemCompletion(item.id)}
                        >
                          {item.completed ? (
                            <CheckCircle2 size={18} className="check-icon completed" />
                          ) : (
                            <Circle size={18} className="check-icon" />
                          )}
                        </button>
                      </td>
                      <td className="checklist-item-id">{item.id}</td>
                      <td className="task-cell">{item.concept}</td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'tipo')}
                          placeholder="Tipo"
                          readOnly
                          onClick={() => openModal(item.id, 'Tipo', 'select', tipoOptions)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'kpi')}
                          placeholder="KPI" 
                          readOnly
                          onClick={() => openModal(item.id, 'KPI')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'meta')}
                          placeholder="Meta" 
                          readOnly
                          onClick={() => openModal(item.id, 'Meta')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'frecuencia')}
                          placeholder="Frecuencia" 
                          readOnly
                          onClick={() => openModal(item.id, 'Frecuencia')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'duracion')}
                          placeholder="Duración" 
                          readOnly
                          onClick={() => openModal(item.id, 'Duración')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'sueldo')}
                          placeholder="Sueldo/Costo" 
                          readOnly
                          onClick={() => openModal(item.id, 'Sueldo/Costo', 'number')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'otros_items')}
                          placeholder="Otros items" 
                          readOnly
                          onClick={() => openModal(item.id, 'Otros Items')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'otras_cuentas')}
                          placeholder="Otras Cuentas"
                          readOnly
                          onClick={() => openModal(item.id, 'Otras Cuentas', 'select', cuentasOptions)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'tipo_contratacion')}
                          placeholder="Tipo de Contratación"
                          readOnly
                          onClick={() => openModal(item.id, 'Tipo de Contratación', 'select', contratacionOptions)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'dias_pago')}
                          placeholder="Días de pago" 
                          readOnly
                          onClick={() => openModal(item.id, 'Días de Pago')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'contrato')}
                          placeholder="Contrato" 
                          readOnly
                          onClick={() => openModal(item.id, 'Contrato a Firmar')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'propuesta')}
                          placeholder="Propuesta" 
                          readOnly
                          onClick={() => openModal(item.id, 'Propuesta')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'escritorio')}
                          placeholder="Escritorio, silla, etc." 
                          readOnly
                          onClick={() => openModal(item.id, 'Escritorio, Silla Etc')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'viajes_desc')}
                          placeholder="Viajes/Hospedajes desc." 
                          readOnly
                          onClick={() => openModal(item.id, 'Viajes/Hospedajes Descriptivo')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'viajes_monto')}
                          placeholder="Monto viajes" 
                          readOnly
                          onClick={() => openModal(item.id, 'Viajes/Hospedajes Monto', 'number')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'equipo_computo')}
                          placeholder="Equipo de cómputo" 
                          readOnly
                          onClick={() => openModal(item.id, 'Equipo de Cómputo')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'recursos_desc')}
                          placeholder="Recursos tecnológicos desc." 
                          readOnly
                          onClick={() => openModal(item.id, 'Recursos Tecnológicos y Materiales Adicionales Descriptivo')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'recursos_monto')}
                          placeholder="Monto recursos" 
                          readOnly
                          onClick={() => openModal(item.id, 'Recursos Tecnológicos y Materiales Adicionales Monto', 'number')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'empresa_desc')}
                          placeholder="Empresa desc." 
                          readOnly
                          onClick={() => openModal(item.id, 'Empresa Descriptivo')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'empresa_monto')}
                          placeholder="Monto empresa" 
                          readOnly
                          onClick={() => openModal(item.id, 'Empresa Monto', 'number')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'pauta_desc')}
                          placeholder="Pauta desc." 
                          readOnly
                          onClick={() => openModal(item.id, 'Pauta Descriptivo')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'pauta_monto')}
                          placeholder="Monto pauta" 
                          readOnly
                          onClick={() => openModal(item.id, 'Pauta Monto', 'number')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'otros_gastos_desc')}
                          placeholder="Otros gastos desc." 
                          readOnly
                          onClick={() => openModal(item.id, 'Otros Gastos Descriptivos')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="table-input" 
                          value={getFieldValue(item.id, 'otros_gastos_monto')}
                          placeholder="Monto otros" 
                          readOnly
                          onClick={() => openModal(item.id, 'Otros Gastos Monto', 'number')}
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>

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

export default ChecklistCapturaPage;