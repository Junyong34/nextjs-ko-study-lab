'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { PointerState } from '../core/types';

export function usePointerTracker(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    isDown: false,
    isInside: false
  });

  const updateCoordinates = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const current = pointerRef.current;
    current.prevX = current.x;
    current.prevY = current.y;
    current.x = clientX - rect.left;
    current.y = clientY - rect.top;
    current.isInside =
      current.x >= 0 && current.x <= rect.width && current.y >= 0 && current.y <= rect.height;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      updateCoordinates(e.clientX, e.clientY, canvas);
    };

    const onMouseDown = () => {
      pointerRef.current.isDown = true;
    };

    const onMouseUp = () => {
      pointerRef.current.isDown = false;
    };

    const onMouseEnter = (e: MouseEvent) => {
      updateCoordinates(e.clientX, e.clientY, canvas);
      pointerRef.current.isInside = true;
    };

    const onMouseLeave = () => {
      pointerRef.current.isInside = false;
      pointerRef.current.isDown = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY, canvas);
        pointerRef.current.isDown = true;
        pointerRef.current.isInside = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY, canvas);
      }
    };

    const onTouchEnd = () => {
      pointerRef.current.isDown = false;
      pointerRef.current.isInside = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseenter', onMouseEnter);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [canvasRef, updateCoordinates]);

  return pointerRef;
}
