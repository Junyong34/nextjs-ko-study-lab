/**
 * @fileoverview cache-components/paint-shell.ts
 * 핵심 그림: **정적 셸 경계 상자.**
 *
 * 한 페이지 안에서 정적 콘텐츠와 `use cache` 결과는 셸 상자 *안*으로 들어가고,
 * `<Suspense>` 안의 런타임 동적 구역은 fallback만 들어간 채 본체는 상자 *밖*에 남아 요청 시 스트리밍된다.
 * `use cache`가 페이지를 정적으로 만드는 것이 아니라 **셸에 포함시키는 것**임이 상자 하나로 읽혀야 한다.
 * 근거: `01-getting-started/08-caching.md:241-300`, 정적 셸의 CDN 서빙은 `:444-454`.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { drawSkeletonLines, drawStepIndicator, STRUCTURE_UI } from '../structure/frame';
import { C, label } from './paint';
import { stepProgress } from './sequence';

export const SHELL_STEPS = ['빌드 — 셸 구성', '요청 — 셸 즉시 전달', '요청 시 실행', '스트리밍 완료'];

interface Zone {
  title: string;
  sub: string;
  color: string;
  inShell: boolean;
}

const ZONES: Zone[] = [
  { title: '<header> 정적', sub: '데이터 없음 → 자동 프리렌더', color: C.blue, inShell: true },
  { title: "<BlogPosts> 'use cache'", sub: "cacheLife('hours') · cacheTag('posts')", color: C.green, inShell: true },
  { title: '<Suspense> <UserPreferences>', sub: 'cookies() 읽음 → 요청 시 렌더', color: C.violet, inShell: false }
];

const ZONE_H = 54;
const GAP = 8;

export function paintShell(ctx: CanvasRenderingContext2D, width: number, height: number, nowMs: number, step: number): void {
  const pad = 12;
  const gap = 14;
  const leftW = Math.max(240, (width - pad * 2 - gap) * 0.56);
  const rightX = pad + leftW + gap;
  const rightW = Math.max(150, width - pad - rightX);

  drawStepIndicator(ctx, pad, pad + 6, width - pad * 2, SHELL_STEPS, step, C.blue);

  const top = pad + 22;
  paintZones(ctx, pad, top, leftW, step, nowMs);
  paintBrowser(ctx, rightX, top, rightW, height - top - pad, step, nowMs);

  // 셸이 CDN에서 브라우저로 건너가는 순간
  if (step >= 1) {
    const y = top + 40;
    ctx.save();
    ctx.strokeStyle = C.blue;
    ctx.globalAlpha = step === 1 ? 0.4 + 0.6 * stepProgress(nowMs) : 0.35;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(pad + leftW + 2, y);
    ctx.lineTo(rightX - 6, y);
    ctx.stroke();
    ctx.restore();
    drawLineArrowHead(ctx, rightX - 3, y, 0, C.blue, 4, 1.4);
  }
}

function zoneY(top: number, index: number): number {
  // 세 번째 구역은 셸 상자 밖이라는 사실이 보이도록 한 칸 더 띄운다
  return top + 16 + index * (ZONE_H + GAP) + (index === 2 ? 14 : 0);
}

function paintZones(ctx: CanvasRenderingContext2D, x: number, top: number, width: number, step: number, nowMs: number): void {
  // 셸 경계 상자 — 앞의 두 구역만 감싼다
  const boxTop = zoneY(top, 0) - 10;
  const boxBottom = zoneY(top, 1) + ZONE_H + 10;
  const settled = step >= 1 ? 1 : stepProgress(nowMs);

  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = C.blue;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.35 + settled * 0.65;
  drawRoundRect(ctx, { x: x - 2, y: boxTop, width: width + 4, height: boxBottom - boxTop, radius: 10 });
  ctx.stroke();
  ctx.restore();

  drawText(ctx, '정적 셸 — 빌드 산출물, CDN에서 즉시', {
    x: x + 4,
    y: boxTop - 7,
    fontSize: 10,
    fontWeight: 700,
    color: C.blue
  });

  ZONES.forEach((zone, index) => {
    const y = zoneY(top, index);
    const active = index === 2 ? step >= 2 : true;
    drawRoundRect(ctx, {
      x,
      y,
      width,
      height: ZONE_H,
      radius: 8,
      fill: active ? `${zone.color}0e` : '#f8fafc',
      stroke: active ? zone.color : STRUCTURE_UI.panelBorder,
      lineWidth: active ? 1.4 : 1
    });
    label(ctx, zone.title, x + 12, y + 19, width - 24, active ? zone.color : STRUCTURE_UI.faint, 12);
    label(ctx, zone.sub, x + 12, y + 38, width - 24, STRUCTURE_UI.sub, 10);
  });

  drawText(ctx, '↑ 셸 밖 — 요청마다 실행되어 뒤이어 스트리밍', {
    x: x + 4,
    y: zoneY(top, 2) + ZONE_H + 13,
    fontSize: 10,
    fontWeight: 700,
    color: C.violet
  });
}

function paintBrowser(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, step: number, nowMs: number): void {
  drawRoundRect(ctx, { x, y, width, height, radius: 9, fill: '#ffffff', stroke: STRUCTURE_UI.panelBorder });
  drawText(ctx, '사용자가 보는 화면', {
    x: x + 10,
    y: y + 15,
    fontSize: 10,
    fontWeight: 700,
    color: STRUCTURE_UI.sub
  });

  if (step === 0) {
    drawText(ctx, '아직 요청 전', {
      x: x + width / 2,
      y: y + height / 2,
      align: 'center',
      baseline: 'middle',
      fontSize: 10,
      fontWeight: 600,
      color: STRUCTURE_UI.faint
    });
    return;
  }

  const slotH = Math.max(22, (height - 34 - 12) / 3);
  ZONES.forEach((zone, index) => {
    const sy = y + 26 + index * (slotH + 6);
    const streamed = index === 2;
    const filled = streamed ? step >= 3 : true;
    const body = { x: x + 8, y: sy + 5, width: width - 16, height: slotH - 10 };

    drawRoundRect(ctx, {
      x: x + 6,
      y: sy,
      width: width - 12,
      height: slotH,
      radius: 6,
      fill: filled ? `${zone.color}14` : '#f8fafc',
      stroke: filled ? `${zone.color}77` : STRUCTURE_UI.panelBorder,
      lineWidth: 1,
      lineDash: filled ? undefined : [4, 3]
    });

    if (!filled) {
      drawSkeletonLines(ctx, body, 2, nowMs * 4);
      drawText(ctx, step === 2 ? '요청 시 렌더 중…' : 'fallback', {
        x: x + width - 12,
        y: sy + 11,
        align: 'right',
        fontSize: 9,
        fontWeight: 700,
        color: C.violet
      });
      return;
    }

    ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
    label(ctx, zone.title.replace(/[<>]|'use cache'/g, '').trim(), x + 12, sy + 13, width - 60, zone.color, 10);
    drawText(ctx, streamed ? '스트리밍 도착' : '셸에 포함', {
      x: x + width - 12,
      y: sy + 13,
      align: 'right',
      fontSize: 9,
      fontWeight: 700,
      color: streamed ? C.violet : C.blue
    });
    drawRoundRect(ctx, {
      x: body.x,
      y: body.y + 8,
      width: body.width * 0.72,
      height: Math.max(4, body.height - 12),
      radius: 3,
      fill: `${zone.color}33`
    });
  });
}
