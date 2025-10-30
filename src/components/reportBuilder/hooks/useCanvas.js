import { useRef, useCallback } from 'react';
import { Canvas } from 'fabric';

export const useCanvas = (initialConfig) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const initCanvas = useCallback((canvasElement) => {
    if (!canvasElement || fabricCanvasRef.current) return;

    const canvas = new Canvas(canvasElement, {
      width: 960,
      height: 540,
      backgroundColor: '#ffffff',
      selection: true,
      allowTouchScrolling: true,
      ...initialConfig
    });

    fabricCanvasRef.current = canvas;
    return canvas;
  }, [initialConfig]);

  const getCanvas = useCallback(() => {
    return fabricCanvasRef.current;
  }, []);

  const disposeCanvas = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  }, []);

  return {
    canvasRef,
    fabricCanvasRef,
    initCanvas,
    getCanvas,
    disposeCanvas
  };
};
