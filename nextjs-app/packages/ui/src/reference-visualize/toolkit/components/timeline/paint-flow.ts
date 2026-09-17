/**
 * @fileoverview timeline/paint-flow.ts
 * "왜 빨라지는가"를 보여주는 흐름 레이어 —
 * 이벤트 도착 → 대기 큐 적체 → 처리, 대기 지연 막대, 양보(⚡) 스파크, 다음 청크 예약 아크.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { KIND_PALETTE, waitColor } from './palette';
import { eventRowHeight, taskBandOf, ARC_BAND } from './layout';
import { formatMs } from './scale';
import { arriveRise, handledPop, type YieldSignal } from './simulate';
import { drawLineArrowHead } from './arrow-head';
import type { Density, EventRowMap, LaneLayout, TimeScale, TimelineLaneSpec } from './types';

export interface FlowPaintOptions {
  scale: TimeScale;
  nowMs: number;
  totalMs: number;
  rows: EventRowMap;
  density: Density;
  timeMs: number;
}

/**
 * 이벤트 하나하나가 언제 도착해서 언제 처리됐는지를 그린다.
 * 대기 중인 이벤트는 재생 헤드를 따라 막대가 계속 자라고, 처리되는 순간 팝 링과 함께 멈춘다.
 */
export function paintEventFlow(
  ctx: CanvasRenderingContext2D,
  lane: TimelineLaneSpec,
  laneLayout: LaneLayout,
  { scale, nowMs, totalMs, rows, density, timeMs }: FlowPaintOptions
): void {
  const rowH = eventRowHeight(density);
  const rowRight: Record<number, number> = {};
  const nowX = scale.msToX(nowMs);
  const plotRight = scale.plotX + scale.plotWidth;
  const events = [...lane.events].sort((a, b) => a.arriveMs - b.arriveMs);

  for (const event of events) {
    if (nowMs < event.arriveMs) continue;

    const row = rows[event.id] ?? 0;
    const centerY = laneLayout.flow.y + 5 + row * rowH + rowH / 2;
    const rise = arriveRise(event.arriveMs, nowMs, totalMs);
    const y = centerY + rise * 9;
    const alpha = 1 - rise * 0.75;

    const arriveX = scale.msToX(event.arriveMs);
    const handledX = scale.msToX(event.handledMs);
    const isWaiting = nowMs < event.handledMs;
    const endX = Math.max(arriveX + 3, Math.min(nowX, handledX));
    const waitedMs = isWaiting ? nowMs - event.arriveMs : event.handledMs - event.arriveMs;
    const color = waitColor(waitedMs);

    ctx.save();
    ctx.globalAlpha = alpha;

    // 도착 시각 눈금
    ctx.fillStyle = KIND_PALETTE[event.kind === 'input' ? 'input' : 'render'].stroke;
    ctx.fillRect(arriveX - 0.75, y - 5, 1.5, 10);

    // 대기 지연 막대 — 대기 중에는 재생 헤드를 따라 계속 자란다
    drawRoundRect(ctx, {
      x: arriveX,
      y: y - 2.5,
      width: endX - arriveX,
      height: 5,
      radius: 999,
      fill: color,
      globalAlpha: isWaiting ? 0.55 + 0.25 * Math.sin(timeMs / 130) : 0.95
    });

    if (isWaiting) {
      // 아직 큐에 있는 이벤트 — 막대 끝에서 맥동한다
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(endX, y, 3.4 + Math.sin(timeMs / 130) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const pop = handledPop(event.handledMs, nowMs, totalMs);
      if (pop > 0) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * pop;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(handledX, y, 4 + (1 - pop) * 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = alpha;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(handledX, y, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (density === 'compact') continue;

    // 처리 완료 후 대기 시간 라벨 — 같은 행의 앞 라벨과 겹치면 그리지 않는다
    const text = `${event.label} ${waitedMs <= 0 ? '0ms' : formatMs(waitedMs)}`;
    ctx.font = `600 10px ${DEFAULT_FONT_FAMILY}`;
    const width = ctx.measureText(text).width;
    const labelX = endX + 7;
    if (labelX > (rowRight[row] ?? -Infinity) && labelX + width < plotRight) {
      drawText(ctx, text, {
        x: labelX,
        y,
        baseline: 'middle',
        fontSize: 10,
        fontWeight: 600,
        color: isWaiting ? color : '#475569',
        globalAlpha: alpha
      });
      rowRight[row] = labelX + width + 6;
    }
  }
}

/** 제어권 양보 순간의 ⚡ 스파크 — 지나간 자리에는 옅은 표식이 남는다 */
export function paintYieldSparks(
  ctx: CanvasRenderingContext2D,
  laneLayout: LaneLayout,
  scale: TimeScale,
  signals: YieldSignal[]
): void {
  const band = taskBandOf(laneLayout);

  for (const signal of signals) {
    if (!signal.passed) continue;
    const x = scale.msToX(signal.atMs);

    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.globalAlpha = 0.25 + signal.spark * 0.65;
    ctx.lineWidth = signal.spark > 0 ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.moveTo(x, band.y - 3);
    ctx.lineTo(x, band.y + band.height + 3);
    ctx.stroke();

    if (signal.spark > 0) {
      ctx.globalAlpha = signal.spark;
      drawText(ctx, '⚡', {
        x,
        y: band.y - 6,
        align: 'center',
        baseline: 'bottom',
        fontSize: 11 + signal.spark * 3,
        color: '#f59e0b'
      });
    }
    ctx.restore();
  }
}

/** 남은 작업이 다음 태스크로 예약되는 흐름 — 점선 아크 위를 파티클이 이동한다 */
export function paintScheduleArcs(
  ctx: CanvasRenderingContext2D,
  laneLayout: LaneLayout,
  scale: TimeScale,
  signals: YieldSignal[]
): void {
  const baseY = laneLayout.bar.y + ARC_BAND;
  const apexY = laneLayout.bar.y + 1;

  for (const signal of signals) {
    if (!signal.passed || signal.resumeMs <= signal.atMs) continue;
    const x0 = scale.msToX(signal.atMs);
    const x1 = scale.msToX(signal.resumeMs);
    if (x1 - x0 < 6) continue;
    const cx = (x0 + x1) / 2;

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#94a3b8';
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, baseY);
    ctx.quadraticCurveTo(cx, apexY, x1, baseY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 곡선 끝의 진행 방향 — 곡선 접선을 따라가는 작은 선 화살촉
    drawLineArrowHead(ctx, x1, baseY, Math.atan2(baseY - apexY, x1 - cx), '#94a3b8', 3.6, 1.1);

    if (signal.particleT > 0 && signal.particleT < 1) {
      const t = signal.particleT;
      const inv = 1 - t;
      const px = inv * inv * x0 + 2 * inv * t * cx + t * t * x1;
      const py = inv * inv * baseY + 2 * inv * t * apexY + t * t * baseY;
      ctx.globalAlpha = Math.sin(t * Math.PI);
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
