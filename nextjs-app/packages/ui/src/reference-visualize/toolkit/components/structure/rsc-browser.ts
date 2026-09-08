/**
 * @fileoverview structure/rsc-browser.ts
 * 스트리밍의 결과를 사용자 눈으로 보여 주는 브라우저 미니 뷰포트.
 * 빈 화면 → 셸 + 스켈레톤 → 청크가 도착한 칸부터 실제 콘텐츠로 교체된다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { STRUCTURE_UI, drawPanel, drawSkeletonLines } from './frame';
import type { BrowserSlotSpec, Panel, SlotState, StreamChunkSpec } from './types';

const FLASH_MS = 260;

export function slotStateAt(
  chunk: StreamChunkSpec | undefined,
  nowMs: number,
  firstPaintMs: number
): SlotState {
  if (nowMs < firstPaintMs) return 'blank';
  if (!chunk) return 'skeleton';
  return nowMs >= chunk.startMs + chunk.durationMs ? 'filled' : 'skeleton';
}

export interface BrowserPaintOptions {
  panel: Panel;
  url: string;
  slots: BrowserSlotSpec[];
  chunks: StreamChunkSpec[];
  firstPaintMs: number;
  nowMs: number;
  timeMs: number;
  hoveredId: string | null;
}

export function paintBrowserViewport(
  ctx: CanvasRenderingContext2D,
  { panel, url, slots, chunks, firstPaintMs, nowMs, timeMs, hoveredId }: BrowserPaintOptions
): void {
  const painted = nowMs >= firstPaintMs;
  drawPanel(ctx, panel, '사용자가 보는 화면', painted ? '' : '아직 빈 화면');

  const inner = { x: panel.x + 10, y: panel.y + 26, width: panel.width - 20, height: panel.height - 36 };

  // 주소 표시줄
  const barH = 20;
  drawRoundRect(ctx, {
    x: inner.x,
    y: inner.y,
    width: inner.width,
    height: barH,
    radius: 5,
    fill: '#f1f5f9',
    stroke: STRUCTURE_UI.panelBorder
  });
  ['#f87171', '#fbbf24', '#4ade80'].forEach((c, i) => {
    drawCircle(ctx, { x: inner.x + 9 + i * 9, y: inner.y + barH / 2, radius: 2.6, fill: c });
  });
  drawText(ctx, url, {
    x: inner.x + 40,
    y: inner.y + barH / 2,
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 500,
    color: STRUCTURE_UI.sub
  });

  const viewport = {
    x: inner.x,
    y: inner.y + barH + 6,
    width: inner.width,
    height: inner.height - barH - 6
  };
  drawRoundRect(ctx, {
    x: viewport.x,
    y: viewport.y,
    width: viewport.width,
    height: viewport.height,
    radius: 5,
    fill: '#ffffff',
    stroke: STRUCTURE_UI.panelBorder
  });

  if (!painted) {
    drawText(ctx, '빈 화면 — 아직 첫 바이트도 도착하지 않았다', {
      x: viewport.x + viewport.width / 2,
      y: viewport.y + viewport.height / 2,
      align: 'center',
      baseline: 'middle',
      fontSize: 9,
      fontWeight: 600,
      color: STRUCTURE_UI.faint
    });
    return;
  }

  // 셸 헤더 (첫 페인트와 함께 등장)
  const headerH = 16;
  drawRoundRect(ctx, {
    x: viewport.x + 6,
    y: viewport.y + 6,
    width: viewport.width - 12,
    height: headerH,
    radius: 4,
    fill: '#dbeafe'
  });
  drawText(ctx, '셸 (layout + page)', {
    x: viewport.x + 12,
    y: viewport.y + 6 + headerH / 2,
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 700,
    color: '#1d4ed8'
  });

  const slotsTop = viewport.y + 6 + headerH + 6;
  const slotGap = 5;
  const slotH = Math.max(20, (viewport.y + viewport.height - 6 - slotsTop - slotGap * (slots.length - 1)) / slots.length);

  slots.forEach((slot, index) => {
    const chunk = chunks.find((c) => c.slot === index);
    const rect: Panel = {
      x: viewport.x + 6,
      y: slotsTop + index * (slotH + slotGap),
      width: viewport.width - 12,
      height: slotH
    };
    paintSlot(ctx, rect, slot, chunk, slotStateAt(chunk, nowMs, firstPaintMs), nowMs, timeMs, hoveredId);
  });
}

function paintSlot(
  ctx: CanvasRenderingContext2D,
  rect: Panel,
  slot: BrowserSlotSpec,
  chunk: StreamChunkSpec | undefined,
  state: SlotState,
  nowMs: number,
  timeMs: number,
  hoveredId: string | null
): void {
  const color = chunk?.color ?? STRUCTURE_UI.faint;
  const isHovered = chunk != null && hoveredId === chunk.id;

  drawRoundRect(ctx, {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    radius: 4,
    fill: state === 'filled' ? `${color}16` : '#f8fafc',
    stroke: isHovered ? color : state === 'filled' ? `${color}66` : STRUCTURE_UI.panelBorder,
    lineWidth: isHovered ? 2 : 1
  });

  const body: Panel = { x: rect.x + 6, y: rect.y + 5, width: rect.width - 12, height: rect.height - 10 };

  if (state !== 'filled') {
    drawSkeletonLines(ctx, body, 2, timeMs);
    return;
  }

  // 도착 직후 짧은 플래시 — "지금 이 칸이 채워졌다"
  const arrivedMs = (chunk?.startMs ?? 0) + (chunk?.durationMs ?? 0);
  const flash = Math.max(0, 1 - (nowMs - arrivedMs) / FLASH_MS);
  if (flash > 0) {
    drawRoundRect(ctx, {
      x: rect.x - 1,
      y: rect.y - 1,
      width: rect.width + 2,
      height: rect.height + 2,
      radius: 5,
      stroke: color,
      lineWidth: 2.5,
      globalAlpha: flash
    });
  }

  // 왼쪽 워터폴 행과 같은 이름을 함께 적어, 색만으로 짐작하지 않아도 되게 한다
  const title = chunk ? `${slot.title} · ${chunk.shortLabel}` : slot.title;
  ctx.font = `700 9px ${DEFAULT_FONT_FAMILY}`;
  drawText(ctx, ctx.measureText(title).width <= body.width ? title : slot.title, {
    x: body.x,
    y: body.y + 6,
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 700,
    color
  });
  paintSlotShape(ctx, body, slot.shape, color);
}

function paintSlotShape(ctx: CanvasRenderingContext2D, body: Panel, shape: BrowserSlotSpec['shape'], color: string): void {
  const top = body.y + 14;
  const h = Math.max(4, body.height - 16);

  if (shape === 'grid') {
    const gap = 4;
    const w = (body.width - gap * 2) / 3;
    for (let i = 0; i < 3; i++) {
      drawRoundRect(ctx, { x: body.x + i * (w + gap), y: top, width: w, height: h, radius: 3, fill: `${color}33` });
    }
    return;
  }

  if (shape === 'list') {
    const rows = Math.max(1, Math.min(2, Math.floor(h / 8)));
    const rowH = h / rows;
    for (let i = 0; i < rows; i++) {
      drawRoundRect(ctx, {
        x: body.x,
        y: top + i * rowH,
        width: body.width * (i % 2 === 0 ? 0.92 : 0.7),
        height: Math.max(3, rowH - 3),
        radius: 2,
        fill: `${color}33`
      });
    }
    return;
  }

  // card — 썸네일 + 텍스트 두 줄
  const thumbW = Math.min(30, body.width * 0.24);
  drawRoundRect(ctx, { x: body.x, y: top, width: thumbW, height: h, radius: 3, fill: `${color}44` });
  const textX = body.x + thumbW + 5;
  const textW = body.width - thumbW - 5;
  drawRoundRect(ctx, { x: textX, y: top, width: textW, height: Math.max(3, h / 2 - 2), radius: 2, fill: `${color}2e` });
  drawRoundRect(ctx, {
    x: textX,
    y: top + h / 2 + 1,
    width: textW * 0.6,
    height: Math.max(3, h / 2 - 3),
    radius: 2,
    fill: `${color}22`
  });
}

/** 캔버스 밖 요약 한 줄에 쓰는 문구 */
export function streamSummary(firstPaintMs: number, chunks: StreamChunkSpec[]): { firstPaint: number; complete: number } {
  const complete = chunks.reduce((max, c) => Math.max(max, c.startMs + c.durationMs), 0);
  return { firstPaint: firstPaintMs, complete };
}

export const RSC_FONT = DEFAULT_FONT_FAMILY;
