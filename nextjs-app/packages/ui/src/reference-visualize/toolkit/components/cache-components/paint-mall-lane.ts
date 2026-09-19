/**
 * @fileoverview cache-components/paint-mall-lane.ts
 * 레인 하나 — 제목 행, 브라우저→캐시→서버 선, 지금 이동 중인 요청 점, 방금 받은 결과 배지.
 * "점이 어디까지 갔다가 돌아오는가"가 이 데모의 전부다. 캐시에서 되돌아오면 HIT/STALE,
 * 서버까지 가면 EXPIRED/동적 렌더링이다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { RESULT_LABEL } from './mall-model';
import { MALL_COLOR, MALL_TIMING, RESULT_COLOR, travelPose, travelTotalMs } from './paint-mall-helpers';
import { LANE_TITLE, drawCacheNode, drawPill } from './paint-mall-nodes';
import type { LaneGeometry, MallPaintOptions } from './paint-mall-types';

const shortLabel = (result: Parameters<typeof travelPose>[0]['result']) => (result === 'DYNAMIC' ? '서버 렌더' : result);

export function drawLane(ctx: CanvasRenderingContext2D, g: LaneGeometry, o: MallPaintOptions): void {
  const dim = o.hoveredLane !== null && o.hoveredLane !== g.key;
  const hovered = o.hoveredLane === g.key;

  drawRoundRect(ctx, {
    ...g.box,
    radius: 8,
    fill: hovered ? `${MALL_COLOR.browser}08` : MALL_COLOR.lane,
    stroke: hovered ? `${MALL_COLOR.browser}66` : MALL_COLOR.panelBorder,
    lineWidth: 1
  });

  ctx.save();
  ctx.globalAlpha = dim ? 0.35 : 1;
  drawTitleRow(ctx, g, o);
  drawRails(ctx, g, o);
  ctx.restore();

  if (g.cacheBox) drawCacheNode(ctx, g, o, dim);
  else drawNoCacheLabel(ctx, g, dim);

  ctx.save();
  ctx.globalAlpha = dim ? 0.35 : 1;
  o.travels.filter((t) => t.lane === g.key).forEach((t) => drawTravelDot(ctx, t, g, o.timeMs));
  ctx.restore();
}

function drawTitleRow(ctx: CanvasRenderingContext2D, g: LaneGeometry, o: MallPaintOptions): void {
  const title = LANE_TITLE[g.key];
  drawText(ctx, title.name, { x: g.box.x + 10, y: g.titleY, baseline: 'middle', fontSize: 10.5, fontWeight: 800, color: MALL_COLOR.ink });
  ctx.font = '800 10.5px sans-serif';
  const nameW = ctx.measureText(title.name).width;
  const code = g.key === 'shelf' ? `${title.code}${o.sim.shelfLife.code}` : title.code;
  drawText(ctx, code, { x: g.box.x + 10 + nameW + 8, y: g.titleY, baseline: 'middle', fontSize: 9, fontWeight: 600, color: MALL_COLOR.sub, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' });

  const last = o.lastResults?.[g.key];
  if (last) drawPill(ctx, g.box.x + g.box.width - 8, g.titleY, `최근 ${RESULT_LABEL[last]}`, RESULT_COLOR[last], { align: 'right' });
}

/** 브라우저→캐시 실선(응답 경로), 캐시→서버 점선(재생성 경로). 장바구니는 서버까지 실선 하나 */
function drawRails(ctx: CanvasRenderingContext2D, g: LaneGeometry, o: MallPaintOptions): void {
  const y = g.lineY;
  if (!g.cacheBox) {
    rail(ctx, g.x0, g.x1, y, MALL_COLOR.panelBorder, 1.4, false);
    drawLineArrowHead(ctx, g.x1 - 1, y, 0, MALL_COLOR.faint, 4, 1.3);
    return;
  }
  const cl = g.cacheBox.x;
  const cr = g.cacheBox.x + g.cacheBox.width;
  rail(ctx, g.x0, cl, y, MALL_COLOR.panelBorder, 1.4, false);
  drawLineArrowHead(ctx, cl - 1, y, 0, MALL_COLOR.faint, 4, 1.3);

  const entry = g.key === 'shelf' ? o.sim.shelf : o.sim.product;
  const regenerating = entry.regenUntilSec !== null;
  const blocking = entry.regenMode === 'blocking';
  const regenColor = !regenerating ? MALL_COLOR.panelBorder : blocking ? MALL_COLOR.expired : MALL_COLOR.regen;
  rail(ctx, cr, g.x1, y, regenColor, regenerating ? 1.8 : 1.2, true, regenerating ? (o.timeMs / 40) % 16 : 0);
  drawText(ctx, !regenerating ? '재생성 경로 (평소엔 쓰지 않음)' : blocking ? '요청이 기다리는 재생성 →' : '백그라운드 재생성 →', {
    x: (cr + g.x1) / 2,
    y: y - 11,
    align: 'center',
    baseline: 'middle',
    fontSize: 8,
    fontWeight: 700,
    color: regenerating ? regenColor : MALL_COLOR.faint
  });
  if (regenerating && !blocking) {
    const t = ((o.timeMs / 900) % 1);
    const px = cr + (g.x1 - cr) * t;
    drawCircle(ctx, { x: px, y, radius: 3, fill: MALL_COLOR.regen });
  }
}

function rail(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, color: string, lineWidth: number, dashed: boolean, dashOffset = 0): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (dashed) {
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -dashOffset;
  }
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.restore();
}

function drawNoCacheLabel(ctx: CanvasRenderingContext2D, g: LaneGeometry, dim: boolean): void {
  ctx.save();
  ctx.globalAlpha = dim ? 0.35 : 1;
  const cx = (g.x0 + g.x1) / 2;
  drawPill(ctx, cx, g.lineY, '캐시 없음 · 매번 서버 렌더', MALL_COLOR.dynamic, { align: 'center' });
  drawText(ctx, '요청마다 다른 사용자 → 저장할 수 없다', { x: cx, y: g.lineY + 17, align: 'center', baseline: 'middle', fontSize: 8, fontWeight: 600, color: MALL_COLOR.faint });
  ctx.restore();
}

/** 이동 중인 요청 점과, 돌아온 뒤 브라우저 옆에 잠깐 남는 결과 배지 */
function drawTravelDot(ctx: CanvasRenderingContext2D, travel: Parameters<typeof travelPose>[0], g: LaneGeometry, timeMs: number): void {
  const total = travelTotalMs(travel.result, g);
  const elapsed = timeMs - travel.startMs;
  const y = g.lineY;

  if (elapsed <= total) {
    const pose = travelPose(travel, g, timeMs);
    if (pose.waiting) {
      const r = 6 + Math.sin(timeMs / 90) * 1.5;
      drawCircle(ctx, { x: pose.x, y, radius: r + 4, stroke: `${pose.color}55`, lineWidth: 1.5 });
      drawCircle(ctx, { x: pose.x, y, radius: 5.5, fill: pose.color });
      drawText(ctx, travel.result === 'DYNAMIC' ? '서버에서 렌더링 중' : '새 값 만드는 중 (대기)', { x: pose.x - 12, y: y + 16, align: 'right', baseline: 'middle', fontSize: 8, fontWeight: 700, color: pose.color });
    } else {
      drawCircle(ctx, { x: pose.x, y, radius: 5.5, fill: pose.color, stroke: '#ffffff', lineWidth: 1.5 });
      if (pose.returning) {
        const tag = travel.versionLabel ? `${shortLabel(travel.result)} · ${travel.versionLabel}` : shortLabel(travel.result);
        // 돌아오는 길(왼쪽으로 이동)이므로 칩은 점의 오른쪽 뒤에 끌려간다 — 캐시 노드를 덮지 않는다
        drawPill(ctx, pose.x + 10, y - 13, tag, pose.color, { filled: true });
      }
    }
    return;
  }

  const since = elapsed - total;
  if (since > MALL_TIMING.resultBadgeMs) return;
  const alpha = since > MALL_TIMING.resultBadgeMs - 400 ? (MALL_TIMING.resultBadgeMs - since) / 400 : 1;
  const tag = travel.versionLabel ? `${shortLabel(travel.result)} · ${travel.versionLabel} 받음` : shortLabel(travel.result);
  drawPill(ctx, g.x0 + 6, y - 13, tag, RESULT_COLOR[travel.result], { filled: true, alpha });
}
