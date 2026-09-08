/**
 * @fileoverview timeline/paint-hud.ts
 * 재생 헤드, 두 완료 지점 사이의 Δ 브래킷, 호버 툴팁.
 * 캔버스에는 짧은 수치만 그린다 — 긴 설명은 DOM 스텝 리스트가 담당한다.
 */

import { drawText, drawBadge, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawRoundRect } from '../../primitives/shapes';
import { UI } from './palette';
import { formatMs, formatSpeedup } from './scale';
import type { TimeScale, TimelineCompareSpec, TimelineLayout, TimelineTaskSpec } from './types';

/** 시간 스캔선 + 현재 시각 배지 */
export function paintPlayhead(
  ctx: CanvasRenderingContext2D,
  layout: TimelineLayout,
  scale: TimeScale,
  nowMs: number
): void {
  const x = scale.msToX(nowMs);

  ctx.save();
  ctx.strokeStyle = 'rgba(37, 99, 235, 0.18)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x, layout.guide.top);
  ctx.lineTo(x, layout.guide.bottom);
  ctx.stroke();

  ctx.strokeStyle = UI.playhead;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, layout.guide.top);
  ctx.lineTo(x, layout.guide.bottom);
  ctx.stroke();
  ctx.restore();

  const text = formatMs(nowMs);
  ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
  const width = ctx.measureText(text).width + 14;
  const left = Math.max(
    layout.plotX,
    Math.min(x - width / 2, layout.plotX + layout.plotWidth - width)
  );

  drawBadge(ctx, {
    text,
    x: left,
    y: layout.axis.y,
    fontSize: 10,
    paddingX: 7,
    paddingY: 2,
    radius: 999,
    bg: UI.playhead,
    color: '#ffffff'
  });
}

/** 두 레인의 완료 시점 사이를 잇는 Δ 브래킷 — 절감폭이 곧 결론이다 */
export function paintDeltaBracket(
  ctx: CanvasRenderingContext2D,
  layout: TimelineLayout,
  scale: TimeScale,
  spec: TimelineCompareSpec,
  nowMs: number
): void {
  const { summary } = layout;
  const fastX = scale.msToX(spec.after.completeMs);
  const slowX = scale.msToX(spec.before.completeMs);
  const y = summary.y + 13;
  const settled = nowMs >= Math.max(spec.before.completeMs, spec.after.completeMs);

  ctx.save();
  ctx.globalAlpha = settled ? 1 : 0.35;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(fastX, y - 5);
  ctx.lineTo(fastX, y + 5);
  ctx.moveTo(slowX, y - 5);
  ctx.lineTo(slowX, y + 5);
  ctx.moveTo(fastX, y);
  ctx.lineTo(slowX, y);
  ctx.stroke();
  ctx.restore();

  const deltaMs = Math.max(0, spec.before.metricMs - spec.after.metricMs);
  const speedup = formatSpeedup(spec.before.metricMs, spec.after.metricMs);
  const text = `Δ ${formatMs(deltaMs)} 단축${speedup ? ` · ${speedup}` : ''}`;

  ctx.font = `700 11px ${DEFAULT_FONT_FAMILY}`;
  const width = ctx.measureText(text).width + 18;
  const center = (fastX + slowX) / 2;
  const left = Math.max(
    layout.plotX,
    Math.min(center - width / 2, layout.plotX + layout.plotWidth - width)
  );

  drawBadge(ctx, {
    text,
    x: left,
    y: y + 9,
    fontSize: 11,
    paddingX: 9,
    paddingY: 3,
    radius: 999,
    bg: settled ? '#0f172a' : '#e2e8f0',
    color: settled ? '#f8fafc' : '#64748b'
  });

  const caption = `${spec.metricLabel} · ${formatMs(spec.before.metricMs)} → ${formatMs(spec.after.metricMs)}`;
  ctx.font = `600 10px ${DEFAULT_FONT_FAMILY}`;
  if (layout.density !== 'compact' && ctx.measureText(caption).width < layout.plotWidth - width - 24) {
    drawText(ctx, caption, {
      x: layout.plotX + layout.plotWidth,
      y: y + 20,
      align: 'right',
      fontSize: 10,
      fontWeight: 600,
      color: UI.laneSub
    });
  }
}

/** 호버 툴팁 — 짧은 라벨과 시각 범위만 */
export function paintTooltip(
  ctx: CanvasRenderingContext2D,
  layout: TimelineLayout,
  task: TimelineTaskSpec,
  pointer: { x: number; y: number }
): void {
  const title = task.label;
  const range = `${formatMs(task.startMs)} – ${formatMs(task.startMs + task.durationMs)}`;

  ctx.font = `700 11px ${DEFAULT_FONT_FAMILY}`;
  const titleWidth = ctx.measureText(title).width;
  ctx.font = `600 10px ${DEFAULT_FONT_FAMILY}`;
  const rangeWidth = ctx.measureText(range).width;

  const width = Math.max(titleWidth, rangeWidth) + 20;
  const height = 36;
  const x = Math.max(4, Math.min(pointer.x + 12, layout.width - width - 4));
  const y = Math.max(4, Math.min(pointer.y - height - 8, layout.height - height - 4));

  drawRoundRect(ctx, { x, y, width, height, radius: 8, fill: 'rgba(15, 23, 42, 0.94)' });
  drawText(ctx, title, {
    x: x + 10,
    y: y + 14,
    fontSize: 11,
    fontWeight: 700,
    color: '#f8fafc',
    baseline: 'middle'
  });
  drawText(ctx, range, {
    x: x + 10,
    y: y + 26,
    fontSize: 10,
    fontWeight: 600,
    color: '#94a3b8',
    baseline: 'middle'
  });
}
