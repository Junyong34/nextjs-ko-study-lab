/**
 * @fileoverview cache-components/paint-tags.ts
 * 핵심 그림: **하나의 흐름이 두 갈래로 갈린다.**
 *
 * 왼쪽 열(`tags-scope.ts`)에서 저장 → 태그 매칭 → 무효화 대상까지 내려온 흐름이,
 * 갈림목에서 `updateTag`와 `revalidateTag`로 **실제로 벌어진다.** 두 갈래는 같은 시점에
 * 서로 다른 값을 돌려주고(`v2` / `v1`), 한 단계 뒤에 다시 만난다.
 * 근거: `01-getting-started/09-revalidating.md:91-163` (비교 표 포함).
 *
 * 두 축의 색을 섞지 않는다. 갈래의 정체성은 파랑·주황, 캐시 항목의 상태는 초록·빨강·노랑이다.
 * 단계 사이를 정수로 끊지 않는다 — 요청이 캐시로 건너가 값을 받아오는 움직임이 개념을 나른다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { drawStepIndicator, STRUCTURE_UI } from '../structure/frame';
import { C, label } from './paint';
import { paintTagScope } from './tags-scope';
import { ease, paintReadLane, type Branch } from './tags-read-lane';
import { stepAt, stepProgress } from './sequence';

export const TAG_STEPS = ['저장 전', '저장 성공 → 태그 처리', '다음 읽기', '그 다음 읽기'];

/** 캐시 항목의 상태색 — 갈래의 정체성 색과 겹치지 않게 고른다 */
const STATE_COLOR: Record<string, string> = {
  FRESH: '#047857',
  EXPIRED: '#dc2626',
  STALE: '#ca8a04'
};

const BRANCHES: Branch[] = [
  {
    api: "updateTag('products')",
    where: 'Server Actions 전용 · 즉시 만료',
    color: C.blue,
    states: [
      ['FRESH', 'v1 보관 중'],
      ['EXPIRED', '즉시 만료됨'],
      ['EXPIRED', '읽는 요청이 재생성을 기다린다'],
      ['FRESH', 'v2 보관 중']
    ],
    reads: ['v1', '읽기 없음', 'v2 — 새 값', 'v2'],
    background: false
  },
  {
    api: "revalidateTag('products', 'max')",
    where: 'Server Actions + Route Handlers · stale-while-revalidate',
    color: C.amber,
    states: [
      ['FRESH', 'v1 보관 중'],
      ['STALE', '구값 서빙이 허용됨'],
      ['STALE', 'v1을 주고 뒤에서 재생성한다'],
      ['FRESH', 'v2 보관 중']
    ],
    reads: ['v1', '읽기 없음', 'v1 — 구값', 'v2'],
    background: true
  }
];

export interface TagsPaintOptions {
  width: number;
  height: number;
  nowMs: number;
  selectedTag: string;
}

export function paintTags(ctx: CanvasRenderingContext2D, o: TagsPaintOptions): void {
  const pad = 12;
  const gap = 26;
  const step = stepAt(o.nowMs, TAG_STEPS.length);
  const t = stepProgress(o.nowMs);
  const leftW = Math.max(190, (o.width - pad * 2 - gap) * 0.34);
  const rightX = pad + leftW + gap;
  const top = pad + 24;
  const bodyH = o.height - top - pad;
  const branchH = (bodyH - 14) / 2;

  drawStepIndicator(ctx, pad, pad + 6, o.width - pad * 2, TAG_STEPS, step, C.blue);
  paintTagScope(ctx, {
    x: pad, y: top, w: leftW, h: bodyH, selectedTag: o.selectedTag, step, nowMs: o.nowMs
  });

  paintFork(ctx, pad + leftW, top + bodyH / 2, rightX, [
    top + branchH / 2,
    top + branchH + 14 + branchH / 2
  ], step, t);

  BRANCHES.forEach((branch, index) => {
    paintBranch(
      ctx, rightX, top + index * (branchH + 14), o.width - pad - rightX, branchH, branch, step, t
    );
  });
}

/** 한 점에서 나와 두 갈래로 벌어지는 줄기 — "여기서 갈린다"를 선으로 말한다 */
function paintFork(
  ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number,
  centers: number[], step: number, t: number
): void {
  const jx = fromX + (toX - fromX) / 2;
  const on = step >= 1;

  const stroke = (color: string, alpha: number) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(jx, fromY);
    centers.forEach((cy) => {
      ctx.moveTo(jx, fromY);
      ctx.lineTo(jx, cy);
      ctx.lineTo(toX - 3, cy);
    });
    ctx.stroke();
    ctx.restore();
  };

  stroke(STRUCTURE_UI.panelBorder, 1);
  if (!on) return;

  const lit = step === 1 ? ease(t) : 1;
  stroke(C.green, lit);
  centers.forEach((cy) => drawLineArrowHead(ctx, toX - 1, cy, 0, C.green, 4, 1.4));
}

function paintBranch(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  branch: Branch, step: number, t: number
): void {
  const [state, note] = branch.states[Math.min(step, 3)];
  const stateColor = STATE_COLOR[state];

  drawRoundRect(ctx, {
    x, y, width: w, height: h, radius: 8,
    fill: `${branch.color}08`, stroke: `${branch.color}55`, lineWidth: 1.2
  });
  label(ctx, branch.api, x + 14, y + 18, w - 28, branch.color, 12);
  label(ctx, branch.where, x + 14, y + 34, w - 28, STRUCTURE_UI.faint, 9);

  paintStateBadge(ctx, x + 14, y + 52, w - 28, state, note, stateColor, step === 1 ? ease(t) : 1);
  paintReadLane(ctx, x, y + h - 40, w, branch, stateColor, step, t);
}

/** 캐시 항목이 지금 어떤 상태인가 — ②단계에서 두 갈래가 여기서 갈린다 */
function paintStateBadge(
  ctx: CanvasRenderingContext2D, x: number, y: number, maxW: number,
  state: string, note: string, color: string, appear: number
): void {
  ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
  const badgeW = Math.min(maxW, ctx.measureText(state).width + 18);

  ctx.save();
  ctx.globalAlpha = 0.35 + appear * 0.65;
  drawRoundRect(ctx, { x, y: y - 9, width: badgeW, height: 18, radius: 5, fill: color });
  drawText(ctx, state, {
    x: x + badgeW / 2, y, align: 'center', baseline: 'middle',
    fontSize: 10, fontWeight: 700, color: '#ffffff'
  });
  ctx.restore();
  label(ctx, note, x + badgeW + 8, y, maxW - badgeW - 8, color, 10);
}
