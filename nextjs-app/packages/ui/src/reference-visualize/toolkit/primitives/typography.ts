/**
 * @fileoverview Canvas Typography Primitives
 * 텍스트 렌더링, 자동 줄바꿈, 뱃지/라벨 박스 드로잉 함수
 */

import { drawRoundRect } from './shapes';

export const DEFAULT_FONT_FAMILY =
  "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export interface TextOptions {
  x: number;
  y: number;
  font?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  globalAlpha?: number;
}

/** 텍스트 드로잉 */
export function drawText(ctx: CanvasRenderingContext2D, text: string, options: TextOptions): void {
  const {
    x,
    y,
    font,
    fontSize = 12,
    fontWeight = 'normal',
    fontFamily = DEFAULT_FONT_FAMILY,
    color = '#495057',
    align = 'left',
    baseline = 'alphabetic',
    globalAlpha
  } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

  ctx.font = font ?? `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  ctx.fillText(text, x, y);
  ctx.restore();
}

export interface BadgeOptions {
  text: string;
  x: number;
  y: number;
  paddingX?: number;
  paddingY?: number;
  radius?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  border?: string;
  borderWidth?: number;
}

/** 텍스트 너비에 맞춰 자동 조절되는 뱃지/알약 버튼 드로잉 */
export function drawBadge(
  ctx: CanvasRenderingContext2D,
  options: BadgeOptions
): { width: number; height: number } {
  const {
    text,
    x,
    y,
    paddingX = 8,
    paddingY = 4,
    radius = 4,
    bg = '#e7f5ff',
    color = '#1971c2',
    fontSize = 11,
    fontWeight = 600,
    border,
    borderWidth = 1
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const height = fontSize + paddingY * 2;
  const width = textWidth + paddingX * 2;

  drawRoundRect(ctx, {
    x,
    y,
    width,
    height,
    radius,
    fill: bg,
    stroke: border,
    lineWidth: borderWidth
  });

  drawText(ctx, text, {
    x: x + width / 2,
    y: y + height / 2,
    fontSize,
    fontWeight,
    color,
    align: 'center',
    baseline: 'middle'
  });

  ctx.restore();
  return { width, height };
}

/** 주어진 최대 너비(maxWidth)에 맞추어 텍스트를 단어 단위로 자동 줄바꿈 분할 */
export function measureAndWrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font?: string
): string[] {
  if (!text) return [];

  ctx.save();
  if (font) ctx.font = font;

  // 이미 한 줄에 들어가는 경우 바로 반환
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.restore();
    return [text];
  }

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  ctx.restore();
  return lines;
}
