import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Upload, FileText, Download, Trash2, Eye, Plus, Edit2 } from 'lucide-react';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import FileNameEditModal from '../components/FileNameEditModal';
import MenuBackground from '../components/MenuBackground';
import '../styles/expediente-electronico.css';
import '../styles/file-name-modal.css';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string;
}

const ExpedienteElectronicoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  
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
  
  useEffect(() => {
    // Get client name from location state if available
    const state = location.state as { clientName?: string };
    if (state?.clientName) {
      setClientName(state.clientName);
    }
  }, [location]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      handleFiles(Array.from(selectedFiles));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: FileItem[] = fileList.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      url: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => {
      const fileToDelete = prev.find(f => f.id === fileId);
      if (fileToDelete?.url) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleDownloadFile = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewFile = (file: FileItem) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const handleEditFileName = (file: FileItem) => {
    setEditingFile(file);
    setIsEditModalOpen(true);
  };

  const handleSaveFileName = (newName: string) => {
    if (editingFile && newName.trim()) {
      setFiles(prev => prev.map(file => 
        file.id === editingFile.id 
          ? { ...file, name: newName.trim() }
          : file
      ));
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('text') || fileType.includes('document')) return '📝';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📈';
    return '📁';
  };

  return (
    <div className={`expediente-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      <div className="expediente-header">
        <div className="expediente-breadcrumb-container">
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="expediente-breadcrumb-link"
          >
            Menú
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview-main')}
            className="expediente-breadcrumb-link"
          >
            Overview de cuentas
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="expediente-breadcrumb-link"
          >
            Configuración de cuentas
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/select-account')}
            className="expediente-breadcrumb-link"
          >
            Seleccionar cuenta
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/client-dashboard', { state: { clientName } })}
            className="expediente-breadcrumb-link"
          >
            {clientName ? clientName.split(' - ')[0] : 'Cliente'}
          </button>
        </div>
        
        <h1 className="expediente-title">
          Expediente electrónico: {clientName ? clientName.split(' - ')[0] : 'Cliente'}
        </h1>
        
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`expediente-content ${isVisible ? 'visible' : ''}`}>
        <div className="content-layout">
          {/* Área de archivos (3/4 del espacio) - Lado izquierdo */}
          <div className="files-main-area">
            {/* Files Grid */}
            {files.length > 0 && (
              <div className="files-section">
                <div className="files-header">
                  <h2>Archivos del expediente ({files.length})</h2>
                </div>
                <div className="files-grid">
                  {files.map((file) => (
                    <div key={file.id} className="file-button-wrapper">
                      <button
                        className="file-button"
                        onClick={() => handleViewFile(file)}
                      >
                        <div className="file-button-icon">
                          <span className="file-emoji">{getFileIcon(file.type)}</span>
                        </div>
                      </button>
                      <div className="file-button-info">
                        <span className="file-button-name" title={file.name}>
                          {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                        </span>
                        <div className="file-button-meta">
                          <span className="file-size">{formatFileSize(file.size)}</span>
                          <span className="file-date">
                            {file.uploadDate.toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="file-button-actions">
                          <button
                            className="file-action-btn edit-btn"
                            onClick={() => handleEditFileName(file)}
                            title="Editar nombre"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="file-action-btn download-btn"
                            onClick={() => handleDownloadFile(file)}
                            title="Descargar"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="file-action-btn delete-btn"
                            onClick={() => handleDeleteFile(file.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {files.length === 0 && (
              <div className="empty-state">
                <FileText size={64} className="empty-icon" />
                <h3>No hay archivos</h3>
                <p>Comienza agregando documentos importantes para este cliente</p>
              </div>
            )}
          </div>

          {/* Área de carga (1/4 del espacio) - Lado derecho */}
          <div className="file-upload-section">
            {/* Upload Area */}
            <div 
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <Upload size={32} />
              </div>
              <h3>Agregar archivos</h3>
              <p>Arrastra archivos aquí o haz clic</p>
              <div className="upload-formats">
                <span>PDF, DOC, IMG, etc.</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.txt"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>
          </div>
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

      <FileNameEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveFileName}
        currentName={editingFile?.name || ''}
        fileExtension={editingFile?.name.match(/\.[^/.]+$/)?.[0] || ''}
      />
    </div>
  );
};

export default ExpedienteElectronicoPage;