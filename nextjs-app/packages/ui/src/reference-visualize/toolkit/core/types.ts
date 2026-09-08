/**
 * @fileoverview Canvas Toolkit Core Types
 * 캔버스 크기, 애니메이션 프레임 컨텍스트, 포인터 상태 및 기본 기하학적 데이터 구조 정의
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasSize {
  /** 논리적 CSS 너비 */
  width: number;
  /** 논리적 CSS 높이 */
  height: number;
  /** 현재 디바이스 픽셀 비율 (HiDPI) */
  dpr: number;
  /** 실제 캔버스 내부 비트맵 픽셀 너비 (width * dpr) */
  pixelWidth: number;
  /** 실제 캔버스 내부 비트맵 픽셀 높이 (height * dpr) */
  pixelHeight: number;
}

export interface PointerState {
  /** 캔버스 내부 상대 X 좌표 */
  x: number;
  /** 캔버스 내부 상대 Y 좌표 */
  y: number;
  /** 이전 프레임 X 좌표 */
  prevX: number;
  /** 이전 프레임 Y 좌표 */
  prevY: number;
  /** 마우스/터치 누름 여부 */
  isDown: boolean;
  /** 포인터가 캔버스 영역 내부에 있는지 여부 */
  isInside: boolean;
}

export interface CanvasFrameContext {
  /** 2D 렌더링 컨텍스트 (HiDPI 스케일 자동 적용됨) */
  ctx: CanvasRenderingContext2D;
  /** 현재 캔버스 크기 및 해상도 정보 */
  size: CanvasSize;
  /** performance.now() 기준 타임스탬프 (ms) */
  time: number;
  /** 이전 프레임으로부터의 경과 시간 (ms) */
  deltaTime: number;
  /** 루프 시작 이후 누적 프레임 수 */
  frameCount: number;
  /** 현재 마우스/터치 인터랙션 상태 */
  pointer: PointerState;
}

export interface BaseStyleOptions {
  fill?: string | CanvasGradient | CanvasPattern;
  stroke?: string | CanvasGradient | CanvasPattern;
  lineWidth?: number;
  lineDash?: number[];
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  globalAlpha?: number;
}
