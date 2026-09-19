/**
 * @fileoverview cache-components/paint-mall.ts
 * "스터디몰" 요청 추적도의 진입점 — 브라우저(왼쪽) → 레인 3개 → 원본 서버(오른쪽) 배치.
 *
 * 페이지 요청 한 번에 점 3개가 같은 순간 출발해 레인마다 다른 거리를 갔다 온다.
 * 캐시 노드에서 되돌아오면 HIT/STALE, 서버까지 다녀오면 EXPIRED/동적 렌더링 — 이 차이가 곧 개념이다.
 * 실제 그림은 `paint-mall-nodes.ts`(노드)와 `paint-mall-lane.ts`(레인)에 있다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText } from '../../primitives/typography';
import { LANE_KEYS, type LaneKey } from './mall-model';
import { MALL_COLOR, MALL_TIMING } from './paint-mall-helpers';
import { drawLane } from './paint-mall-lane';
import { drawBrowserNode, drawServerNode } from './paint-mall-nodes';
import type { Box, LaneGeometry, MallPaintOptions } from './paint-mall-types';

export { MALL_TIMING, RESULT_COLOR } from './paint-mall-helpers';
export type { AdminPulse, LaneTravel, MallPaintOptions, SaveFlash } from './paint-mall-types';

const PAD = 12;
const NODE_W = 84;
const NODE_GAP = 14;
const LANE_GAP = 8;
const HEADER_H = 18;

/** 레인 좌표계 — DOM 쪽(호버 판정)과 캔버스가 같은 계산을 쓴다 */
export function mallLayout(width: number, height: number): { browser: Box; server: Box; lanes: LaneGeometry[] } {
  const top = PAD + HEADER_H;
  const bottom = height - PAD;
  const browser: Box = { x: PAD, y: top, width: NODE_W, height: bottom - top };
  const server: Box = { x: width - PAD - NODE_W, y: top, width: NODE_W, height: bottom - top };
  const laneX = browser.x + browser.width + NODE_GAP;
  const laneW = server.x - NODE_GAP - laneX;
  const laneH = (bottom - top - LANE_GAP * 2) / 3;
  const cacheW = Math.min(196, Math.max(150, laneW * 0.38));

  const lanes = LANE_KEYS.map((key: LaneKey, i): LaneGeometry => {
    const y = top + i * (laneH + LANE_GAP);
    const box: Box = { x: laneX, y, width: laneW, height: laneH };
    const lineY = y + laneH * 0.62;
    const cacheBox: Box | null =
      key === 'cart' ? null : { x: laneX + laneW * 0.44 - cacheW / 2, y: lineY - 24, width: cacheW, height: 48 };
    return { key, titleY: y + 13, lineY, box, x0: laneX, x1: laneX + laneW, cacheBox };
  });
  return { browser, server, lanes };
}

export function paintMall(ctx: CanvasRenderingContext2D, o: MallPaintOptions): void {
  const { browser, server, lanes } = mallLayout(o.width, o.height);

  drawText(ctx, '한 번의 페이지 요청이 세 구역을 동시에 지난다 — 어디서 응답이 돌아오는지를 본다', {
    x: PAD,
    y: PAD + 4,
    baseline: 'middle',
    fontSize: 9.5,
    fontWeight: 600,
    color: MALL_COLOR.sub
  });
  drawText(ctx, `시뮬레이션 ${o.sim.nowSec.toFixed(1)}s`, {
    x: o.width - PAD,
    y: PAD + 4,
    align: 'right',
    baseline: 'middle',
    fontSize: 9.5,
    fontWeight: 600,
    color: MALL_COLOR.faint
  });

  drawBrowserNode(ctx, browser, o);
  drawServerNode(ctx, server, o);
  lanes.forEach((g) => drawLane(ctx, g, o));

  // 관리자 펄스 — 서버에서 상품 캐시 노드로 태그 갱신이 도달하는 짧은 순간
  if (o.adminPulse) drawAdminPulse(ctx, lanes[1], server, o);
}

function drawAdminPulse(ctx: CanvasRenderingContext2D, product: LaneGeometry, server: Box, o: MallPaintOptions): void {
  const elapsed = o.timeMs - o.adminPulse!.startMs;
  if (elapsed > MALL_TIMING.adminPulseMs || !product.cacheBox) return;
  const t = Math.min(1, elapsed / (MALL_TIMING.adminPulseMs * 0.55));
  const fromX = server.x;
  const toX = product.cacheBox.x + product.cacheBox.width;
  const x = fromX + (toX - fromX) * t;
  // 재생성 경로(점선) 위를 거슬러 캐시 노드로 도달한다 — 태그 갱신은 서버 쪽에서 캐시로 오는 신호다
  const y = product.lineY;
  const fade = elapsed > MALL_TIMING.adminPulseMs * 0.7 ? 1 - (elapsed - MALL_TIMING.adminPulseMs * 0.7) / (MALL_TIMING.adminPulseMs * 0.3) : 1;

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.strokeStyle = MALL_COLOR.admin;
  ctx.lineWidth = 1.4;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(fromX, y);
  ctx.lineTo(x, y);
  ctx.stroke();
  const label = `${o.adminPulse!.mode}('product:1')`;
  ctx.font = '700 9px ui-monospace, Menlo, monospace';
  const w = ctx.measureText(label).width + 14;
  // 칩은 진행 방향의 머리(x) 뒤쪽, 즉 서버 쪽으로 늘어진다 — 도착 시 캐시 노드를 덮지 않는다
  drawRoundRect(ctx, { x, y: y - 9, width: w, height: 18, radius: 9, fill: MALL_COLOR.admin });
  drawText(ctx, label, { x: x + w / 2, y, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 700, color: '#ffffff', fontFamily: 'ui-monospace, Menlo, monospace' });
  ctx.restore();
}
