import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { getTemplateById } from '@/config/templates';
import { useCanvas } from './hooks/useCanvas';
import { useFabricObject } from './hooks/useFabricObject';
import EditorSidebar from './EditorSidebar';
import PropertiesPanel from './PropertiesPanel';
import LayersPanel from './LayersPanel';
import SimpleModal from './modals/SimpleModal';
import '@/styles/reportBuilder/FilminaEditor.css';
import '@/styles/reportBuilder/EditorComponents.css';

const FilminaEditor = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [layers, setLayers] = useState([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showTabalModal, setShowTabalModal] = useState(false);
  const [showDonutModal, setShowDonutModal] = useState(false);
  const [showUsoMediosModal, setShowUsoMediosModal] = useState(false);

  const { canvasRef, initCanvas, getCanvas, disposeCanvas } = useCanvas();
  const canvas = getCanvas();
  const fabricObject = useFabricObject(canvas);

  // Cargar plantilla
  useEffect(() => {
    const loadedTemplate = getTemplateById(templateId);
    if (loadedTemplate) {
      setTemplate(loadedTemplate);
    }
  }, [templateId]);

  // Inicializar canvas
  useEffect(() => {
    if (!canvasRef.current || !template) return;

    const canvas = initCanvas(canvasRef.current);

    // Cargar contenido inicial
    const config = template.canvasConfig;
    fabricObject.addText(config.text, {
      left: config.left,
      top: config.top,
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fill: config.fill,
      fontFamily: config.fontFamily
    });

    // Event listeners
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      disposeCanvas();
    };
  }, [template]);

  // Actualizar capas
  const updateLayers = useCallback(() => {
    const canvas = getCanvas();
    if (canvas) {
      const objects = canvas.getObjects();
      setLayers([...objects]);
    }
  }, [getCanvas]);

  // Manejo de selección
  const handleSelection = useCallback((e) => {
    setSelectedObject(e.selected?.[0] || null);
  }, []);

  const handleSelectionCleared = useCallback(() => {
    setSelectedObject(null);
  }, []);

  // Atajos de teclado
  const handleKeyDown = useCallback((e) => {
    // Duplicar: Ctrl/Cmd + D
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      fabricObject.duplicateObject();
    }

    // Eliminar: Delete o Backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeElement = document.activeElement;
      // Solo eliminar si no estamos en un input/textarea
      if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        fabricObject.deleteObject();
      }
    }
  }, [fabricObject]);

  // Exportar a PDF
  const handleExportPDF = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    setIsExporting(true);

    try {
      // Deseleccionar objetos
      canvas.discardActiveObject();
      canvas.renderAll();

      // Obtener imagen del canvas
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2
      });

      // Crear contenedor temporal
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = 'position:absolute;left:-9999px;width:960px;height:540px';
      document.body.appendChild(tempDiv);

      const img = document.createElement('img');
      img.src = dataURL;
      img.style.width = '100%';
      img.style.height = '100%';
      tempDiv.appendChild(img);

      // Configuración de html2pdf
      const opt = {
        margin: 0,
        filename: `espora-filmina-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: [254, 143], orientation: 'landscape' }
      };

      // Generar PDF
      await html2pdf().set(opt).from(tempDiv).save();

      // Limpiar
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al exportar el PDF. Por favor intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = () => {
    navigate('/espora-report-builder');
  };

  const handleSelectLayer = (layer) => {
    const canvas = getCanvas();
    if (canvas) {
      canvas.setActiveObject(layer);
      canvas.renderAll();
    }
  };

  if (!template) {
    return (
      <div className="editor-error">
        <h2>Plantilla no encontrada</h2>
        <button className="back-button-error" onClick={handleBack}>
          Volver al selector
        </button>
      </div>
    );
  }

  return (
    <div className="filmina-editor-page">
      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <div className="header-divider" />
          <h1 className="editor-title">{template.name}</h1>
        </div>

        <div className="header-right">
          <button
            className="export-button"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <Download size={20} />
            <span>{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Content - 3 columnas */}
      <div className="editor-content">
        {/* Sidebar izquierdo - Herramientas */}
        <EditorSidebar
          onAddText={() => fabricObject.addText()}
          onAddShape={(type) => fabricObject.addShape(type)}
          onAddImage={() => fabricObject.addImage()}
          onAddLine={() => fabricObject.addLine()}
          onOpenTableModal={() => setShowTableModal(true)}
          onOpenTabalModal={() => setShowTabalModal(true)}
          onOpenDonutModal={() => setShowDonutModal(true)}
          onOpenUsoMediosModal={() => setShowUsoMediosModal(true)}
          onSetBackground={(type) => fabricObject.setBackground(type)}
        />

        {/* Canvas central */}
        <main className="editor-canvas-area">
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} />
          </div>

          {/* Panel de Capas */}
          <LayersPanel
            layers={layers}
            selectedLayer={selectedObject}
            onSelectLayer={handleSelectLayer}
          />
        </main>

        {/* Panel derecho - Propiedades */}
        <PropertiesPanel
          selectedObject={selectedObject}
          onUpdateProperty={fabricObject.updateObjectProperty}
          onDuplicate={fabricObject.duplicateObject}
          onDelete={fabricObject.deleteObject}
          onBringToFront={fabricObject.bringToFront}
          onSendToBack={fabricObject.sendToBack}
        />
      </div>

      {/* Modales */}
      <SimpleModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        title="Editor de Tablas"
      >
        <p>Funcionalidad de tabla próximamente...</p>
        <button className="modal-button" onClick={() => setShowTableModal(false)}>
          Cerrar
        </button>
      </SimpleModal>

      <SimpleModal
        isOpen={showTabalModal}
        onClose={() => setShowTabalModal(false)}
        title="Editor Tabal"
      >
        <p>Funcionalidad de tabal próximamente...</p>
        <button className="modal-button" onClick={() => setShowTabalModal(false)}>
          Cerrar
        </button>
      </SimpleModal>

      <SimpleModal
        isOpen={showDonutModal}
        onClose={() => setShowDonutModal(false)}
        title="Gráfico Donut"
      >
        <p>Funcionalidad de gráfico donut próximamente...</p>
        <button className="modal-button" onClick={() => setShowDonutModal(false)}>
          Cerrar
        </button>
      </SimpleModal>

      <SimpleModal
        isOpen={showUsoMediosModal}
        onClose={() => setShowUsoMediosModal(false)}
        title="Uso de Medios"
      >
        <p>Funcionalidad de uso de medios próximamente...</p>
        <button className="modal-button" onClick={() => setShowUsoMediosModal(false)}>
          Cerrar
        </button>
      </SimpleModal>
    </div>
  );
};

export default FilminaEditor;
