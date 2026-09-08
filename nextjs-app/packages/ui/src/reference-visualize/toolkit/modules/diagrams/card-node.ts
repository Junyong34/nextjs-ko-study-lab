/**
 * @fileoverview Card Node Module
 * 시스템 구조도, 아키텍처 다이어그램의 박스 노드 렌더링 모듈
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, measureAndWrapText } from '../../primitives/typography';
import type { Bounds } from '../../core/types';

export interface CardNodeOptions {
  bounds: Bounds;
  title: string;
  subtitle?: string;
  radius?: number;
  bg?: string;
  border?: string;
  borderWidth?: number;
  titleColor?: string;
  titleSize?: number;
  subtitleColor?: string;
  subtitleSize?: number;
  align?: CanvasTextAlign;
}

/** 다이어그램용 카드 노드 드로잉 */
export function drawCardNode(ctx: CanvasRenderingContext2D, options: CardNodeOptions): void {
  const {
    bounds,
    title,
    subtitle,
    radius = 6,
    bg = '#f8f9fa',
    border = '#dee2e6',
    borderWidth = 1.2,
    titleColor = '#212529',
    titleSize = 13,
    subtitleColor = '#868e96',
    subtitleSize = 10,
    align = 'center'
  } = options;

  // 1. 카드 박스
  drawRoundRect(ctx, {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    radius,
    fill: bg,
    stroke: border,
    lineWidth: borderWidth
  });

  // 2. 텍스트 위치 계산
  const textX =
    align === 'center'
      ? bounds.x + bounds.width / 2
      : align === 'left'
        ? bounds.x + 12
        : bounds.x + bounds.width - 12;

  const centerY = bounds.y + bounds.height / 2;

  if (subtitle) {
    drawText(ctx, title, {
      x: textX,
      y: centerY - 6,
      fontSize: titleSize,
      fontWeight: 700,
      color: titleColor,
      align,
      baseline: 'middle'
    });

    const wrappedLines = measureAndWrapText(ctx, subtitle, bounds.width - 16);
    if (wrappedLines.length > 0) {
      drawText(ctx, wrappedLines[0], {
        x: textX,
        y: centerY + 10,
        fontSize: subtitleSize,
        fontWeight: 400,
        color: subtitleColor,
        align,
        baseline: 'middle'
      });
    }
  } else {
    drawText(ctx, title, {
      x: textX,
      y: centerY,
      fontSize: titleSize,
      fontWeight: 700,
      color: titleColor,
      align,
      baseline: 'middle'
    });
  }
}
