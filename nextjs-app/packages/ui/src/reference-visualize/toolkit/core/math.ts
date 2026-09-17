/**
 * @fileoverview Canvas Toolkit Math Utilities
 * 캔버스 애니메이션, 기하 변환, 이징 및 수치 보간 함수 모음
 */

import type { Point } from './types';

/** 값을 min과 max 사이로 제한 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** 선형 보간 (Linear Interpolation) */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** 범위를 다른 범위로 매핑 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

/** 도(degrees)를 라디안(radians)으로 변환 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 라디안(radians)을 도(degrees)로 변환 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** 극좌표 (반지름, 각도) -> 직교좌표 (x, y) 변환 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleRad: number
): Point {
  return {
    x: centerX + Math.cos(angleRad) * radius,
    y: centerY + Math.sin(angleRad) * radius
  };
}

/** 지수적 점진 접근 (목표값으로 부드럽게 감속 추적) */
export function expApproach(current: number, target: number, speedCoeff: number, dtSeconds: number): number {
  return current + (target - current) * (1 - Math.exp(-speedCoeff * dtSeconds));
}

/** 일반적인 이징(Easing) 함수 모음 (0 <= t <= 1) */
export const easing = {
  linear: (t: number): number => clamp(t, 0, 1),
  easeInQuad: (t: number): number => {
    const c = clamp(t, 0, 1);
    return c * c;
  },
  easeOutQuad: (t: number): number => {
    const c = clamp(t, 0, 1);
    return c * (2 - c);
  },
  easeInOutQuad: (t: number): number => {
    const c = clamp(t, 0, 1);
    return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c;
  },
  easeOutCubic: (t: number): number => {
    const c = clamp(t, 0, 1);
    return 1 - Math.pow(1 - c, 3);
  },
  easeOutBack: (t: number, s = 1.70158): number => {
    const c = clamp(t, 0, 1) - 1;
    return c * c * ((s + 1) * c + s) + 1;
  }
};
