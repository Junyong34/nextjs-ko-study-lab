/**
 * @fileoverview timeline/paint-bars.ts
 * 태스크 바 렌더링 — 예정(ghost) → 진행 채움 → 완료의 3단 톤,
 * 블로킹 스트라이프, 유휴 구간의 얇은 레일 표현.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { KIND_PALETTE } from './palette';
import { fitLabel } from './label-fit';
import { taskBandOf } from './layout';
import type { LaneLayout, TimeScale, TimelineLaneSpec } from './types';

export interface TaskPaintOptions {
  scale: TimeScale;
  nowMs: number;
  hoverTaskId: string | null;
  timeMs: number;
}

/** 태스크 바 — 재생 헤드가 지나간 만큼만 진하게 채운다 */
export function paintTasks(
  ctx: CanvasRenderingContext2D,
  lane: TimelineLaneSpec,
  laneLayout: LaneLayout,
  { scale, nowMs, hoverTaskId, timeMs }: TaskPaintOptions
): void {
  const { y, height } = taskBandOf(laneLayout);
  const playheadX = scale.msToX(nowMs);

  lane.tasks.forEach((task, index) => {
    const palette = KIND_PALETTE[task.kind];
    const rawX = scale.msToX(task.startMs);
    const rawEnd = scale.msToX(task.startMs + task.durationMs);
    const x = rawX + 0.75;
    const width = Math.max(3, rawEnd - rawX - 1.5);
    const isHover = hoverTaskId === task.id;
    const isActive = nowMs >= task.startMs && nowMs < task.startMs + task.durationMs;

    // 유휴 구간은 "일이 없다"는 뜻이므로 작업 블록과 같은 무게로 그리지 않는다.
    // 얇은 레일로 낮춰야 양보 레인이 비어 있다는 사실이 한눈에 읽힌다.
    if (task.kind === 'idle') {
      paintIdleRail(ctx, task.label, x, y, width, height, playheadX, isHover, index);
      return;
    }

    drawRoundRect(ctx, { x, y, width, height, radius: 6, fill: palette.ghost });

    // 진행 채움 — 재생 헤드까지만 클리핑
    const filled = Math.min(width, playheadX - x);
    if (filled > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, filled, height);
      ctx.clip();
      drawRoundRect(ctx, { x, y, width, height, radius: 6, fill: palette.fill });
      if (task.kind === 'block') paintBlockingStripes(ctx, x, y, width, height, timeMs);
      ctx.restore();
    }

    drawRoundRect(ctx, {
      x,
      y,
      width,
      height,
      radius: 6,
      stroke: isHover || isActive ? palette.stroke : `${palette.stroke}88`,
      lineWidth: isHover ? 2.4 : isActive ? 2 : 1.2
    });

    const fit = fitLabel(ctx, task.label, width - 6, index);
    if (fit.mode !== 'none') {
      drawText(ctx, fit.text, {
        x: x + width / 2,
        y: y + height / 2,
        align: 'center',
        baseline: 'middle',
        fontSize: fit.fontSize,
        fontWeight: 700,
        color: palette.text
      });
    }
  });
}

/** 유휴 구간 — 가운데 얇은 점선 레일과 라벨만 남긴다 */
function paintIdleRail(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  playheadX: number,
  isHover: boolean,
  index: number
): void {
  const palette = KIND_PALETTE.idle;
  const railY = y + height / 2;

  ctx.save();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = palette.stroke;
  ctx.globalAlpha = isHover ? 0.9 : 0.5;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, railY);
  ctx.lineTo(x + width, railY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 시작·끝 캡
  ctx.globalAlpha = isHover ? 1 : 0.7;
  ctx.fillRect(x, railY - 5, 1.5, 10);
  ctx.fillStyle = palette.stroke;
  ctx.fillRect(x + width - 1.5, railY - 5, 1.5, 10);
  ctx.restore();

  const fit = fitLabel(ctx, label, width - 24, index, [11, 10]);
  if (fit.mode === 'none') return;

  const passed = playheadX >= x;
  ctx.font = `600 ${fit.fontSize}px ${DEFAULT_FONT_FAMILY}`;
  const textWidth = ctx.measureText(fit.text).width;
  const cx = x + width / 2;

  // 레일 위에 라벨을 앉히기 위해 그만큼 지운다
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - textWidth / 2 - 5, railY - 7, textWidth + 10, 14);
  ctx.restore();

  drawText(ctx, fit.text, {
    x: cx,
    y: railY,
    align: 'center',
    baseline: 'middle',
    fontSize: fit.fontSize,
    fontWeight: 600,
    color: passed ? palette.text : palette.stroke
  });
}

function paintBlockingStripes(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  timeMs: number
): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
  ctx.lineWidth = 3;
  const offset = (timeMs / 26) % 18;
  for (let sx = x - height + offset; sx < x + width + height; sx += 18) {
    ctx.beginPath();
    ctx.moveTo(sx, y + height);
    ctx.lineTo(sx + height, y);
    ctx.stroke();
  }
  ctx.restore();
}
