/**
 * @fileoverview Canvas HiDPI / Retina Display Driver
 * 디바이스 픽셀 비율(devicePixelRatio) 보정 및 캔버스 컨텍스트 초기화/스케일러
 */

import type { CanvasSize } from './types';

/**
 * 캔버스를 HiDPI 해상도에 맞춰 물리 버퍼 크기와 논리 스타일 크기를 설정하고 스케일 변환을 적용합니다.
 */
export function setupCanvasDpi(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  forcedDpr?: number
): { ctx: CanvasRenderingContext2D; size: CanvasSize } {
  const dpr = forcedDpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const width = Math.max(0, Math.round(cssWidth));
  const height = Math.max(0, Math.round(cssHeight));
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  // 물리 픽셀 크기 설정 (버퍼)
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

  // 논리 CSS 크기 설정 (화면 표시)
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to obtain 2D context from canvas');
  }

  // scale 누적 방지를 위해 setTransform으로 원점 및 dpr 초기화
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const size: CanvasSize = {
    width,
    height,
    dpr,
    pixelWidth,
    pixelHeight
  };

  return { ctx, size };
}

/**
 * 캔버스 전체 영역을 투명하게 비우거나 배경색으로 채웁니다.
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  backgroundColor?: string
): void {
  ctx.save();
  // 논리 좌표계 기준 전체 클리어
  ctx.clearRect(0, 0, size.width, size.height);
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size.width, size.height);
  }
  ctx.restore();
}
