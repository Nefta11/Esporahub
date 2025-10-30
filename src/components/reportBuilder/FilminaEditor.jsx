import BenchmarkAdjetivacionTableroModal from './modals/BenchmarkAdjetivacionTableroModal';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Image as FabricImage } from 'fabric';
import { getTemplateById, getFilminaById } from '@/config/templates';
import { useCanvas } from './hooks/useCanvas';
import { useFabricObject } from './hooks/useFabricObject';
import {
  autoInsertDemographicsTable,
  autoInsertSocialMediaUsageTable,
  autoInsertInfluencersTable,
  autoInsertBenchmarkMatrix
} from './utils/autoInsertHelpers';
import {
  autoInsertBenchmarkSocialMedia,
  autoInsertBenchmarkSocialMediaExternas,
  autoInsertDemografiaSociedadRed
} from './utils/benchmarkHelpers';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import EditorSidebar from './EditorSidebar';
import PropertiesPanel from './PropertiesPanel';
import TableEditorModal from './modals/TableEditorModal';
import DonutChartModal from './modals/DonutChartModal';
import UsoMediosModal from './modals/UsoMediosModal';
import StackedBarChartModal from './modals/StackedBarChartModal';
import DemographicsTableModal from './modals/DemographicsTableModal';
import DemografiaSociedadRedModal from './modals/DemografiaSociedadRedModal';
import SocialMediaUsageModal from './modals/SocialMediaUsageModal';
import InfluencersTableModal from './modals/InfluencersTableModal';
import BenchmarkSocialMediaModal from './modals/BenchmarkSocialMediaModal';
import BenchmarkSocialMediaExternasModal from './modals/BenchmarkSocialMediaExternasModal';
import BenchmarkSocialMediaDonutMatrixModal from './modals/BenchmarkSocialMediaDonutMatrixModal';
import ShapePickerModal from './modals/ShapePickerModal';
import '@/styles/reportBuilder/FilminaEditor.css';
import '@/styles/reportBuilder/EditorComponents.css';

const FilminaEditor = () => {
  const navigate = useNavigate();
  const { templateId, filminaId } = useParams();
  const [template, setTemplate] = useState(null);
  const [filmina, setFilmina] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [layers, setLayers] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );

  const { canvasRef, initCanvas, getCanvas, disposeCanvas } = useCanvas();
  const canvas = getCanvas();
  const fabricObject = useFabricObject(canvas);

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

  // Cargar plantilla y filmina
  useEffect(() => {
    const loadedTemplate = getTemplateById(templateId);
    if (loadedTemplate) {
      setTemplate(loadedTemplate);
    }

    const loadedFilmina = getFilminaById(templateId, filminaId);
    if (loadedFilmina) {
      setFilmina(loadedFilmina);
    }
  }, [templateId, filminaId]);

  // Inicializar canvas
  useEffect(() => {
    if (!canvasRef.current || !template || !filmina) return;

    initCanvas(canvasRef.current);
    const canvas = getCanvas();

    // Cargar imagen de fondo
    if (filmina.background && canvas) {
      const backgroundImagePath = `/img/${filmina.background}`;

      const imgElement = document.createElement('img');
      imgElement.crossOrigin = 'anonymous';

      imgElement.onload = () => {
        try {
          const fabricImg = new FabricImage(imgElement, {
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hoverCursor: 'default'
          });

          // Escalar imagen para que cubra todo el canvas (960x540)
          const scaleX = 960 / fabricImg.width;
          const scaleY = 540 / fabricImg.height;

          fabricImg.scaleX = scaleX;
          fabricImg.scaleY = scaleY;

          canvas.add(fabricImg);
          canvas.sendToBack(fabricImg);
          canvas.renderAll();
        } catch (error) {
          console.error('Error loading background image:', error);
        }
      };

      imgElement.onerror = (error) => {
        console.error('Error loading background image:', error);
      };

      imgElement.src = backgroundImagePath;
    }

    // Cargar contenido inicial después de un pequeño delay para asegurar que el fondo se cargue primero
    setTimeout(() => {
      const config = template.canvasConfig;
      fabricObject.addText(filmina.title, {
        left: config.left,
        top: config.top,
        fontSize: config.fontSize,
        fontWeight: config.fontWeight,
        fill: config.fill,
        fontFamily: config.fontFamily
      });
    }, 100);

    // Auto-insertar gráfico según la filmina (después de cargar título)
    setTimeout(() => {
      autoInsertDefaultChart();
    }, 500);

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
  }, [template, filmina]);

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

  // Auto-insertar gráfico por defecto según la filmina
  const autoInsertDefaultChart = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas || !filmina) return;

    // Verificar si ya hay objetos insertados (excepto background y título)
    const objects = canvas.getObjects();
    const hasCustomObjects = objects.some(obj =>
      obj.type !== 'image' && obj.text !== filmina.title
    );

    // Si ya hay objetos personalizados, no insertar automáticamente
    if (hasCustomObjects) return;

    // Insertar según el título de la filmina
    const filminaTitle = filmina.title;

    // Auto-insertar según el título de la filmina
    if (filminaTitle === 'Demografía General y Digital') {
      autoInsertDemographicsTable(canvas);
    } else if (filminaTitle === 'Estudio de Uso de Medios') {
      autoInsertSocialMediaUsageTable(canvas);
    } else if (filminaTitle === 'Estudio de Influenciadores') {
      autoInsertInfluencersTable(canvas);
    } else if (filminaTitle === 'Estudio de Impacto de Medios') {
      autoInsertDemografiaSociedadRed(canvas);
    } else if (filminaTitle === 'RRSS Propias: Benchmark Cuantitativo') {
      autoInsertBenchmarkSocialMedia(canvas);
    } else if (filminaTitle === 'RRSS Externas: Benchmark Cuantitativo') {
      autoInsertBenchmarkSocialMediaExternas(canvas);
    } else if (filminaTitle === "RRSS Propias: Benchmark's de mensaje por contenido posteado") {
      autoInsertBenchmarkMatrix(canvas);
    } else if (filminaTitle === "RRSS Externas: Benchmark's de mensaje por contenido difundido") {
      autoInsertBenchmarkMatrix(canvas);
    } else if (filminaTitle === "RRSSS Propias. Benchmark de mensaje por contenido difundi") {
      autoInsertBenchmarkMatrix(canvas);
    } else if (filminaTitle === "RRSSS Externas. Benchmark de mensaje por contenido difundido") {
      autoInsertBenchmarkMatrix(canvas);
    }
  }, [filmina, getCanvas]);

  // Exportar a PDF
  const handleExportPDF = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    setIsExporting(true);

    try {
      // Deseleccionar objetos
      canvas.discardActiveObject();
      canvas.renderAll();

      // Obtener imagen del canvas en alta calidad
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2
      });

      // Dimensiones del canvas: 960x540 px
      // Convertir a mm para PDF (usando escala 1px = 0.264583mm)
      const widthMM = 254; // 960px * 0.264583 ≈ 254mm (10 inches)
      const heightMM = 143; // 540px * 0.264583 ≈ 143mm (5.6 inches)

      // Crear PDF con jsPDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [widthMM, heightMM]
      });

      // Agregar la imagen al PDF (ocupa toda la página)
      pdf.addImage(dataURL, 'PNG', 0, 0, widthMM, heightMM);

      // Guardar el PDF
      pdf.save(`espora-filmina-${Date.now()}.pdf`);
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

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  const handleSelectLayer = (layer) => {
    const canvas = getCanvas();
    if (canvas) {
      canvas.setActiveObject(layer);
      canvas.renderAll();
    }
  };

  if (!template || !filmina) {
    return (
      <div className="editor-error">
        <h2>Plantilla o filmina no encontrada</h2>
        <button className="back-button-error" onClick={handleBack}>
          Volver al selector
        </button>
      </div>
    );
  }

  return (
    <div className={`filmina-editor-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title={filmina.title}
        subtitle="Editor de filminas"
        backButtonText="Plantillas"
        backButtonPath="/espora-report-builder"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Export Button Bar */}
      <div className="editor-toolbar">
        <button
          className="export-button"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <Download size={20} />
          <span>{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
        </button>
      </div>

      {/* Main Content - 3 columnas */}
      <div className="editor-content">
        {/* Sidebar izquierdo - Herramientas */}

        <EditorSidebar
          onOpenBenchmarkAdjetivacionTableroModal={() => setActiveModal('benchmarkAdjetivacionTablero')}
          onAddText={() => fabricObject.addText()}
          onAddShape={() => setActiveModal('shape')}
          onAddImage={() => fabricObject.addImage()}
          onAddLine={() => setActiveModal('line')}
          onOpenTableModal={() => setActiveModal('table')}
          onOpenDonutModal={() => setActiveModal('donut')}
          onOpenUsoMediosModal={() => setActiveModal('usoMedios')}
          onOpenStackedBarModal={() => setActiveModal('stackedBar')}
          onOpenDemographicsModal={() => setActiveModal('demographics')}
          onOpenSocialMediaUsageModal={() => setActiveModal('socialMediaUsage')}
          onOpenBenchmarkSocialMediaModal={() => setActiveModal('benchmarkSocialMedia')}
          onOpenBenchmarkSocialMediaExternasModal={() => setActiveModal('benchmarkSocialMediaExternas')}
          onOpenBenchmarkSocialMediaDonutMatrixModal={() => setActiveModal('benchmarkSocialMediaDonutMatrix')}
          onOpenInfluencersModal={() => setActiveModal('influencers')}
          layers={layers}
          selectedLayer={selectedObject}
          onSelectLayer={handleSelectLayer}
          currentFilmina={filmina}
          onOpenDemografiaSociedadRedModal={() => setActiveModal('demografiaSociedadRed')}
        />

        {/* Modal Tablero Adjetivación */}
        {activeModal === 'benchmarkAdjetivacionTablero' && (
          <BenchmarkAdjetivacionTableroModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            canvas={canvas}
          />
        )}
        <DemografiaSociedadRedModal
          isOpen={activeModal === 'demografiaSociedadRed'}
          onClose={() => setActiveModal(null)}
          canvas={canvas}
        />


        {/* Modales Avanzados */}
        <BenchmarkSocialMediaDonutMatrixModal
          isOpen={activeModal === 'benchmarkSocialMediaDonutMatrix'}
          onClose={() => setActiveModal(null)}
          canvas={canvas}
          title={
            filmina?.title === "RRSS Propias: Benchmark's de mensaje por contenido posteado" ||
              filmina?.title === "RRSSS Propias. Benchmark de mensaje por contenido posteado"
              ? "RRSS Propias: Benchmark de mensaje por contenido posteado"
              : filmina?.title === "RRSS Externas: Benchmark's de mensaje por contenido diferido" ||
                filmina?.title === "RRSS Externas: Benchmark's de mensaje por contenido difundido"
                ? "RRSS Externas: Benchmark de mensaje por contenido difundido"
                : "RRSS Propias: Benchmark de mensaje por contenido posteado"
          }
        />
        <BenchmarkSocialMediaModal
          isOpen={activeModal === 'benchmarkSocialMedia'}
          onClose={() => setActiveModal(null)}
          canvas={canvas}
        />
        <BenchmarkSocialMediaExternasModal
          isOpen={activeModal === 'benchmarkSocialMediaExternas'}
          onClose={() => setActiveModal(null)}
          canvas={canvas}
        />

        {/* Canvas central */}
        <main className="editor-canvas-area">
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} />
          </div>
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

      {/* Modales Avanzados */}
      <TableEditorModal
        isOpen={activeModal === 'table'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <DonutChartModal
        isOpen={activeModal === 'donut'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <UsoMediosModal
        isOpen={activeModal === 'usoMedios'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <StackedBarChartModal
        isOpen={activeModal === 'stackedBar'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <DemographicsTableModal
        isOpen={activeModal === 'demographics'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <SocialMediaUsageModal
        isOpen={activeModal === 'socialMediaUsage'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <InfluencersTableModal
        isOpen={activeModal === 'influencers'}
        onClose={() => setActiveModal(null)}
        canvas={canvas}
      />

      <ShapePickerModal
        isOpen={activeModal === 'shape'}
        onClose={() => setActiveModal(null)}
        onSelectShape={(type, options) => fabricObject.addShape(type, options)}
      />

      <PageFooter
        showLogoutDialog={showLogoutDialog}
        onLogoutClick={() => setShowLogoutDialog(true)}
        onLogoutDialogClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};

export default FilminaEditor;
