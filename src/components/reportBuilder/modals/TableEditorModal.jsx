import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Rect, Text, Group } from 'fabric';

const TableEditorModal = ({ isOpen, onClose, canvas }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tableData, setTableData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [tableGenerated, setTableGenerated] = useState(false);

  // Opciones de configuración
  const [useListTemplate, setUseListTemplate] = useState(false);
  const [includeHeader, setIncludeHeader] = useState(false);
  const [autoNumberFirstCol, setAutoNumberFirstCol] = useState(false);

  const [styles, setStyles] = useState({
    borderColor: '#000000',
    borderWidth: 1,
    bgColor: '#ffffff',
    headerBgColor: '#1967D2',
    fontSize: 14,
    headerFontSize: 16
  });

  // Efecto para aplicar plantilla "Lista Numerada"
  useEffect(() => {
    if (useListTemplate && !tableGenerated) {
      setCols(3);
      setIncludeHeader(true);
      setAutoNumberFirstCol(true);
      setHeaderData(['#', 'Nombre', 'Descripción']);
    } else if (!useListTemplate && !tableGenerated) {
      setHeaderData([]);
    }
  }, [useListTemplate, tableGenerated]);

  const generateEmptyTable = () => {
    const newData = Array(rows).fill(null).map(() => Array(cols).fill(''));
    setTableData(newData);

    // Si incluye header y no es plantilla (que ya tiene headers)
    if (includeHeader && !useListTemplate) {
      const newHeaders = Array(cols).fill('').map((_, i) => `Columna ${i + 1}`);
      setHeaderData(newHeaders);
    } else if (includeHeader && useListTemplate) {
      // Ya tiene headers de la plantilla
      setHeaderData(['#', 'Nombre', 'Descripción']);
    } else {
      setHeaderData([]);
    }

    setTableGenerated(true);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const handleHeaderChange = (colIndex, value) => {
    const newHeaders = [...headerData];
    newHeaders[colIndex] = value;
    setHeaderData(newHeaders);
  };

  const insertTableToCanvas = () => {
    if (!canvas || !tableGenerated) return;

    // Determinar anchos de columna
    let colWidths;
    if (useListTemplate) {
      colWidths = [60, 150, 250]; // Anchos optimizados para Lista Numerada
    } else {
      colWidths = Array(cols).fill(80); // Ancho estándar
    }

    const headerHeight = includeHeader ? 45 : 0;
    const rowHeight = 40;
    const elements = [];

    // Renderizar Headers si están habilitados
    if (includeHeader && headerData.length > 0) {
      let xPos = 0;
      headerData.forEach((header, colIndex) => {
        // Header cell background
        const headerCell = new Rect({
          left: xPos,
          top: 0,
          width: colWidths[colIndex] || 80,
          height: headerHeight,
          fill: styles.headerBgColor,
          stroke: styles.borderColor,
          strokeWidth: styles.borderWidth
        });
        elements.push(headerCell);

        // Header text
        const headerText = new Text(header, {
          left: xPos + (colWidths[colIndex] || 80) / 2,
          top: headerHeight / 2,
          fontSize: styles.headerFontSize,
          fill: '#ffffff',
          fontWeight: 'bold',
          originX: 'center',
          originY: 'center',
          fontFamily: 'Inter'
        });
        elements.push(headerText);

        xPos += colWidths[colIndex] || 80;
      });
    }

    // Renderizar filas de datos
    for (let i = 0; i < rows; i++) {
      const yPos = headerHeight + (i * rowHeight);
      let xPos = 0;

      for (let j = 0; j < cols; j++) {
        const cellWidth = colWidths[j] || 80;

        // Celda (rectángulo)
        const cell = new Rect({
          left: xPos,
          top: yPos,
          width: cellWidth,
          height: rowHeight,
          fill: styles.bgColor,
          stroke: styles.borderColor,
          strokeWidth: styles.borderWidth
        });
        elements.push(cell);

        // Texto dentro de la celda
        let cellText = tableData[i] && tableData[i][j] ? tableData[i][j] : '';

        // Si es la primera columna y auto-numeración está activada
        if (j === 0 && autoNumberFirstCol) {
          cellText = (i + 1).toString();
        }

        if (cellText) {
          const textAlignment = (j === 0 && autoNumberFirstCol) ? 'center' : 'left';
          const textLeft = (j === 0 && autoNumberFirstCol)
            ? xPos + cellWidth / 2
            : xPos + 10;

          const text = new Text(cellText, {
            left: textLeft,
            top: yPos + rowHeight / 2,
            fontSize: styles.fontSize,
            fill: '#000000',
            fontWeight: (j === 0 && autoNumberFirstCol) ? 'bold' : 'normal',
            originX: textAlignment === 'center' ? 'center' : 'left',
            originY: 'center',
            fontFamily: 'Inter'
          });
          elements.push(text);
        }

        xPos += cellWidth;
      }
    }

    const group = new Group(elements, {
      left: 100,
      top: 100
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();

    // Cerrar modal y resetear
    handleClose();
  };

  const handleClose = () => {
    setRows(3);
    setCols(3);
    setTableData([]);
    setHeaderData([]);
    setTableGenerated(false);
    setUseListTemplate(false);
    setIncludeHeader(false);
    setAutoNumberFirstCol(false);
    setStyles({
      borderColor: '#000000',
      borderWidth: 1,
      bgColor: '#ffffff',
      headerBgColor: '#1967D2',
      fontSize: 14,
      headerFontSize: 16
    });
    onClose();
  };

  const handleTemplateChange = (checked) => {
    setUseListTemplate(checked);
    if (checked) {
      setCols(3);
      setIncludeHeader(true);
      setAutoNumberFirstCol(true);
    }
  };

  // Early return DESPUÉS de todos los hooks
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Editor de Tablas</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Template rápido */}
          <div className="template-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useListTemplate}
                onChange={(e) => handleTemplateChange(e.target.checked)}
                disabled={tableGenerated}
              />
              <span>Usar plantilla "Lista Numerada" (3 columnas: #, Nombre, Descripción)</span>
            </label>
          </div>

          {/* Configuración inicial */}
          <div className="table-config">
            <div className="config-row">
              <div className="input-group">
                <label>Filas:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                  disabled={tableGenerated}
                />
              </div>

              <div className="input-group">
                <label>Columnas:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                  disabled={tableGenerated || useListTemplate}
                />
              </div>

              {!tableGenerated && (
                <button className="btn-primary" onClick={generateEmptyTable}>
                  Generar Tabla
                </button>
              )}

              {tableGenerated && (
                <button className="btn-secondary" onClick={() => setTableGenerated(false)}>
                  Regenerar
                </button>
              )}
            </div>

            {/* Opciones adicionales */}
            {!useListTemplate && !tableGenerated && (
              <div className="config-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includeHeader}
                    onChange={(e) => setIncludeHeader(e.target.checked)}
                  />
                  <span>Incluir fila de encabezado</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={autoNumberFirstCol}
                    onChange={(e) => setAutoNumberFirstCol(e.target.checked)}
                  />
                  <span>Primera columna auto-numerada (1, 2, 3...)</span>
                </label>
              </div>
            )}
          </div>

          {/* Headers editables */}
          {tableGenerated && includeHeader && !useListTemplate && headerData.length > 0 && (
            <div className="headers-section">
              <h4>Encabezados de Columnas</h4>
              <div className="headers-grid" style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`
              }}>
                {headerData.map((header, colIndex) => (
                  <input
                    key={colIndex}
                    type="text"
                    className="header-input"
                    value={header}
                    onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                    placeholder={`Columna ${colIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info para Lista Numerada */}
          {tableGenerated && useListTemplate && (
            <div className="info-box">
              <p>📋 Modo Lista Numerada: La primera columna se numerará automáticamente (1, 2, 3...)</p>
              <p>Completa solo las columnas "Nombre" y "Descripción".</p>
            </div>
          )}

          {/* Grid editable */}
          {tableGenerated && tableData.length > 0 && (
            <>
              <div className="table-grid-container">
                <div className="table-grid" style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`
                }}>
                  {tableData.map((row, rowIndex) => (
                    row.map((cell, colIndex) => {
                      // Si es la primera columna y está auto-numerada, deshabilitar
                      const isDisabled = colIndex === 0 && autoNumberFirstCol;

                      return (
                        <input
                          key={`${rowIndex}-${colIndex}`}
                          type="text"
                          className={`table-cell-input ${isDisabled ? 'disabled' : ''}`}
                          value={isDisabled ? (rowIndex + 1).toString() : cell}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          placeholder={isDisabled ? (rowIndex + 1).toString() : `${rowIndex + 1},${colIndex + 1}`}
                          disabled={isDisabled}
                        />
                      );
                    })
                  ))}
                </div>
              </div>

              {/* Opciones de estilo */}
              <div className="table-styles">
                <h4>Estilos de Tabla</h4>
                <div className="styles-grid">
                  <div className="input-group">
                    <label>Color de Borde:</label>
                    <div className="color-input-row">
                      <input
                        type="color"
                        value={styles.borderColor}
                        onChange={(e) => setStyles({...styles, borderColor: e.target.value})}
                      />
                      <input
                        type="text"
                        value={styles.borderColor}
                        onChange={(e) => setStyles({...styles, borderColor: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Ancho de Borde:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={styles.borderWidth}
                      onChange={(e) => setStyles({...styles, borderWidth: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  {includeHeader && (
                    <div className="input-group">
                      <label>Color Header:</label>
                      <div className="color-input-row">
                        <input
                          type="color"
                          value={styles.headerBgColor}
                          onChange={(e) => setStyles({...styles, headerBgColor: e.target.value})}
                        />
                        <input
                          type="text"
                          value={styles.headerBgColor}
                          onChange={(e) => setStyles({...styles, headerBgColor: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <div className="input-group">
                    <label>Color de Fondo:</label>
                    <div className="color-input-row">
                      <input
                        type="color"
                        value={styles.bgColor}
                        onChange={(e) => setStyles({...styles, bgColor: e.target.value})}
                      />
                      <input
                        type="text"
                        value={styles.bgColor}
                        onChange={(e) => setStyles({...styles, bgColor: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Tamaño de Fuente:</label>
                    <input
                      type="number"
                      min="10"
                      max="24"
                      value={styles.fontSize}
                      onChange={(e) => setStyles({...styles, fontSize: parseInt(e.target.value) || 14})}
                    />
                  </div>

                  {includeHeader && (
                    <div className="input-group">
                      <label>Tamaño Fuente Header:</label>
                      <input
                        type="number"
                        min="12"
                        max="28"
                        value={styles.headerFontSize}
                        onChange={(e) => setStyles({...styles, headerFontSize: parseInt(e.target.value) || 16})}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          {tableGenerated && (
            <button className="btn-primary" onClick={insertTableToCanvas}>
              Insertar Tabla en Canvas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableEditorModal;
