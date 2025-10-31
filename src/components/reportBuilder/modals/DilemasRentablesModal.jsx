import React, { useState } from 'react';

// Datos iniciales del dilema
const initialData = {
    company: 'Rizoma',
    lado1: {
        title: 'Populismo & Estable',
        subtitle: '(Bolivariano)',
        color: '#C62828',
        caracteristicas: [
            { text: 'Figuras titeres', subItems: ['Luisa González', 'Lenin Moreno', 'Andrés Arauz', 'Revolución Ciudadana'] },
            { text: 'Corrupción', subItems: ['Sobornos (2012-2016)', 'Arroz verde', 'Petroquimidor'] },
            { text: 'Autoritario', subItems: ['Políticas extractivistas', 'Restricciones a EE.UU.', 'Ley de Aguas', 'Represión indígena', 'en Dayuma'] }
        ]
    },
    lado2: {
        title: 'Gobierno Realista & Inestable',
        subtitle: '',
        color: '#1565C0',
        caracteristicas: [
            { text: 'Inestabilidad económica', subItems: ['Aranceles', 'Recesión', 'Reducción del PIB'] },
            { text: 'Inestabilidad de seguridad', subItems: ['Lucha de carteles', 'Druso armado en TV', 'Militares custodiando', 'a niños'] },
            { text: 'Inestabilidad energética', subItems: ['Apagones eléctricos', 'Sequías', 'Dependencia hidroeléctrica'] },
            { text: 'Inestabilidad internacional', subItems: ['Vicepresidenta oriunda', 'Reparación de migrantes', 'Invasión embajada de México', 'Subordinación a EE.UU.'] }
        ]
    }
};

const DilemasRentablesModal = ({ isOpen, onClose, canvas }) => {
    const [data, setData] = useState(initialData);

    if (!isOpen) return null;

    const handleLadoChange = (lado, field, value) => {
        setData({
            ...data,
            [lado]: { ...data[lado], [field]: value }
        });
    };

    const handleCaracteristicaChange = (lado, index, field, value) => {
        const newCaracteristicas = [...data[lado].caracteristicas];
        newCaracteristicas[index] = { ...newCaracteristicas[index], [field]: value };
        setData({
            ...data,
            [lado]: { ...data[lado], caracteristicas: newCaracteristicas }
        });
    };

    const handleSubItemChange = (lado, caracIndex, subIndex, value) => {
        const newCaracteristicas = [...data[lado].caracteristicas];
        newCaracteristicas[caracIndex].subItems[subIndex] = value;
        setData({
            ...data,
            [lado]: { ...data[lado], caracteristicas: newCaracteristicas }
        });
    };

    const handleAddSubItem = (lado, caracIndex) => {
        const newCaracteristicas = [...data[lado].caracteristicas];
        newCaracteristicas[caracIndex].subItems.push('Nuevo ítem');
        setData({
            ...data,
            [lado]: { ...data[lado], caracteristicas: newCaracteristicas }
        });
    };

    const handleRemoveSubItem = (lado, caracIndex, subIndex) => {
        const newCaracteristicas = [...data[lado].caracteristicas];
        if (newCaracteristicas[caracIndex].subItems.length <= 1) {
            alert('Debe haber al menos 1 sub-ítem');
            return;
        }
        newCaracteristicas[caracIndex].subItems.splice(subIndex, 1);
        setData({
            ...data,
            [lado]: { ...data[lado], caracteristicas: newCaracteristicas }
        });
    };

    const handleAddCaracteristica = (lado) => {
        const newCaracteristicas = [...data[lado].caracteristicas];
        newCaracteristicas.push({ text: 'Nueva característica', subItems: ['Ítem 1'] });
        setData({
            ...data,
            [lado]: { ...data[lado], caracteristicas: newCaracteristicas }
        });
    };

    const handleRemoveCaracteristica = (lado, index) => {
        const newCaracteristicas = data[lado].caracteristicas.filter((_, i) => i !== index);
        if (newCaracteristicas.length < 1) {
            alert('Debe haber al menos 1 característica');
            return;
        }
        setData({
            ...data,
            [lado]: { ...data[lado], caracteristicas: newCaracteristicas }
        });
    };

    const drawDilemasChart = () => {
        const c = document.createElement('canvas');
        const width = 1800;
        const height = 900;
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        // Helper function to draw text boxes with borders
        const drawTextBox = (text, x, y, borderColor = '#666', bgColor = '#fff') => {
            ctx.font = '13px Arial';
            const padding = 8;
            const metrics = ctx.measureText(text);
            const boxWidth = metrics.width + padding * 2;
            const boxHeight = 24;

            ctx.fillStyle = bgColor;
            ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y);

            return { width: boxWidth, height: boxHeight };
        };

        // Helper function to draw curved arrows
        const drawCurvedArrow = (fromX, fromY, toX, toY, color, curveAmount = 0) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);

            if (curveAmount !== 0) {
                const midX = (fromX + toX) / 2;
                const midY = (fromY + toY) / 2 + curveAmount;
                ctx.quadraticCurveTo(midX, midY, toX, toY);
            } else {
                ctx.lineTo(toX, toY);
            }

            ctx.stroke();
        };

        // Draw LEFT SIDE
        const leftMainX = 360;
        const leftMainY = centerY;
        const leftMainWidth = 320;
        const leftMainHeight = 110;

        // Left main box
        ctx.fillStyle = data.lado1.color;
        ctx.fillRect(leftMainX - leftMainWidth / 2, leftMainY - leftMainHeight / 2, leftMainWidth, leftMainHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.lado1.title, leftMainX, leftMainY - 12);

        if (data.lado1.subtitle) {
            ctx.font = '16px Arial';
            ctx.fillText(data.lado1.subtitle, leftMainX, leftMainY + 18);
        }

        // Left characteristics positions - más espaciadas
        const leftCaracPositions = [
            { x: 200, y: 160 },
            { x: 200, y: centerY },
            { x: 200, y: 740 }
        ];

        data.lado1.caracteristicas.forEach((carac, caracIndex) => {
            if (caracIndex >= leftCaracPositions.length) return;

            const pos = leftCaracPositions[caracIndex];

            // Main characteristic box
            ctx.fillStyle = data.lado1.color;
            ctx.font = 'bold 16px Arial';
            const caracMetrics = ctx.measureText(carac.text);
            const caracBoxWidth = caracMetrics.width + 30;
            const caracBoxHeight = 38;

            ctx.fillRect(pos.x - caracBoxWidth / 2, pos.y - caracBoxHeight / 2, caracBoxWidth, caracBoxHeight);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(carac.text, pos.x, pos.y);

            // Draw curved arrow from main box to characteristic
            const fromX = leftMainX - leftMainWidth / 2;
            const fromY = leftMainY;
            const toX = pos.x + caracBoxWidth / 2;
            const toY = pos.y;

            let curveAmount = 0;
            if (caracIndex === 0) curveAmount = -80;
            if (caracIndex === 2) curveAmount = 80;

            drawCurvedArrow(fromX, fromY, toX, toY, data.lado1.color, curveAmount);

            // Sub-items - positioned to the left with more spacing
            const subStartY = pos.y - (carac.subItems.length - 1) * 18;
            carac.subItems.forEach((sub, subIndex) => {
                const subX = pos.x - caracBoxWidth / 2 - 110;
                const subY = subStartY + (subIndex * 36);
                drawTextBox(sub, subX, subY, '#999');
            });
        });

        // VS Badge in center
        const vsRadius = 55;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, vsRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VS', centerX, centerY);

        // Draw RIGHT SIDE
        const rightMainX = width - 360;
        const rightMainY = centerY;
        const rightMainWidth = 320;
        const rightMainHeight = 110;

        // Right main box
        ctx.fillStyle = data.lado2.color;
        ctx.fillRect(rightMainX - rightMainWidth / 2, rightMainY - rightMainHeight / 2, rightMainWidth, rightMainHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Split title into two lines
        const titleWords = data.lado2.title.split(' ');
        const midPoint = Math.ceil(titleWords.length / 2);
        const line1 = titleWords.slice(0, midPoint).join(' ');
        const line2 = titleWords.slice(midPoint).join(' ');

        ctx.fillText(line1, rightMainX, rightMainY - 12);
        ctx.fillText(line2, rightMainX, rightMainY + 18);

        // Right characteristics positions - más espaciadas
        const rightCaracPositions = [
            { x: width - 200, y: 140 },
            { x: width - 200, y: 310 },
            { x: width - 200, y: 590 },
            { x: width - 200, y: 760 }
        ];

        data.lado2.caracteristicas.forEach((carac, caracIndex) => {
            if (caracIndex >= rightCaracPositions.length) return;

            const pos = rightCaracPositions[caracIndex];

            // Main characteristic box
            ctx.fillStyle = data.lado2.color;
            ctx.font = 'bold 15px Arial';
            const caracMetrics = ctx.measureText(carac.text);
            const caracBoxWidth = Math.max(caracMetrics.width + 30, 210);
            const caracBoxHeight = 38;

            ctx.fillRect(pos.x - caracBoxWidth / 2, pos.y - caracBoxHeight / 2, caracBoxWidth, caracBoxHeight);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(carac.text, pos.x, pos.y);

            // Draw curved arrow from main box to characteristic
            const fromX = rightMainX + rightMainWidth / 2;
            const fromY = rightMainY;
            const toX = pos.x - caracBoxWidth / 2;
            const toY = pos.y;

            let curveAmount = 0;
            if (caracIndex === 0) curveAmount = -100;
            if (caracIndex === 1) curveAmount = -40;
            if (caracIndex === 2) curveAmount = 40;
            if (caracIndex === 3) curveAmount = 100;

            drawCurvedArrow(fromX, fromY, toX, toY, data.lado2.color, curveAmount);

            // Sub-items - positioned to the right with more spacing
            const subStartY = pos.y - (carac.subItems.length - 1) * 18;
            carac.subItems.forEach((sub, subIndex) => {
                const subX = pos.x + caracBoxWidth / 2 + 110;
                const subY = subStartY + (subIndex * 36);
                drawTextBox(sub, subX, subY, '#999');
            });
        });

        // Company logo
        ctx.fillStyle = '#999';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(data.company, width - 50, height - 40);

        return c;
    };

    const handleInsert = async () => {
        if (!canvas) return;
        const temp = drawDilemasChart();
        const dataURL = temp.toDataURL('image/png');

        const { Image: FabricImage } = await import('fabric');
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const fabricImg = new FabricImage(img, {
                    left: 60,
                    top: 40,
                    selectable: true,
                    evented: true,
                    hasControls: true,
                    hasBorders: true,
                    hoverCursor: 'move',
                    name: 'dilemas-rentables'
                });

                const scale = 960 / fabricImg.width;
                fabricImg.scaleX = scale;
                fabricImg.scaleY = scale;

                canvas.add(fabricImg);
                canvas.setActiveObject(fabricImg);
                fabricImg.setCoords();
                canvas.requestRenderAll();
                onClose();
            } catch (err) {
                console.error('Insert error', err);
            }
        };
        img.src = dataURL;
    };

    return (
        <div className="chart-modal-overlay">
            <div className="chart-modal-container" style={{ maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="chart-modal-title">Identificación de los Dilemas Rentables</h2>

                <div className="chart-modal-field">
                    <label>Empresa/Logo</label>
                    <input value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} />
                </div>

                <hr style={{ margin: '20px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* LADO 1 - IZQUIERDO */}
                    <div style={{ border: '3px solid ' + data.lado1.color, borderRadius: '12px', padding: '20px', backgroundColor: '#fafafa' }}>
                        <h3 style={{ color: data.lado1.color, marginTop: 0 }}>Lado 1 (Izquierdo)</h3>

                        <div className="chart-modal-field">
                            <label>Título Principal</label>
                            <input
                                value={data.lado1.title}
                                onChange={(e) => handleLadoChange('lado1', 'title', e.target.value)}
                                style={{ fontWeight: 'bold' }}
                            />
                        </div>

                        <div className="chart-modal-field">
                            <label>Subtítulo</label>
                            <input
                                value={data.lado1.subtitle}
                                onChange={(e) => handleLadoChange('lado1', 'subtitle', e.target.value)}
                            />
                        </div>

                        <div className="chart-modal-field">
                            <label>Color</label>
                            <input
                                type="color"
                                value={data.lado1.color}
                                onChange={(e) => handleLadoChange('lado1', 'color', e.target.value)}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>

                        <hr style={{ margin: '15px 0' }} />

                        <h4>Características</h4>
                        {data.lado1.caracteristicas.map((carac, caracIndex) => (
                            <div key={caracIndex} style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '10px',
                                backgroundColor: 'white'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        value={carac.text}
                                        onChange={(e) => handleCaracteristicaChange('lado1', caracIndex, 'text', e.target.value)}
                                        placeholder="Característica principal"
                                        style={{ fontWeight: 'bold' }}
                                    />
                                    <button
                                        onClick={() => handleRemoveCaracteristica('lado1', caracIndex)}
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '6px',
                                            borderRadius: '4px',
                                            fontSize: '11px'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '5px' }}>
                                    Sub-ítems:
                                </label>
                                {carac.subItems.map((sub, subIndex) => (
                                    <div key={subIndex} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '5px', marginBottom: '5px' }}>
                                        <input
                                            value={sub}
                                            onChange={(e) => handleSubItemChange('lado1', caracIndex, subIndex, e.target.value)}
                                            placeholder="Sub-ítem"
                                            style={{ fontSize: '12px', padding: '5px' }}
                                        />
                                        <button
                                            onClick={() => handleRemoveSubItem('lado1', caracIndex, subIndex)}
                                            style={{
                                                background: '#95a5a6',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                borderRadius: '4px',
                                                fontSize: '10px'
                                            }}
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddSubItem('lado1', caracIndex)}
                                    style={{
                                        background: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        width: '100%',
                                        marginTop: '5px'
                                    }}
                                >
                                    + Sub-ítem
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => handleAddCaracteristica('lado1')}
                            style={{
                                background: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                width: '100%',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Añadir Característica
                        </button>
                    </div>

                    {/* LADO 2 - DERECHO */}
                    <div style={{ border: '3px solid ' + data.lado2.color, borderRadius: '12px', padding: '20px', backgroundColor: '#fafafa' }}>
                        <h3 style={{ color: data.lado2.color, marginTop: 0 }}>Lado 2 (Derecho)</h3>

                        <div className="chart-modal-field">
                            <label>Título Principal</label>
                            <input
                                value={data.lado2.title}
                                onChange={(e) => handleLadoChange('lado2', 'title', e.target.value)}
                                style={{ fontWeight: 'bold' }}
                            />
                        </div>

                        <div className="chart-modal-field">
                            <label>Subtítulo</label>
                            <input
                                value={data.lado2.subtitle}
                                onChange={(e) => handleLadoChange('lado2', 'subtitle', e.target.value)}
                            />
                        </div>

                        <div className="chart-modal-field">
                            <label>Color</label>
                            <input
                                type="color"
                                value={data.lado2.color}
                                onChange={(e) => handleLadoChange('lado2', 'color', e.target.value)}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>

                        <hr style={{ margin: '15px 0' }} />

                        <h4>Características</h4>
                        {data.lado2.caracteristicas.map((carac, caracIndex) => (
                            <div key={caracIndex} style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '10px',
                                backgroundColor: 'white'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        value={carac.text}
                                        onChange={(e) => handleCaracteristicaChange('lado2', caracIndex, 'text', e.target.value)}
                                        placeholder="Característica principal"
                                        style={{ fontWeight: 'bold' }}
                                    />
                                    <button
                                        onClick={() => handleRemoveCaracteristica('lado2', caracIndex)}
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '6px',
                                            borderRadius: '4px',
                                            fontSize: '11px'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '5px' }}>
                                    Sub-ítems:
                                </label>
                                {carac.subItems.map((sub, subIndex) => (
                                    <div key={subIndex} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '5px', marginBottom: '5px' }}>
                                        <input
                                            value={sub}
                                            onChange={(e) => handleSubItemChange('lado2', caracIndex, subIndex, e.target.value)}
                                            placeholder="Sub-ítem"
                                            style={{ fontSize: '12px', padding: '5px' }}
                                        />
                                        <button
                                            onClick={() => handleRemoveSubItem('lado2', caracIndex, subIndex)}
                                            style={{
                                                background: '#95a5a6',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                borderRadius: '4px',
                                                fontSize: '10px'
                                            }}
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddSubItem('lado2', caracIndex)}
                                    style={{
                                        background: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        width: '100%',
                                        marginTop: '5px'
                                    }}
                                >
                                    + Sub-ítem
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => handleAddCaracteristica('lado2')}
                            style={{
                                background: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                width: '100%',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Añadir Característica
                        </button>
                    </div>
                </div>

                <div className="chart-modal-buttons" style={{ marginTop: '20px' }}>
                    <button onClick={onClose} className="chart-modal-button-cancel">Cancelar</button>
                    <button onClick={handleInsert} className="chart-modal-button-insert">Insertar Dilemas</button>
                </div>
            </div>
        </div>
    );
};

export default DilemasRentablesModal;