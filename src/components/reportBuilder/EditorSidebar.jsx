import React from 'react';
import { Type, Square, Image, Minus, Table, PieChart, BarChart3, BarChartHorizontal, Users, Share2, Award, Layers, CheckSquare, Radio, Activity, Smile } from 'lucide-react';

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
  onOpenBenchmarkAdjetivacionTableroModal,
  onOpenBenchmarkAudienciaTableroModal,
  onOpenBenchmarkIntegradoTableroModal,
  onOpenBenchmarkDifusionOficialModal,
  onOpenAwarenessModal,
  onOpenTopOfMindModal,
  onOpenTopOfHeartModal,
  onOpenTopOfChoiceModal,
  onOpenTopOfVoiceModal,
  onOpenAmplificadoresModal,
  onOpenActivacionPorTemaModal,
  onOpenHumorSocialModal,
  onOpenHumorHistogramModal,
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
    switch (type) {
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
          {/* Herramienta de Tablero de Adjetivación para filminas específicas */}
          {currentFilmina &&
            (
              currentFilmina.title === 'RRSSS Propias. Benchmark adjetivación p/contenido posteado' ||
              currentFilmina.title === 'RRSSS Externas. Benchmark adjetivación p/contenido posteado' ||
              currentFilmina.title === 'RRSSS Propias. Benchmark adjetivación p/contenido difundido' ||
              currentFilmina.title === 'RRSSS Externas. Benchmark adjetivación p/contenido difundido'
            ) && typeof onOpenBenchmarkAdjetivacionTableroModal === 'function' && (
              <button className="tool-card" onClick={onOpenBenchmarkAdjetivacionTableroModal} title="Tablero de Análisis de Contenido y Mensaje">
                <PieChart size={24} />
                <span>Tablero Adjetivación</span>
              </button>
            )}

          {/* Herramienta de Tablero de Audiencia para filminas específicas */}
          {currentFilmina &&
            (
              currentFilmina.title === 'RRSSS Propias. Benchmark audiencia p/contenido posteado' ||
              currentFilmina.title === 'RRSSS Externas. Benchmark audiencia p/contenido posteado' ||
              currentFilmina.title === 'RRSSS Propias. Benchmark audiencia p/contenido difundido' ||
              currentFilmina.title === 'RRSSS Externas. Benchmark audiencia p/contenido difundido'
            ) && typeof onOpenBenchmarkAudienciaTableroModal === 'function' && (
              <button className="tool-card" onClick={onOpenBenchmarkAudienciaTableroModal} title="Tablero de Análisis de Audiencia">
                <Users size={24} />
                <span>Tablero Audiencia</span>
              </button>
            )}

          {/* Herramienta de Benchmark Integrado para la filmina específica */}
          {currentFilmina &&
            currentFilmina.title === 'Benchmark de mensaje integrado' &&
            typeof onOpenBenchmarkIntegradoTableroModal === 'function' && (
              <button className="tool-card" onClick={onOpenBenchmarkIntegradoTableroModal} title="Benchmark de mensaje integrado">
                <Share2 size={24} />
                <span>Benchmark Integrado</span>
              </button>
            )}

          {/* Herramienta de Benchmark Difusión Oficial para la filmina específica */}
          {currentFilmina &&
            (currentFilmina.title === 'RRRSS Propias. Benchmark de difusión oficial' ||
              currentFilmina.title === 'RRRSS Propias. Benchmark de difusión alterna') &&
            typeof onOpenBenchmarkDifusionOficialModal === 'function' && (
              <button className="tool-card" onClick={onOpenBenchmarkDifusionOficialModal} title="Benchmark de difusión oficial/alterna">
                <Share2 size={24} />
                <span>Benchmark Difusión</span>
              </button>
            )}

          {/* Herramienta de Awareness Chart para la filmina Análisis de la conversación -- Awareness */}
          {currentFilmina &&
            currentFilmina.title === 'Análisis de la conversación -- Awareness' &&
            typeof onOpenAwarenessModal === 'function' && (
              <button className="tool-card" onClick={onOpenAwarenessModal} title="Gráfica de Awareness">
                <BarChartHorizontal size={24} />
                <span>Awareness</span>
              </button>
            )}

          {/* Herramienta de Top of Mind Chart para la filmina Análisis de la conversación -- Top of mind */}
          {currentFilmina &&
            currentFilmina.title === 'Análisis de la conversación -- Top of mind' &&
            typeof onOpenTopOfMindModal === 'function' && (
              <button className="tool-card" onClick={onOpenTopOfMindModal} title="Gráfica de Top of Mind">
                <BarChart3 size={24} />
                <span>Top of Mind</span>
              </button>
            )}

          {/* Herramienta de Top of Heart Chart para la filmina Análisis de la conversación -- Top of heart */}
          {currentFilmina &&
            currentFilmina.title === 'Análisis de la conversación -- Top of heart' &&
            typeof onOpenTopOfHeartModal === 'function' && (
              <button className="tool-card" onClick={onOpenTopOfHeartModal} title="Gráfica de Top of Heart">
                <Award size={24} />
                <span>Top of Heart</span>
              </button>
            )}

          {/* Herramienta de Top of Choice Chart para la filmina Análisis de la conversación -- Top of choice */}
          {currentFilmina &&
            currentFilmina.title === 'Análisis de la conversación -- Top of choice' &&
            typeof onOpenTopOfChoiceModal === 'function' && (
              <button className="tool-card" onClick={onOpenTopOfChoiceModal} title="Gráfica de Top of Choice">
                <CheckSquare size={24} />
                <span>Top of Choice</span>
              </button>
            )}

          {/* Herramienta de Top of Voice Chart para la filmina Análisis de la conversación -- Top of voice */}
          {currentFilmina &&
            currentFilmina.title === 'Análisis de la conversación -- Top of voice' &&
            typeof onOpenTopOfVoiceModal === 'function' && (
              <button className="tool-card" onClick={onOpenTopOfVoiceModal} title="Gráfica de Top of Voice">
                <Radio size={24} />
                <span>Top of Voice</span>
              </button>
            )}

          {/* Herramienta de Amplificadores Chart para la filmina Amplificadores de la conversación */}
          {currentFilmina &&
            currentFilmina.title === 'Amplificadores de la conversación' &&
            typeof onOpenAmplificadoresModal === 'function' && (
              <button className="tool-card" onClick={onOpenAmplificadoresModal} title="Tabla de Amplificadores">
                <Users size={24} />
                <span>Amplificadores</span>
              </button>
            )}

          {/* Herramienta de Activación por Tema Chart para la filmina Estudio de activación por tema */}
          {currentFilmina &&
            currentFilmina.title === 'Estudio de activación por tema' &&
            typeof onOpenActivacionPorTemaModal === 'function' && (
              <button className="tool-card" onClick={onOpenActivacionPorTemaModal} title="Gráfica de Activación">
                <Activity size={24} />
                <span>Activación</span>
              </button>
            )}

          {/* Herramienta de Humor Social para la filmina Análisis de humor social */}
          {currentFilmina &&
            currentFilmina.title === 'Análisis de humor social' &&
            typeof onOpenHumorSocialModal === 'function' && (
              <button className="tool-card" onClick={onOpenHumorSocialModal} title="Coordenadas de Humor Social">
                <Smile size={24} />
                <span>Humor Social</span>
              </button>
            )}

          {/* Herramienta del Histograma del Humor Social (filmina específica) */}
          {currentFilmina &&
            currentFilmina.title === 'Histograma del Humor Social' &&
            typeof onOpenHumorHistogramModal === 'function' && (
              <button className="tool-card" onClick={onOpenHumorHistogramModal} title="Histograma del Humor Social">
                <BarChart3 size={24} />
                <span>Histograma Humor</span>
              </button>
            )}

          {/* Mostrar botón de Benchmark RRSSS Mensaje por Contenido en filminas 4, 5, 6 y 7 de Benchmark RRSS */}
          {currentFilmina &&
            (currentFilmina.title === "RRSS Propias: Benchmark's de mensaje por contenido posteado" ||
              currentFilmina.title === 'RRSSS Propias. Benchmark de mensaje por contenido posteado' ||
              currentFilmina.title === "RRSS Externas: Benchmark's de mensaje por contenido diferido" ||
              currentFilmina.title === "RRSS Externas: Benchmark's de mensaje por contenido difundido" ||
              currentFilmina.title === "RRSSS Propias. Benchmark de mensaje por contenido difundi" ||
              currentFilmina.title === "RRSSS Externas. Benchmark de mensaje por contenido difundido") && (
              <button className="tool-card" onClick={onOpenBenchmarkSocialMediaDonutMatrixModal} title={hasChartInCanvas('benchmark-matrix') ? 'Editar Benchmark' : 'Agregar Benchmark'}>
                <Share2 size={24} />
                <span>{hasChartInCanvas('benchmark-matrix') ? 'Editar' : 'Benchmark'}</span>
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
            <button className="tool-card" onClick={onOpenBenchmarkSocialMediaModal} title={hasChartInCanvas('benchmark-social-media') ? 'Editar Benchmark Propias' : 'Agregar Benchmark Propias'}>
              <Share2 size={24} />
              <span>{hasChartInCanvas('benchmark-social-media') ? 'Editar' : 'Benchmark'}</span>
            </button>
          )}

          {/* Mostrar botón de Benchmark RRSSS Externas solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'RRSS Externas: Benchmark Cuantitativo' && (
            <button className="tool-card" onClick={onOpenBenchmarkSocialMediaExternasModal} title={hasChartInCanvas('benchmark-social-media-externas') ? 'Editar Benchmark Externas' : 'Agregar Benchmark Externas'}>
              <Share2 size={24} />
              <span>{hasChartInCanvas('benchmark-social-media-externas') ? 'Editar' : 'Benchmark'}</span>
            </button>
          )}

          {/* Mostrar botón de Influencers solo en la filmina específica */}
          {currentFilmina && currentFilmina.title === 'Estudio de Influenciadores' && (
            <button className="tool-card" onClick={onOpenInfluencersModal} title={hasChartInCanvas('influencers-table') ? 'Editar Influencers' : 'Agregar Influencers'}>
              <Award size={24} />
              <span>{hasChartInCanvas('influencers-table') ? 'Editar' : 'Influencers'}</span>
            </button>
          )}

          {/* Botón para Estrategia Digital y Estudio de Impacto de Medios */}
          {currentFilmina &&
            (currentFilmina.title === 'Estrategia Digital' || currentFilmina.title === 'Estudio de Impacto de Medios') && (
              <button className="tool-card" onClick={onOpenDemografiaSociedadRedModal} title={hasChartInCanvas('demografia-sociedad-red') ? 'Editar Sociedad Red' : 'Agregar Sociedad Red'}>
                <BarChart3 size={24} />
                <span>{hasChartInCanvas('demografia-sociedad-red') ? 'Editar' : 'Sociedad Red'}</span>
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
