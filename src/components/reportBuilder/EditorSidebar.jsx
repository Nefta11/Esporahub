import React from 'react';
import { Type, Square, Image, Minus, Table, Grid3x3, PieChart, BarChart3 } from 'lucide-react';

const EditorSidebar = ({
  onAddText,
  onAddShape,
  onAddImage,
  onAddLine,
  onOpenTableModal,
  onOpenTabalModal,
  onOpenDonutModal,
  onOpenUsoMediosModal,
  onSetBackground
}) => {

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

          <button className="tool-card" onClick={() => onAddShape('rect')} title="Agregar Forma">
            <Square size={24} />
            <span>Forma</span>
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

          <button className="tool-card" onClick={onOpenTabalModal} title="Editor Tabal">
            <Grid3x3 size={24} />
            <span>Tabal</span>
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

      {/* Fondos */}
      <section className="tools-section">
        <h3 className="section-title">Fondos</h3>
        <div className="backgrounds-list">
          <button
            className="bg-option bg-white"
            onClick={() => onSetBackground('white')}
            title="Fondo Blanco"
          >
            <span>Blanco</span>
          </button>

          <button
            className="bg-option bg-gradient-blue"
            onClick={() => onSetBackground('gradient-blue')}
            title="Degradado Azul"
          >
            <span>Degradado Azul</span>
          </button>

          <button
            className="bg-option bg-gradient-purple"
            onClick={() => onSetBackground('gradient-purple')}
            title="Degradado Morado"
          >
            <span>Degradado Morado</span>
          </button>
        </div>
      </section>
    </aside>
  );
};

export default EditorSidebar;
