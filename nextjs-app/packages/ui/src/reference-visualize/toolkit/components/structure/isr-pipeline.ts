/**
 * @fileoverview structure/isr-pipeline.ts
 * 방문자 요청 → ISR 캐시 → 원본 서버 3노드. 지금 어떤 경로가 살아 있는지만 강조한다.
 * ISR의 요점은 "응답 경로는 항상 캐시에서 끝나고, 원본 재생성은 그 밖에서 돈다"이므로
 * 두 경로를 다른 굵기·색으로 구분한다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { STRUCTURE_UI } from './frame';
import { HIT_COLOR, REGEN_COLOR, STALE_COLOR } from './isr-track';
import type { Panel } from './types';

export interface PipelineOptions {
  panel: Panel;
  isStale: boolean;
  isRegenerating: boolean;
  /** 방금 요청이 들어온 정도 (0~1) — 응답 경로를 잠깐 밝힌다 */
  requestPulse: number;
}

export function paintIsrPipeline(
  ctx: CanvasRenderingContext2D,
  { panel, isStale, isRegenerating, requestPulse }: PipelineOptions
): void {
  const gap = Math.max(26, panel.width * 0.06);
  const nodeW = (panel.width - gap * 2) / 3;
  const nodeH = panel.height;
  const accent = isRegenerating ? REGEN_COLOR : isStale ? STALE_COLOR : HIT_COLOR;

  const nodes = [
    { title: '방문자 요청', sub: '브라우저', color: '#3b82f6', active: requestPulse > 0 },
    {
      title: 'ISR 캐시',
      sub: isStale ? '구버전 즉시 반환' : '최신 캐시 반환',
      color: accent,
      active: true
    },
    {
      title: '원본 서버',
      sub: isRegenerating ? '재생성 중…' : '대기',
      color: isRegenerating ? REGEN_COLOR : STRUCTURE_UI.faint,
      active: isRegenerating
    }
  ];

  nodes.forEach((node, index) => {
    const x = panel.x + index * (nodeW + gap);
    drawRoundRect(ctx, {
      x,
      y: panel.y,
      width: nodeW,
      height: nodeH,
      radius: 8,
      fill: node.active ? `${node.color}12` : '#f8fafc',
      stroke: node.active ? node.color : STRUCTURE_UI.panelBorder,
      lineWidth: node.active ? 1.8 : 1
    });
    drawText(ctx, node.title, {
      x: x + nodeW / 2,
      y: panel.y + nodeH / 2 - 7,
      align: 'center',
      baseline: 'middle',
      fontSize: 11,
      fontWeight: 700,
      color: node.active ? node.color : STRUCTURE_UI.sub
    });
    drawText(ctx, node.sub, {
      x: x + nodeW / 2,
      y: panel.y + nodeH / 2 + 8,
      align: 'center',
      baseline: 'middle',
      fontSize: 9,
      fontWeight: 600,
      color: STRUCTURE_UI.faint
    });
  });

  const midY = panel.y + nodeH / 2;
  // 응답 경로: 방문자 ↔ 캐시 (항상 살아 있고, 요청 직후 밝아진다)
  paintLink(ctx, panel.x + nodeW, panel.x + nodeW + gap, midY, accent, 1.8 + requestPulse * 1.6, false);
  // 재생성 경로: 캐시 → 원본 (재생성 중일 때만)
  paintLink(
    ctx,
    panel.x + nodeW * 2 + gap,
    panel.x + nodeW * 2 + gap * 2,
    midY,
    isRegenerating ? REGEN_COLOR : '#cbd5e1',
    isRegenerating ? 1.6 : 1,
    !isRegenerating
  );

  ctx.font = `600 9px ${DEFAULT_FONT_FAMILY}`;
  drawText(ctx, '응답 0ms', {
    x: panel.x + nodeW + gap / 2,
    y: midY - 12,
    align: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: accent
  });
  drawText(ctx, isRegenerating ? '백그라운드' : '응답 경로 밖', {
    x: panel.x + nodeW * 2 + gap * 1.5,
    y: midY - 12,
    align: 'center',
    fontSize: 9,
    fontWeight: 600,
    color: isRegenerating ? REGEN_COLOR : STRUCTURE_UI.faint
  });
}

function paintLink(
  ctx: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  y: number,
  color: string,
  lineWidth: number,
  dashed: boolean
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (dashed) ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x0 + 2, y);
  ctx.lineTo(x1 - 6, y);
  ctx.stroke();
  ctx.restore();

  drawLineArrowHead(ctx, x1 - 2, y, 0, color, 4, lineWidth);
}
