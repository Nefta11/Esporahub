import { useCallback } from 'react';
import { IText, Rect, Circle, Line, Gradient, Image as FabricImage, Polygon } from 'fabric';

export const useFabricObject = (canvas) => {

  const addText = useCallback((text = 'Texto aquí', options = {}) => {
    if (!canvas) return;

    const textObj = new IText(text, {
      left: 100,
      top: 100,
      fontSize: 18,
      fill: '#1a1a1a',
      fontFamily: 'Inter',
      ...options
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    return textObj;
  }, [canvas]);

  const addShape = useCallback((type = 'rect', options = {}) => {
    if (!canvas) return;

    let shape;
    const defaultFill = options.fill || '#1967D2';

    switch (type) {
      case 'rect':
        shape = new Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          ...options
        });
        break;

      case 'circle':
        shape = new Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: defaultFill,
          ...options
        });
        break;

      case 'triangle':
        // Triángulo equilátero usando Polygon
        shape = new Polygon(
          [
            { x: 50, y: 0 },    // Punta superior
            { x: 0, y: 86.6 },  // Esquina inferior izquierda
            { x: 100, y: 86.6 } // Esquina inferior derecha
          ],
          {
            left: 100,
            top: 100,
            fill: defaultFill,
            ...options
          }
        );
        break;

      case 'polygon':
        // Hexágono regular
        const hexRadius = 50;
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          hexPoints.push({
            x: hexRadius + hexRadius * Math.cos(angle),
            y: hexRadius + hexRadius * Math.sin(angle)
          });
        }
        shape = new Polygon(hexPoints, {
          left: 100,
          top: 100,
          fill: defaultFill,
          ...options
        });
        break;

      case 'star':
        // Estrella de 5 puntas
        const starPoints = [];
        const outerRadius = 50;
        const innerRadius = 20;
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          starPoints.push({
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
          });
        }
        shape = new Polygon(starPoints, {
          left: 100,
          top: 100,
          fill: defaultFill,
          ...options
        });
        break;

      default:
        shape = new Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          ...options
        });
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }

    return shape;
  }, [canvas]);

  const addLine = useCallback((options = {}) => {
    if (!canvas) return;

    const line = new Line([50, 100, 200, 100], {
      stroke: '#1a1a1a',
      strokeWidth: 2,
      ...options
    });

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
    return line;
  }, [canvas]);

  const addImage = useCallback(() => {
    if (!canvas) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        // Crear elemento IMG directamente
        const imgElement = new Image();
        imgElement.onload = () => {
          const fabricImg = new FabricImage(imgElement);
          fabricImg.scaleToWidth(200);
          fabricImg.set({ left: 100, top: 100 });
          canvas.add(fabricImg);
          canvas.setActiveObject(fabricImg);
          canvas.renderAll();
        };
        imgElement.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }, [canvas]);

  const duplicateObject = useCallback(() => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (!active) return;

    active.clone((cloned) => {
      cloned.set({
        left: active.left + 10,
        top: active.top + 10
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  }, [canvas]);

  const deleteObject = useCallback(() => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
    }
  }, [canvas]);

  const bringToFront = useCallback(() => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (active) {
      canvas.bringToFront(active);
      canvas.renderAll();
    }
  }, [canvas]);

  const sendToBack = useCallback(() => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (active) {
      canvas.sendToBack(active);
      canvas.renderAll();
    }
  }, [canvas]);

  const setBackground = useCallback((type) => {
    if (!canvas) return;

    canvas.backgroundImage = null;

    switch(type) {
      case 'white':
        canvas.backgroundColor = '#ffffff';
        break;

      case 'gradient-blue':
        canvas.backgroundColor = new Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
          colorStops: [
            { offset: 0, color: '#1967D2' },
            { offset: 1, color: '#174EA6' }
          ]
        });
        break;

      case 'gradient-purple':
        canvas.backgroundColor = new Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
          colorStops: [
            { offset: 0, color: '#5E5CE6' },
            { offset: 1, color: '#AF52DE' }
          ]
        });
        break;

      default:
        canvas.backgroundColor = '#ffffff';
    }

    canvas.renderAll();
  }, [canvas]);

  const updateObjectProperty = useCallback((property, value) => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (!active) return;

    active.set(property, value);
    canvas.renderAll();
  }, [canvas]);

  return {
    addText,
    addShape,
    addLine,
    addImage,
    duplicateObject,
    deleteObject,
    bringToFront,
    sendToBack,
    setBackground,
    updateObjectProperty
  };
};
