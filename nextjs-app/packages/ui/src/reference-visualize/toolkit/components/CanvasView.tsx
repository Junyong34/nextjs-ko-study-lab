/**
 * @fileoverview CanvasView Declarative Component
 * 선언적 방식으로 캔버스 컨테이너를 정의하고 프레임 콜백 또는 자식 레이어를 합성하는 컴포넌트
 */

'use client';

import React from 'react';
import { useCanvas, type UseCanvasOptions } from '../hooks/useCanvas';

export interface CanvasViewProps extends UseCanvasOptions {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  className,
  style,
  children,
  ...canvasOptions
}) => {
  const { canvasRef, isPlaying, start, stop, toggle } = useCanvas(canvasOptions);

  return (
    <div
      style={{
        position: 'relative',
        width: canvasOptions.width ? `${canvasOptions.width}px` : '100%',
        height: canvasOptions.height ? `${canvasOptions.height}px` : undefined,
        ...style
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
      {children}
    </div>
  );
};
