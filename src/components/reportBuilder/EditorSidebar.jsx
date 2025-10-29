import React from 'react';
import { Type, Square, Image, Minus, Table, PieChart, BarChart3, Layers } from 'lucide-react';

const EditorSidebar = ({
  onAddText,
  onAddShape,
  onAddImage,
  onAddLine,
  onOpenTableModal,
  onOpenDonutModal,
  onOpenUsoMediosModal,
  layers,
  selectedLayer,
  onSelectLayer
}) => {

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
