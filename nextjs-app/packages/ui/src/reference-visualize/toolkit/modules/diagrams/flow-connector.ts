/**
 * @fileoverview Flow Connector Module
 * 다이어그램 요소 간의 흐름선, 화살표 및 애니메이션 점선 연결 모듈
 */

import { drawArrow, drawLine } from '../../primitives/lines';
import type { Point, BaseStyleOptions } from '../../core/types';

export interface FlowConnectorOptions extends BaseStyleOptions {
  from: Point | [number, number];
  to: Point | [number, number];
  animated?: boolean;
  flowOffset?: number; // time 기반 대시 오프셋
  arrow?: boolean;
  arrowSize?: number;
}

/** 노드 간 연결선 드로잉 */
export function drawFlowConnector(
  ctx: CanvasRenderingContext2D,
  options: FlowConnectorOptions
): void {
  const {
    from,
    to,
    animated = false,
    flowOffset = 0,
    arrow = true,
    arrowSize = 8,
    stroke = '#adb5bd',
    lineWidth = 1.5,
    globalAlpha
  } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

  if (animated) {
    ctx.lineDashOffset = -flowOffset;
    ctx.setLineDash([6, 4]);
  }

  if (arrow) {
    drawArrow(ctx, {
      from,
      to,
      stroke,
      fill: stroke,
      lineWidth,
      arrowSize,
      lineDash: animated ? [6, 4] : undefined
    });
  } else {
    drawLine(ctx, {
      from,
      to,
      stroke,
      lineWidth,
      lineDash: animated ? [6, 4] : undefined
    });
  }

  ctx.restore();
}
