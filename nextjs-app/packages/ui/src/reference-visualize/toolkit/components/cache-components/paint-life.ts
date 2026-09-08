/**
 * @fileoverview cache-components/paint-life.ts
 * 핵심 그림: **두 시간축.**
 *
 * 위는 클라이언트(`stale` — 라우터가 서버 확인 없이 쓰는 시간),
 * 아래는 서버(`revalidate` 이후 다음 요청이 백그라운드 갱신을 트리거, `expire`를 넘기면 그 요청이 기다린다).
 * 근거: `04-functions/cacheLife.md:91-93,108-127`.
 *
 * 값의 크기 차가 커서(300초 vs 86,400초) 선형 축은 앞쪽이 뭉친다. 로그 위치로 배치한다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { STRUCTURE_UI } from '../structure/frame';
import { C, label } from './paint';
import { lifeZone, type LifeProfile } from './model';

const ZONE_COLOR = { fresh: '#16a34a', swr: '#f59e0b', blocking: '#dc2626' } as const;

export function axisMaxOf(profile: LifeProfile): number {
  return profile.expire ?? profile.revalidate * 4;
}

/** 로그 위치 — 작은 값이 뭉치지 않게 */
export function posOf(sec: number, max: number): number {
  return Math.log10(1 + Math.max(0, Math.min(max, sec))) / Math.log10(1 + max);
}

export function formatSec(sec: number): string {
  if (sec >= 86400) return `${Math.round(sec / 86400)}일`;
  if (sec >= 3600) return `${Math.round(sec / 3600)}시간`;
  if (sec >= 60) return `${Math.round(sec / 60)}분`;
  return `${Math.round(sec)}초`;
}

export interface LifePaintOptions {
  width: number;
  height: number;
  profile: LifeProfile;
  /** 사용자가 고른 "요청이 도착한 시점"(초) */
  requestAtSec: number;
}

export function paintLife(ctx: CanvasRenderingContext2D, o: LifePaintOptions): void {
  const pad = 12;
  const plotX = pad + 62;
  const plotW = Math.max(120, o.width - plotX - pad - 10);
  const max = axisMaxOf(o.profile);
  const toX = (sec: number) => plotX + posOf(sec, max) * plotW;

  const clientY = pad + 34;
  const serverY = clientY + 74;
  const laneH = 34;

  paintClientLane(ctx, plotX, clientY, plotW, laneH, o.profile, toX, max);
  paintServerLane(ctx, plotX, serverY, plotW, laneH, o.profile, toX, max);
  paintGutter(ctx, pad, clientY, serverY, laneH);
  paintMarker(ctx, o, toX, clientY, serverY + laneH);
  paintResult(ctx, pad, serverY + laneH + 26, o.width - pad * 2, o);
}

function paintGutter(ctx: CanvasRenderingContext2D, x: number, clientY: number, serverY: number, laneH: number): void {
  drawText(ctx, '클라이언트', { x, y: clientY + laneH / 2 - 5, fontSize: 10, fontWeight: 700, color: C.blue, baseline: 'middle' });
  drawText(ctx, '라우터 캐시', { x, y: clientY + laneH / 2 + 7, fontSize: 9, fontWeight: 600, color: STRUCTURE_UI.faint, baseline: 'middle' });
  drawText(ctx, '서버', { x, y: serverY + laneH / 2 - 5, fontSize: 10, fontWeight: 700, color: C.violet, baseline: 'middle' });
  drawText(ctx, '캐시 항목', { x, y: serverY + laneH / 2 + 7, fontSize: 9, fontWeight: 600, color: STRUCTURE_UI.faint, baseline: 'middle' });
}

function paintClientLane(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  profile: LifeProfile, toX: (s: number) => number, max: number
): void {
  const staleX = toX(profile.stale);
  band(ctx, x, y, staleX - x, h, '#16a34a', '서버 확인 없이 재사용');
  band(ctx, staleX, y, x + w - staleX, h, '#94a3b8', '다음 이동 때 서버에 확인');
  tick(ctx, staleX, y - 6, y + h + 4, `stale ${formatSec(profile.stale)}`, '#16a34a');
  void max;
}

function paintServerLane(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  profile: LifeProfile, toX: (s: number) => number, max: number
): void {
  const revX = toX(profile.revalidate);
  const expX = profile.expire === null ? x + w : toX(profile.expire);

  band(ctx, x, y, revX - x, h, ZONE_COLOR.fresh, '캐시 그대로 응답');
  band(ctx, revX, y, expX - revX, h, ZONE_COLOR.swr, '구값 응답 + 백그라운드 갱신');
  if (profile.expire !== null) {
    band(ctx, expX, y, x + w - expX, h, ZONE_COLOR.blocking, '요청이 기다린다');
  }

  tick(ctx, revX, y - 6, y + h + 4, `revalidate ${formatSec(profile.revalidate)}`, ZONE_COLOR.swr);
  if (profile.expire !== null) {
    tick(ctx, expX, y - 6, y + h + 4, `expire ${formatSec(profile.expire)}`, ZONE_COLOR.blocking);
  } else {
    drawText(ctx, '만료 없음', { x: x + w - 4, y: y + h + 14, align: 'right', fontSize: 9, fontWeight: 700, color: STRUCTURE_UI.faint });
  }
  void max;
}

function band(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, text: string): void {
  if (w < 1) return;
  drawRoundRect(ctx, { x, y, width: w, height: h, radius: 5, fill: `${color}1f`, stroke: `${color}66`, lineWidth: 1 });
  ctx.font = `600 9px ${DEFAULT_FONT_FAMILY}`;
  if (ctx.measureText(text).width + 12 <= w) {
    drawText(ctx, text, { x: x + w / 2, y: y + h / 2, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 600, color });
  }
}

function tick(ctx: CanvasRenderingContext2D, x: number, top: number, bottom: number, text: string, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
  ctx.restore();
  drawText(ctx, text, { x, y: top - 4, align: 'center', fontSize: 9, fontWeight: 700, color });
}

function paintMarker(ctx: CanvasRenderingContext2D, o: LifePaintOptions, toX: (s: number) => number, top: number, bottom: number): void {
  const x = toX(o.requestAtSec);
  ctx.save();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x, top - 16);
  ctx.lineTo(x, bottom + 6);
  ctx.stroke();
  ctx.restore();
  drawRoundRect(ctx, { x: x - 3, y: bottom + 4, width: 6, height: 6, radius: 1, fill: C.ink });
  drawText(ctx, `요청 ${formatSec(o.requestAtSec)} 뒤`, {
    x,
    y: top - 20,
    align: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: C.ink
  });
}

function paintResult(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, o: LifePaintOptions): void {
  const zone = lifeZone(o.requestAtSec, o.profile);
  const clientReuse = o.requestAtSec <= o.profile.stale;
  const color = ZONE_COLOR[zone];
  const text =
    zone === 'fresh'
      ? '서버가 캐시된 결과를 그대로 응답. 재생성 없음'
      : zone === 'swr'
        ? '구값을 즉시 응답하고, 이 요청이 백그라운드 재생성을 트리거'
        : '만료됨 — 이 요청은 새 콘텐츠가 준비될 때까지 기다린다';

  drawRoundRect(ctx, { x, y, width: w, height: 40, radius: 8, fill: `${color}12`, stroke: `${color}66`, lineWidth: 1.2 });
  label(ctx, `서버 · ${text}`, x + 12, y + 14, w - 24, color, 11);
  label(
    ctx,
    clientReuse
      ? '클라이언트 · stale 안이라 서버에 묻지도 않는다 (라우터 캐시에서 즉시)'
      : '클라이언트 · stale이 지나 다음 이동 때 서버에 확인한다',
    x + 12,
    y + 29,
    w - 24,
    clientReuse ? '#16a34a' : STRUCTURE_UI.sub,
    10
  );
}

/** 캔버스 x → 초 (클릭·드래그로 요청 시점을 고를 때) */
export function secAtX(px: number, width: number, profile: LifeProfile): number {
  const pad = 12;
  const plotX = pad + 62;
  const plotW = Math.max(120, width - plotX - pad - 10);
  const ratio = Math.max(0, Math.min(1, (px - plotX) / plotW));
  const max = axisMaxOf(profile);
  return Math.round(Math.pow(10, ratio * Math.log10(1 + max)) - 1);
}
