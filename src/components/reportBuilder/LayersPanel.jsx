import React from 'react';
import { Layers } from 'lucide-react';

const LayersPanel = ({ layers, selectedLayer, onSelectLayer }) => {

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
      return layer.text ? layer.text.substring(0, 20) : `Texto ${index + 1}`;
    }
    return `${layer.type} ${index + 1}`;
  };

  return (
    <div className="layers-panel">
      <div className="layers-header">
        <Layers size={18} />
        <h4>Capas</h4>
      </div>

      <div className="layers-list">
        {layers.length === 0 ? (
          <div className="layers-empty">
            <p>No hay objetos en el canvas</p>
          </div>
        ) : (
          layers.map((layer, index) => (
            <button
              key={index}
              className={`layer-item ${selectedLayer === layer ? 'selected' : ''}`}
              onClick={() => onSelectLayer(layer)}
            >
              <span className="layer-icon">{getLayerIcon(layer.type)}</span>
              <span className="layer-name">{getLayerName(layer, index)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
