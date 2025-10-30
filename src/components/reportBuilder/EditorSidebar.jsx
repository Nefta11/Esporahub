import React from 'react';
import { Type, Square, Image, Minus, Table, PieChart, BarChart3, BarChartHorizontal, Users, Share2, Award, Layers } from 'lucide-react';

const EditorSidebar = ({
  onAddText,
  onAddShape,
  onAddImage,
  onAddLine,
  onOpenTableModal,
  onOpenDonutModal,
  onOpenUsoMediosModal,
  onOpenStackedBarModal,
  onOpenDemographicsModal,
  onOpenSocialMediaUsageModal,
  onOpenBenchmarkSocialMediaModal,
  onOpenBenchmarkSocialMediaDonutMatrixModal,
  onOpenBenchmarkSocialMediaExternasModal,
  onOpenInfluencersModal,
  onOpenDemografiaSociedadRedModal,
  layers,
  selectedLayer,
  onSelectLayer,
  currentFilmina
}) => {

  // Detectar si ya existe un gráfico específico en el canvas
  const hasChartInCanvas = (chartName) => {
    return layers.some(layer => layer.name === chartName);
  };

  const getLayerIcon = (type) => {
    switch(type) {
      case 'i-text':
      case 'text':
        return '📝';
      case 'rect':
        return '▭';
      case 'circle':
        return '⭕';
      case 'line':
        return '➖';
      case 'image':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const getLayerName = (layer, index) => {
    if (layer.type === 'i-text' || layer.type === 'text') {
      return layer.text ? layer.text.substring(0, 15) : `Texto ${index + 1}`;
    }
    return `${layer.type} ${index + 1}`;
  };

  return (
    <aside className="editor-sidebar-left">
      {/* Elementos Básicos */}
      <section className="tools-section">
        <h3 className="section-title">Elementos Básicos</h3>
        <div className="tools-grid">
          <button className="tool-card" onClick={onAddText} title="Agregar Texto">
            <Type size={24} />
            <span>Texto</span>
          </button>

          <button className="tool-card" onClick={onAddShape} title="Agregar Forma">
            <Square size={24} />
            <span>Formas</span>
          </button>

          <button className="tool-card" onClick={onAddImage} title="Agregar Imagen">
            <Image size={24} />
            <span>Imagen</span>
          </button>

          <button className="tool-card" onClick={onAddLine} title="Agregar Línea">
            <Minus size={24} />
            <span>Línea</span>
          </button>
        </div>
      </section>

      {/* Herramientas Avanzadas */}
      <section className="tools-section">
        <h3 className="section-title">Herramientas Avanzadas</h3>
        <div className="tools-grid">
          <button className="tool-card" onClick={onOpenTableModal} title="Editor de Tablas">
            <Table size={24} />
            <span>Tabla</span>
          </button>

          <button className="tool-card" onClick={onOpenDonutModal} title="Gráfico Donut">
            <PieChart size={24} />
            <span>Donut</span>
          </button>

          <button className="tool-card" onClick={onOpenUsoMediosModal} title="Uso de Medios">
            <BarChart3 size={24} />
            <span>Medios</span>
          </button>

          <button className="tool-card" onClick={onOpenStackedBarModal} title="Gráfico Apilado">
            <BarChartHorizontal size={24} />
            <span>Apilado</span>
          </button>

          {/* Mostrar botón de Benchmark RRSSS Mensaje por Contenido en filminas 4 y 5 de Benchmark RRSS */}
          {currentFilmina &&
            (currentFilmina.title === "RRSS Propias: Benchmark's de mensaje por contenido posteado" ||
             currentFilmina.title === 'RRSSS Propias. Benchmark de mensaje por contenido posteado' ||
             currentFilmina.title === "RRSS Externas: Benchmark's de mensaje por contenido diferido" ||
             currentFilmina.title === "RRSS Externas: Benchmark's de mensaje por contenido difundido") && (
              <button className="tool-card" onClick={onOpenBenchmarkSocialMediaDonutMatrixModal} title="Benchmark de mensaje por contenido">
                <Share2 size={24} />
                <span>Benchmark Mensaje</span>
              </button>
          )}
          {/* Mostrar botón de Demografía solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'Demografía General y Digital' && (
            <button className="tool-card" onClick={onOpenDemographicsModal} title={hasChartInCanvas('demographics-table') ? 'Editar Demografía' : 'Agregar Demografía'}>
              <Users size={24} />
              <span>{hasChartInCanvas('demographics-table') ? 'Editar' : 'Demografía'}</span>
            </button>
          )}

          {/* Mostrar botón de Uso RRSS solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'Estudio de Uso de Medios' && (
            <button className="tool-card" onClick={onOpenSocialMediaUsageModal} title={hasChartInCanvas('social-media-usage-table') ? 'Editar Uso RRSS' : 'Agregar Uso RRSS'}>
              <Share2 size={24} />
              <span>{hasChartInCanvas('social-media-usage-table') ? 'Editar' : 'Uso RRSS'}</span>
            </button>
          )}


          {/* Mostrar botón de Benchmark RRSSS Propias solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'RRSS Propias: Benchmark Cuantitativo' && (
            <button className="tool-card" onClick={onOpenBenchmarkSocialMediaModal} title="RRSS Propias: Benchmark Cuantitativo">
              <Share2 size={24} />
              <span>RRSSS Benchmark</span>
            </button>
          )}

          {/* Mostrar botón de Benchmark RRSSS Externas solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'RRSS Externas: Benchmark Cuantitativo' && (
            <button className="tool-card" onClick={onOpenBenchmarkSocialMediaExternasModal} title="RRSS Externas: Benchmark Cuantitativo">
              <Share2 size={24} />
              <span>RRSSS Externas</span>
            </button>
          )}

          {/* Mostrar botón de Influencers solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'Estudio de Influenciadores' && (
            <button className="tool-card" onClick={onOpenInfluencersModal} title="Estudio de Influenciadores">
              <Award size={24} />
              <span>Influencers</span>
            </button>
          )}

          {/* Botón para Estrategia Digital y Estudio de Impacto de Medios */}
          {currentFilmina &&
            (currentFilmina.title === 'Estrategia Digital' || currentFilmina.title === 'Estudio de Impacto de Medios') && (
              <button className="tool-card" onClick={onOpenDemografiaSociedadRedModal} title="Demografía de la Sociedad Red">
                <BarChart3 size={24} />
                <span>Sociedad Red</span>
              </button>
          )}
        </div>
      </section>

      {/* Capas */}
      <section className="tools-section">
        <h3 className="section-title">
          <Layers size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Capas
        </h3>
        <div className="sidebar-layers-list">
          {layers.length === 0 ? (
            <div className="sidebar-layers-empty">
              <p>No hay objetos</p>
            </div>
          ) : (
            layers.map((layer, index) => (
              <button
                key={index}
                className={`sidebar-layer-item ${selectedLayer === layer ? 'selected' : ''}`}
                onClick={() => onSelectLayer(layer)}
              >
                <span className="layer-icon">{getLayerIcon(layer.type)}</span>
                <span className="layer-name">{getLayerName(layer, index)}</span>
              </button>
            ))
          )}
        </div>
      </section>
    </aside>
  );
};

export default EditorSidebar;
