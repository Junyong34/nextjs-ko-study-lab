/**
 * @fileoverview timeline/paint-track.ts
 * 시간 축과 눈금, 레인 제목/상태 칩, 완료 깃발. 태스크 바 자체는 paint-bars.ts가 그린다.
 */

import { drawText, drawBadge, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { KIND_PALETTE, UI } from './palette';
import { taskBandOf } from './layout';
import { drawLineArrowHead } from './arrow-head';
import { formatMs, niceTicks, tickCountFor } from './scale';
import type {
  LaneLayout,
  LaneRuntimeState,
  TimeScale,
  TimelineLaneSpec,
  TimelineLayout
} from './types';

/** 시간 축 눈금과 세로 가이드선 */
export function paintAxis(ctx: CanvasRenderingContext2D, layout: TimelineLayout, scale: TimeScale): void {
  const ticks = niceTicks(scale.totalMs, tickCountFor(layout.density));
  const labelY = layout.axis.y + 11;
  let lastLabelRight = -Infinity;

  ctx.save();
  ctx.font = `500 10px ${DEFAULT_FONT_FAMILY}`;

  ticks.forEach((ms, index) => {
    const x = scale.msToX(ms);

    ctx.strokeStyle = UI.guide;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, layout.guide.top);
    ctx.lineTo(Math.round(x) + 0.5, layout.guide.bottom);
    ctx.stroke();

    const text = formatMs(ms);
    const width = ctx.measureText(text).width;
    const isLast = index === ticks.length - 1;
    const align: CanvasTextAlign = index === 0 ? 'left' : isLast ? 'right' : 'center';
    const left = align === 'left' ? x : align === 'right' ? x - width : x - width / 2;

    // 라벨끼리 붙으면 그리지 않는다 (마지막 눈금은 항상 유지)
    if (left < lastLabelRight + 8 && !isLast) return;
    lastLabelRight = left + width;

    drawText(ctx, text, { x, y: labelY, align, fontSize: 10, fontWeight: 500, color: UI.axisText });
  });

  ctx.restore();
}

export interface LaneHeaderOptions {
  state: LaneRuntimeState;
  metricLabel: string;
  compact: boolean;
}

/** 레인 제목 + 상태 칩 + 실시간 대기 카운터 */
export function paintLaneHeader(
  ctx: CanvasRenderingContext2D,
  lane: TimelineLaneSpec,
  laneLayout: LaneLayout,
  { state, metricLabel, compact }: LaneHeaderOptions
): void {
  const { header } = laneLayout;
  const baseY = header.y + header.height - 5;
  const isBefore = lane.variant === 'before';
  const titleSize = compact ? 11 : 12.5;
  const title = `${isBefore ? '🔒' : '⚡'} ${lane.title}`;

  drawText(ctx, title, {
    x: header.x,
    y: baseY,
    fontSize: titleSize,
    fontWeight: 700,
    color: UI.laneTitle
  });

  ctx.font = `700 ${titleSize}px ${DEFAULT_FONT_FAMILY}`;
  const titleRight = header.x + ctx.measureText(title).width;

  const waiting = state.queued.length;
  const chipText = waiting > 0 ? `대기 ${waiting}` : state.isComplete ? '완료' : lane.statusLabel;
  const chipTone = waiting > 0 ? 'block' : state.isComplete ? 'render' : isBefore ? 'block' : 'work';
  const tone = KIND_PALETTE[chipTone as keyof typeof KIND_PALETTE];

  ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
  const chipWidth = ctx.measureText(chipText).width + 14;
  drawBadge(ctx, {
    text: chipText,
    x: header.x + header.width - chipWidth,
    y: header.y + 1,
    fontSize: 10,
    paddingX: 7,
    paddingY: 2,
    radius: 999,
    bg: tone.ghost,
    color: tone.text,
    border: tone.stroke
  });

  // 완료 뒤에는 이 레인의 결론 수치를, 그 전에는 실시간 최대 대기를 보여준다
  const text = state.isComplete
    ? `${metricLabel} ${formatMs(lane.metricMs)}`
    : state.maxWaitMs > 0
      ? `대기 ${formatMs(state.maxWaitMs)}`
      : '';
  if (compact || !text) return;

  ctx.font = `600 10px ${DEFAULT_FONT_FAMILY}`;
  const right = header.x + header.width - chipWidth - 10;
  // 제목과 붙을 것 같으면 그리지 않는다 — 겹치느니 비운다
  if (right - ctx.measureText(text).width > titleRight + 12) {
    drawText(ctx, text, {
      x: right,
      y: baseY,
      align: 'right',
      fontSize: 10,
      fontWeight: 600,
      color: state.isComplete ? (isBefore ? '#b91c1c' : '#15803d') : UI.laneSub
    });
  }
}

/**
 * 완료 깃발 — 재생 헤드가 completeMs를 지나면 고정된다.
 * 시각 수치는 요약 스트립의 Δ 브래킷이 표시하므로 여기서는 텍스트를 그리지 않는다(겹침 방지).
 */
export function paintCompletionFlag(
  ctx: CanvasRenderingContext2D,
  lane: TimelineLaneSpec,
  laneLayout: LaneLayout,
  scale: TimeScale,
  nowMs: number
): void {
  if (nowMs < lane.completeMs) return;
  const x = scale.msToX(lane.completeMs);
  const band = taskBandOf(laneLayout);
  const top = band.y - 4;
  const bottom = band.y + band.height + 3;
  const flipped = x + 8 > scale.plotX + scale.plotWidth;

  ctx.save();
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = UI.flag;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  // 깃대 끝 마커 — 채운 삼각형 대신 짧은 획 + 작은 선 화살촉
  const dir = flipped ? -1 : 1;
  const tipX = x + 6 * dir;
  const tipY = top + 4.5;
  ctx.strokeStyle = UI.flag;
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, tipY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.restore();

  drawLineArrowHead(ctx, tipX, tipY, flipped ? Math.PI : 0, UI.flag);
}
