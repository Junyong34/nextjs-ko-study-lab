/**
 * @fileoverview cache-components/tags-scope.ts
 * 태그 데모의 **왼쪽 열** — "무엇이 걸리는가".
 *
 * 저장 성공 → `cacheTag` 매칭 → 걸린 캐시 항목들, 이 순서를 위에서 아래로 그린다.
 * 여기서 나온 줄기가 오른쪽에서 두 갈래로 갈라지므로, 이 열은 두 갈래의 **공통 전사(前史)** 다.
 * 그래서 `무효화` 표시는 어느 갈래의 색도 쓰지 않는다 — 중립 슬레이트다.
 *
 * 근거: `01-getting-started/09-revalidating.md:91-163`,
 * `03-api-reference/04-functions/cacheTag.md` (한 항목에 태그 여럿, 태그 하나에 항목 여럿).
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { STRUCTURE_UI } from '../structure/frame';
import { C, label } from './paint';
import { TAG_ENTRIES } from './model';
import { stepEnterPulse } from './sequence';

/** 무효화 대상 표시색 — 두 갈래 공통이므로 파랑도 주황도 아니다 */
const NEUTRAL = '#334155';

export interface TagScopeOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  selectedTag: string;
  step: number;
  nowMs: number;
}

export function paintTagScope(ctx: CanvasRenderingContext2D, o: TagScopeOptions): void {
  const { x, y, w, h, selectedTag, step } = o;
  const saved = step >= 1;

  drawRoundRect(ctx, {
    x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1,
    radius: 9, fill: '#ffffff', stroke: STRUCTURE_UI.panelBorder
  });
  drawText(ctx, `cacheTag('${selectedTag}')가 걸린 캐시 항목`, {
    x: x + 12, y: y + 16, fontSize: 10, fontWeight: 700, color: STRUCTURE_UI.sub, baseline: 'middle'
  });

  // ① 저장 — 모든 일의 시작
  const saveY = y + 28;
  drawRoundRect(ctx, {
    x: x + 10, y: saveY, width: w - 20, height: 30, radius: 7,
    fill: saved ? `${C.green}14` : '#f8fafc',
    stroke: saved ? C.green : STRUCTURE_UI.panelBorder,
    lineWidth: saved ? 1.4 : 1
  });
  label(
    ctx,
    saved ? 'Server Action — 저장 성공' : '아직 저장 전',
    x + 20, saveY + 15, w - 40, saved ? C.green : STRUCTURE_UI.faint, 11
  );

  // ② 태그 매칭 — 저장에서 항목 목록으로 내려가는 화살표
  const hookX = x + 26;
  const listY = saveY + 54;
  ctx.save();
  ctx.strokeStyle = saved ? NEUTRAL : STRUCTURE_UI.panelBorder;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(hookX, saveY + 30);
  ctx.lineTo(hookX, listY - 5);
  ctx.stroke();
  ctx.restore();
  if (saved) drawLineArrowHead(ctx, hookX, listY - 3, Math.PI / 2, NEUTRAL, 4, 1.3);
  drawText(ctx, '태그 매칭', {
    x: hookX + 10, y: saveY + 42, fontSize: 9, fontWeight: 700,
    color: saved ? NEUTRAL : STRUCTURE_UI.faint, baseline: 'middle'
  });

  paintEntries(ctx, x, listY, w, selectedTag, step, o.nowMs);
  paintLegend(ctx, x + 12, y + h - 30, w - 24, saved);
}

function paintEntries(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number,
  selectedTag: string, step: number, nowMs: number
): void {
  const pulse = step === 1 ? stepEnterPulse(nowMs) : 0;

  TAG_ENTRIES.forEach((entry, index) => {
    const ey = y + index * 40;
    const hit = entry.tags.includes(selectedTag);
    const lit = hit ? pulse : 0;

    drawRoundRect(ctx, {
      x: x + 10, y: ey, width: w - 20, height: 34, radius: 6,
      fill: hit ? `${C.blue}0c` : '#f8fafc',
      stroke: hit ? C.blue : STRUCTURE_UI.panelBorder,
      lineWidth: hit ? 1.3 + lit * 1.5 : 1
    });
    label(ctx, entry.label, x + 20, ey + 13, w - 84, hit ? C.blue : STRUCTURE_UI.faint, 11);
    label(ctx, entry.tags.join(' · '), x + 20, ey + 26, w - 84, STRUCTURE_UI.faint, 9);

    if (!hit || step < 1) return;
    ctx.save();
    ctx.globalAlpha = 0.7 + lit * 0.3;
    drawText(ctx, '무효화', {
      x: x + w - 18, y: ey + 17, align: 'right', baseline: 'middle',
      fontSize: 9, fontWeight: 700, color: NEUTRAL
    });
    ctx.restore();
  });
}

/** v1·v2가 무엇인지 그림 안에서 답한다 */
function paintLegend(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, saved: boolean
): void {
  label(ctx, 'v1 = 저장 전부터 캐시에 있던 값', x, y, w, STRUCTURE_UI.faint, 9);
  label(
    ctx, 'v2 = 이번 저장으로 만들어질 새 값',
    x, y + 14, w, saved ? C.green : STRUCTURE_UI.faint, 9
  );
}
