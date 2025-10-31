import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

const DemographicsTableModal = ({ isOpen, onClose, canvas }) => {
  const [tables, setTables] = useState([
    {
      title: 'Género:',
      rows: [
        { label: 'Masculino:', general: '49.7%', digital: '49.2%', color: '#E91E63' },
        { label: 'Femenino:', general: '50.3%', digital: '50.8%', color: '#E91E63' }
      ]
    },
    {
      title: 'Edades:',
      rows: [
        { label: '15 - 19:', general: '8.2 %', digital: '9.0 %', color: '#E91E63' },
        { label: '20 - 29:', general: '17.5 %', digital: '20.1 %', color: '#E91E63' },
        { label: '30 - 39:', general: '16 %', digital: '17.6 %', color: '#E91E63' },
        { label: '40 - 49:', general: '14 %', digital: '14.3 %', color: '#E91E63' },
        { label: '50 - 59:', general: '10.2 %', digital: '9.4 %', color: '#E91E63' },
        { label: '60 - 85+:', general: '10.1 %', digital: '8.8 %', color: '#E91E63' }
      ]
    },
    {
      title: 'Clase Social:',
      rows: [
        { label: 'Alta:', general: '7%', digital: '10%', color: '#E91E63' },
        { label: 'Media:', general: '61%', digital: '71%', color: '#E91E63' },
        { label: 'Baja:', general: '32%', digital: '19%', color: '#E91E63' }
      ]
    },
    {
      title: 'Distribución:',
      rows: [
        { label: 'Urbana:', general: '94.5%', digital: '92%', color: '#E91E63' },
        { label: 'Rural:', general: '5.5%', digital: '8%', color: '#E91E63' }
      ]
    }
  ]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      drawPreview();
    }
  }, [tables, isOpen]);

  const drawPreview = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Configuración
    const startX = 20;
    let currentY = 20;
    const tableSpacing = 30;
    const columnWidths = [100, 70, 70]; // label, general, digital
    const rowHeight = 25;

    tables.forEach((table, tableIndex) => {
      // Título de la tabla
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(table.title, startX, currentY);
      currentY += 5;

      // Encabezados
      ctx.fillStyle = '#9E9E9E';
      ctx.fillRect(startX + columnWidths[0], currentY, columnWidths[1], 20);
      ctx.fillRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], 20);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('General', startX + columnWidths[0] + columnWidths[1] / 2, currentY + 14);
      ctx.fillText('Digital', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, currentY + 14);

      currentY += 20;

      // Filas
      table.rows.forEach((row, rowIndex) => {
        // Fondo de las celdas de datos
        const bgColor = rowIndex % 2 === 0 ? '#E0E0E0' : '#F5F5F5';
        ctx.fillStyle = bgColor;
        ctx.fillRect(startX + columnWidths[0], currentY, columnWidths[1], rowHeight);
        ctx.fillRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], rowHeight);

        // Label (con color)
        ctx.fillStyle = row.color;
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(row.label, startX, currentY + 16);

        // Valores
        ctx.fillStyle = '#000000';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(row.general, startX + columnWidths[0] + columnWidths[1] / 2, currentY + 16);
        ctx.fillText(row.digital, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, currentY + 16);

        // Bordes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX + columnWidths[0], currentY, columnWidths[1], rowHeight);
        ctx.strokeRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], rowHeight);

        currentY += rowHeight;
      });

      currentY += tableSpacing;
    });
  };

  const addTable = () => {
    setTables([
      ...tables,
      {
        title: 'Nueva Categoría:',
        rows: [
          { label: 'Item 1:', general: '50%', digital: '50%', color: '#E91E63' }
        ]
      }
    ]);
  };

  const removeTable = (tableIndex) => {
    if (tables.length > 1) {
      setTables(tables.filter((_, i) => i !== tableIndex));
    }
  };

  const updateTable = (tableIndex, field, value) => {
    const newTables = [...tables];
    newTables[tableIndex][field] = value;
    setTables(newTables);
  };

  const addRow = (tableIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].rows.push({
      label: `Item ${newTables[tableIndex].rows.length + 1}:`,
      general: '0%',
      digital: '0%',
      color: '#E91E63'
    });
    setTables(newTables);
  };

  const removeRow = (tableIndex, rowIndex) => {
    const newTables = [...tables];
    if (newTables[tableIndex].rows.length > 1) {
      newTables[tableIndex].rows.splice(rowIndex, 1);
      setTables(newTables);
    }
  };

  const updateRow = (tableIndex, rowIndex, field, value) => {
    const newTables = [...tables];
    newTables[tableIndex].rows[rowIndex][field] = value;
    setTables(newTables);
  };

  const insertTableToCanvas = () => {
    if (!canvas) return;

    // Crear canvas temporal para renderizar las tablas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    
    // Calcular altura necesaria
    let totalHeight = 40;
    tables.forEach(table => {
      totalHeight += 50 + (table.rows.length * 35) + 40;
    });
    tempCanvas.height = totalHeight;

    const tempCtx = tempCanvas.getContext('2d');

    // Fondo blanco
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Configuración
    const startX = 40;
    let currentY = 40;
    const tableSpacing = 40;
    const columnWidths = [140, 100, 100];
    const rowHeight = 35;

    tables.forEach((table) => {
      // Título de la tabla
      tempCtx.fillStyle = '#000000';
      tempCtx.font = 'bold 20px Arial';
      tempCtx.textAlign = 'left';
      tempCtx.fillText(table.title, startX, currentY);
      currentY += 10;

      // Encabezados
      tempCtx.fillStyle = '#9E9E9E';
      tempCtx.fillRect(startX + columnWidths[0], currentY, columnWidths[1], 30);
      tempCtx.fillRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], 30);

      tempCtx.fillStyle = '#ffffff';
      tempCtx.font = 'bold 14px Arial';
      tempCtx.textAlign = 'center';
      tempCtx.fillText('General', startX + columnWidths[0] + columnWidths[1] / 2, currentY + 20);
      tempCtx.fillText('Digital', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, currentY + 20);

      currentY += 30;

      // Filas
      table.rows.forEach((row, rowIndex) => {
        // Fondo de las celdas de datos
        const bgColor = rowIndex % 2 === 0 ? '#E0E0E0' : '#F5F5F5';
        tempCtx.fillStyle = bgColor;
        tempCtx.fillRect(startX + columnWidths[0], currentY, columnWidths[1], rowHeight);
        tempCtx.fillRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], rowHeight);

        // Label (con color)
        tempCtx.fillStyle = row.color;
        tempCtx.font = 'bold 16px Arial';
        tempCtx.textAlign = 'left';
        tempCtx.fillText(row.label, startX, currentY + 22);

        // Valores
        tempCtx.fillStyle = '#000000';
        tempCtx.font = '16px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.fillText(row.general, startX + columnWidths[0] + columnWidths[1] / 2, currentY + 22);
        tempCtx.fillText(row.digital, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, currentY + 22);

        // Bordes
        tempCtx.strokeStyle = '#ffffff';
        tempCtx.lineWidth = 2;
        tempCtx.strokeRect(startX + columnWidths[0], currentY, columnWidths[1], rowHeight);
        tempCtx.strokeRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], rowHeight);

        currentY += rowHeight;
      });

      currentY += tableSpacing;
    });

    // Convertir canvas a imagen y agregar al canvas principal
    const dataURL = tempCanvas.toDataURL('image/png');
    const imgElement = new Image();
    
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 100,
        top: 100,
        scaleX: 0.8,
        scaleY: 0.8
      });
      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      handleClose();
    };
    
    imgElement.src = dataURL;
  };

  const handleClose = () => {
    setTables([
      {
        title: 'Género:',
        rows: [
          { label: 'Masculino:', general: '49.7%', digital: '49.2%', color: '#E91E63' },
          { label: 'Femenino:', general: '50.3%', digital: '50.8%', color: '#E91E63' }
        ]
      },
      {
        title: 'Edades:',
        rows: [
          { label: '15 - 19:', general: '8.2 %', digital: '9.0 %', color: '#E91E63' },
          { label: '20 - 29:', general: '17.5 %', digital: '20.1 %', color: '#E91E63' },
          { label: '30 - 39:', general: '16 %', digital: '17.6 %', color: '#E91E63' },
          { label: '40 - 49:', general: '14 %', digital: '14.3 %', color: '#E91E63' },
          { label: '50 - 59:', general: '10.2 %', digital: '9.4 %', color: '#E91E63' },
          { label: '60 - 85+:', general: '10.1 %', digital: '8.8 %', color: '#E91E63' }
        ]
      },
      {
        title: 'Clase Social:',
        rows: [
          { label: 'Alta:', general: '7%', digital: '10%', color: '#E91E63' },
          { label: 'Media:', general: '61%', digital: '71%', color: '#E91E63' },
          { label: 'Baja:', general: '32%', digital: '19%', color: '#E91E63' }
        ]
      },
      {
        title: 'Distribución:',
        rows: [
          { label: 'Urbana:', general: '94.5%', digital: '92%', color: '#E91E63' },
          { label: 'Rural:', general: '5.5%', digital: '8%', color: '#E91E63' }
        ]
      }
    ]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-900" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Tablas Demográficas General y Digital</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Lista de tablas */}
          <div className="segments-section">
            <div className="section-header">
              <h4>Categorías Demográficas</h4>
              <button className="btn-primary btn-sm" onClick={addTable}>
                <Plus size={16} />
                Agregar Categoría
              </button>
            </div>

            {tables.map((table, tableIndex) => (
              <div key={tableIndex} className="chart-profile-card">
                <div className="chart-profile-header">
                  <input
                    type="text"
                    placeholder="Título de la categoría"
                    value={table.title}
                    onChange={(e) => updateTable(tableIndex, 'title', e.target.value)}
                    className="chart-form-input"
                  />
                  <button
                    className="chart-remove-button"
                    onClick={() => removeTable(tableIndex)}
                    disabled={tables.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Filas de datos */}
                <div className="chart-form-grid-4col">
                  <div className="chart-sentimientos-header">
                    <h4 className="text-left">Etiqueta</h4>
                  </div>
                  <div className="chart-sentimientos-header">
                    <h4 className="text-left">General</h4>
                  </div>
                  <div className="chart-sentimientos-header">
                    <h4 className="text-left">Digital</h4>
                  </div>
                  <div className="chart-sentimientos-header">
                    <h4 className="text-left">Color</h4>
                  </div>

                  {table.rows.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <input
                        type="text"
                        placeholder="Etiqueta"
                        value={row.label}
                        onChange={(e) => updateRow(tableIndex, rowIndex, 'label', e.target.value)}
                        className="chart-form-input"
                      />
                      <input
                        type="text"
                        placeholder="General"
                        value={row.general}
                        onChange={(e) => updateRow(tableIndex, rowIndex, 'general', e.target.value)}
                        className="chart-form-input"
                      />
                      <input
                        type="text"
                        placeholder="Digital"
                        value={row.digital}
                        onChange={(e) => updateRow(tableIndex, rowIndex, 'digital', e.target.value)}
                        className="chart-form-input"
                      />
                      <div className="flex-row-gap-8-center">
                        <input
                          type="color"
                          value={row.color}
                          onChange={(e) => updateRow(tableIndex, rowIndex, 'color', e.target.value)}
                          className="color-input"
                        />
                        <button
                          className="chart-delete-button"
                          onClick={() => removeRow(tableIndex, rowIndex)}
                          disabled={table.rows.length <= 1}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                <button
                  className="chart-add-button"
                  onClick={() => addRow(tableIndex)}
                >
                  <Plus size={14} />
                  Agregar Fila
                </button>
              </div>
            ))}
          </div>

          {/* Vista previa */}
          <div className="chart-preview">
            <h4>Vista Previa</h4>
            <div className="preview-container">
              <canvas ref={canvasRef} width="500" height="600"></canvas>
            </div>
          </div>
        </div>

        <div className="chart-modal-buttons">
          <button className="chart-modal-button-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button className="chart-modal-button-insert" onClick={insertTableToCanvas}>
            Insertar Tablas en Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemographicsTableModal;
