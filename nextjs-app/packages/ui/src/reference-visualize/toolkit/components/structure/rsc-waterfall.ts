/**
 * @fileoverview structure/rsc-waterfall.ts
 * 서버가 청크를 flush 하는 워터폴. 막대 길이만으로 끝내지 않고
 * 각 청크의 **도착 시각**을 숫자로 남겨, "무엇이 언제 왔는가"가 정지 화면에서도 읽히게 한다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { fitLabel } from '../timeline/label-fit';
import { formatMs } from '../timeline/scale';
import { STRUCTURE_UI, drawPanel } from './frame';
import type { Panel, StreamChunkSpec } from './types';

export interface WaterfallGeometry {
  trackX: number;
  trackW: number;
  rowsTop: number;
  rowH: number;
  labelX: number;
  labelW: number;
}

export function waterfallGeometry(panel: Panel, rowCount: number): WaterfallGeometry {
  const labelX = panel.x + 10;
  const labelW = Math.max(64, Math.min(112, panel.width * 0.3));
  const trackX = labelX + labelW + 8;
  return {
    labelX,
    labelW,
    trackX,
    trackW: Math.max(60, panel.x + panel.width - 12 - trackX),
    rowsTop: panel.y + 40,
    rowH: Math.max(18, (panel.height - 50) / rowCount)
  };
}

export interface WaterfallPaintOptions {
  panel: Panel;
  chunks: StreamChunkSpec[];
  totalMs: number;
  firstPaintMs: number;
  nowMs: number;
  hoveredId: string | null;
}

export function paintWaterfall(
  ctx: CanvasRenderingContext2D,
  { panel, chunks, totalMs, firstPaintMs, nowMs, hoveredId }: WaterfallPaintOptions
): void {
  const geo = waterfallGeometry(panel, chunks.length);
  const toX = (ms: number) => geo.trackX + (Math.max(0, Math.min(totalMs, ms)) / totalMs) * geo.trackW;
  const arrived = chunks.filter((c) => nowMs >= c.startMs + c.durationMs).length;

  drawPanel(ctx, panel, '서버 → 브라우저 청크 flush', `도착 ${arrived}/${chunks.length}`);

  // 시간 눈금
  ctx.font = `500 9px ${DEFAULT_FONT_FAMILY}`;
  const step = totalMs / 4;
  for (let i = 0; i <= 4; i++) {
    const ms = step * i;
    const x = toX(ms);
    ctx.strokeStyle = STRUCTURE_UI.guide;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, geo.rowsTop - 4);
    ctx.lineTo(Math.round(x) + 0.5, panel.y + panel.height - 10);
    ctx.stroke();
    drawText(ctx, formatMs(ms), {
      x,
      y: geo.rowsTop - 10,
      align: i === 0 ? 'left' : i === 4 ? 'right' : 'center',
      fontSize: 9,
      fontWeight: 500,
      color: STRUCTURE_UI.faint
    });
  }

  paintFirstPaintLine(ctx, panel, geo, toX(firstPaintMs), firstPaintMs, nowMs);

  chunks.forEach((chunk, index) => {
    const rowY = geo.rowsTop + index * geo.rowH;
    const barH = Math.min(14, geo.rowH - 6);
    const barY = rowY + (geo.rowH - barH) / 2;
    const x0 = toX(chunk.startMs);
    const endMs = chunk.startMs + chunk.durationMs;
    const fullW = Math.max(3, toX(endMs) - x0);
    const progress = Math.max(0, Math.min(1, (nowMs - chunk.startMs) / chunk.durationMs));
    const isHovered = hoveredId === chunk.id;

    if (isHovered) {
      drawRoundRect(ctx, {
        x: geo.labelX - 4,
        y: rowY + 1,
        width: panel.x + panel.width - 8 - geo.labelX,
        height: geo.rowH - 2,
        radius: 5,
        fill: '#f1f5f9'
      });
    }

    // 좌측 라벨 — 폭이 부족하면 축약하고, 파일 경로는 DOM이 담당한다
    const fit = fitLabel(ctx, chunk.shortLabel, geo.labelW, index, [11, 10, 9]);
    if (fit.mode !== 'none') {
      drawText(ctx, fit.text, {
        x: geo.labelX,
        y: rowY + geo.rowH / 2,
        baseline: 'middle',
        fontSize: fit.fontSize,
        fontWeight: 700,
        color: progress > 0 ? chunk.color : STRUCTURE_UI.faint
      });
    }

    // 예정 구간(점선) → 진행 채움
    drawRoundRect(ctx, {
      x: x0,
      y: barY,
      width: fullW,
      height: barH,
      radius: barH / 2,
      stroke: `${chunk.color}55`,
      lineWidth: 1,
      lineDash: [3, 3]
    });
    if (progress > 0) {
      drawRoundRect(ctx, {
        x: x0,
        y: barY,
        width: Math.max(3, fullW * progress),
        height: barH,
        radius: barH / 2,
        fill: chunk.color,
        globalAlpha: chunk.kind === 'shell' ? 1 : 0.9
      });
    }

    // 도착 시각 — 이 데모의 결론 수치
    if (progress >= 1) {
      const text = formatMs(endMs);
      ctx.font = `700 9px ${DEFAULT_FONT_FAMILY}`;
      const w = ctx.measureText(text).width;
      const right = panel.x + panel.width - 10;
      const outside = x0 + fullW + 5 + w <= right;
      drawText(ctx, text, {
        x: outside ? x0 + fullW + 5 : x0 + fullW - 5,
        y: barY + barH / 2,
        align: outside ? 'left' : 'right',
        baseline: 'middle',
        fontSize: 9,
        fontWeight: 700,
        color: outside ? chunk.color : '#ffffff'
      });
    }
  });
}

function paintFirstPaintLine(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  geo: WaterfallGeometry,
  x: number,
  firstPaintMs: number,
  nowMs: number
): void {
  const top = geo.rowsTop - 4;
  const bottom = panel.y + panel.height - 10;

  ctx.save();
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = nowMs >= firstPaintMs ? '#16a34a' : '#cbd5e1';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
  ctx.restore();

  const text = `첫 페인트 ${formatMs(firstPaintMs)}`;
  ctx.font = `700 9px ${DEFAULT_FONT_FAMILY}`;
  const w = ctx.measureText(text).width;
  const fits = x + 4 + w < panel.x + panel.width - 8;
  drawText(ctx, text, {
    x: fits ? x + 4 : x - 4,
    y: bottom + 6,
    align: fits ? 'left' : 'right',
    fontSize: 9,
    fontWeight: 700,
    color: nowMs >= firstPaintMs ? '#16a34a' : STRUCTURE_UI.faint
  });
}

/** 워터폴 행 위 포인터가 어떤 청크에 있는지 */
export function hitTestWaterfall(
  panel: Panel,
  chunks: StreamChunkSpec[],
  pointer: { x: number; y: number; isInside: boolean }
): string | null {
  if (!pointer.isInside) return null;
  if (pointer.x < panel.x || pointer.x > panel.x + panel.width) return null;
  const geo = waterfallGeometry(panel, chunks.length);
  const index = Math.floor((pointer.y - geo.rowsTop) / geo.rowH);
  if (index < 0 || index >= chunks.length) return null;
  return chunks[index].id;
}
