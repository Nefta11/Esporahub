
import { FileText, ArrowUp, Briefcase } from 'lucide-react';

interface StorageLike {
  getItem: (key: string) => unknown;
  setItem: (key: string, value: unknown) => void;
}

interface ProjectItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed?: boolean;
}

interface ProjectTableProps {
  projectItems: ProjectItem[];
  fieldValues: { [key: string]: string };
  setFieldValues: (values: { [key: string]: string }) => void;
  openModal: (itemId: string, fieldName: string, fieldType?: 'text' | 'number' | 'select', selectOptions?: { value: string; label: string }[]) => void;
  getFieldValue: (itemId: string, fieldName: string) => string;
  isDarkMode: boolean;
  topScrollRef: React.RefObject<HTMLDivElement>;
  tableScrollRef: React.RefObject<HTMLDivElement>;
  syncScrollFromTop: () => void;
  storage: StorageLike;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectItems,
  fieldValues,
  setFieldValues,
  openModal,
  getFieldValue,
  isDarkMode,
  topScrollRef,
  tableScrollRef,
  syncScrollFromTop,
  storage
}) => {
  return (
    <div className="workhub-table-container">
      <div
        ref={topScrollRef}
        className="table-horizontal-scroll"
        onScroll={syncScrollFromTop}
      >
        <div className="table-scroll-content"></div>
      </div>
      <div
        className="workhub-table-scroll"
        ref={tableScrollRef}
      >
        <table className="workhub-table">
          <thead>
            <tr>
              <th className="workhub-table-header">Actualizaciones</th>
              <th className="workhub-table-header">Nivel de Progreso</th>
              <th className="workhub-table-header">Fase del Proyecto</th>
              <th className="workhub-table-header">Línea Estratégica</th>
              <th className="workhub-table-header">Microcampaña</th>
              <th className="workhub-table-header">Estado Actual</th>
              <th className="workhub-table-header">Gerente de Proyecto</th>
              <th className="workhub-table-header">Equipo de Trabajo</th>
              <th className="workhub-table-header">Nombre del Colaborador</th>
              <th className="workhub-table-header">Perfil Profesional</th>
              <th className="workhub-table-header">Fechas de Entrega</th>
              <th className="workhub-table-header">Semana Actual</th>
              <th className="workhub-table-header">Tipo de Elemento</th>
              <th className="workhub-table-header">Cantidad Total</th>
              <th className="workhub-table-header">Cantidad en Proceso</th>
              <th className="workhub-table-header">Cantidad Aprobada</th>
              <th className="workhub-table-header">Fecha de Finalización</th>
              <th className="workhub-table-header">Repositorio de Contenido</th>
              <th className="workhub-table-header">Repositorio de Firmas</th>
              <th className="workhub-table-header">Enlaces de Repositorio</th>
              <th className="workhub-table-header">Desarrollo creativo</th>
              <th className="workhub-table-header">Fecha testeo</th>
              <th className="workhub-table-header">Estatus testeo</th>
              <th className="workhub-table-header">Entrega al cliente</th>
              <th className="workhub-table-header">Nombre del archivo</th>
            </tr>
          </thead>
          <tbody>
            {projectItems.length > 0 ? (
              projectItems.map((item) => (
                <tr key={item.id} style={{
                  borderBottom: isDarkMode ? '1px solid rgba(84, 84, 88, 0.65)' : '1px solid rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease'
                }}>
                  <td className="workhub-table-cell">
                    <button className="workhub-action-btn workhub-action-btn-primary">
                      <FileText size={16} />
                    </button>
                  </td>
                  <td className="workhub-table-cell">
                    <button className="workhub-action-btn workhub-action-btn-success">
                      <ArrowUp size={16} />
                    </button>
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'fase')}
                      placeholder="Fase"
                      readOnly
                      onClick={() => openModal(item.id, 'Fase')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'linea_estrategica')}
                      placeholder="Línea estratégica"
                      readOnly
                      onClick={() => openModal(item.id, 'Línea estratégica')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'microcampana')}
                      placeholder="Microcampaña"
                      readOnly
                      onClick={() => openModal(item.id, 'Microcampaña')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'estatus')}
                      placeholder="Estatus"
                      readOnly
                      onClick={() => openModal(item.id, 'Estatus')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'gerente')}
                      placeholder="Gerente"
                      readOnly
                      onClick={() => openModal(item.id, 'Gerente')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'colaboradores')}
                      placeholder="Colaboradores"
                      readOnly
                      onClick={() => openModal(item.id, 'Colaboradores')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'nombre_colaborador')}
                      placeholder="Nombre del colaborador"
                      readOnly
                      onClick={() => openModal(item.id, 'Nombre del colaborador')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'perfil_colaborador')}
                      placeholder="Perfil de colaborador"
                      readOnly
                      onClick={() => openModal(item.id, 'Perfil de colaborador')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'solicitud_entrega')}
                      placeholder="Solicitud y entrega"
                      readOnly
                      onClick={() => openModal(item.id, 'Solicitud y entrega')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'semana_curso')}
                      placeholder="Semana en curso"
                      readOnly
                      onClick={() => openModal(item.id, 'Semana en curso')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'tipo_item')}
                      placeholder="Tipo de item"
                      readOnly
                      onClick={() => openModal(item.id, 'Tipo de item')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'cantidad_v')}
                      placeholder="Cantidad V..."
                      readOnly
                      onClick={() => openModal(item.id, 'Cantidad V...', 'number')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'cantidad_pr')}
                      placeholder="Cantidad Pr..."
                      readOnly
                      onClick={() => openModal(item.id, 'Cantidad Pr...', 'number')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'cantidad_a')}
                      placeholder="Cantidad A..."
                      readOnly
                      onClick={() => openModal(item.id, 'Cantidad A...', 'number')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="date"
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
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'repositorio_co')}
                      placeholder="Repositorio de co..."
                      readOnly
                      onClick={() => openModal(item.id, 'Repositorio de co...')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'repositorio_firma')}
                      placeholder="Repositorio firma..."
                      readOnly
                      onClick={() => openModal(item.id, 'Repositorio firma...')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'enlace_repositorio')}
                      placeholder="Enlace de repositorio"
                      readOnly
                      onClick={() => openModal(item.id, 'Enlace de repositorio')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'desarrollo_creativo')}
                      placeholder="Desarrollo creativo"
                      readOnly
                      onClick={() => openModal(item.id, 'Desarrollo creativo')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="date"
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
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'estatus_testeo')}
                      placeholder="Estatus testeo"
                      readOnly
                      onClick={() => openModal(item.id, 'Estatus testeo')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
                      value={getFieldValue(item.id, 'entrega_cliente')}
                      placeholder="Entrega al cliente"
                      readOnly
                      onClick={() => openModal(item.id, 'Entrega al cliente')}
                    />
                  </td>
                  <td className="workhub-table-cell">
                    <input
                      className="workhub-table-input"
                      type="text"
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
  );
};

export default ProjectTable;