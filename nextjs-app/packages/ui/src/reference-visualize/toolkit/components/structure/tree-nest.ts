/**
 * @fileoverview structure/tree-nest.ts
 * App Router 렌더 트리를 **진짜 중첩 박스**로 그린다.
 * 자식이 부모 안쪽에 들어가야 layout ⊃ page ⊃ Suspense ⊃ client 관계가 눈으로 읽힌다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { fitLabel } from '../timeline/label-fit';
import { STRUCTURE_UI, drawSkeletonLines } from './frame';
import { hiddenNodeIds, nodeStateAt } from './tree-sequence';
import type { NodeState, Panel, RenderTreeNode, TreeBox, TreeNodeKind } from './types';

const HEADER_H = 18;
const PAD_X = 10;
const PAD_Y = 6;
const GAP_Y = 5;
const LEAF_H = 26;

export const KIND_COLOR: Record<TreeNodeKind, string> = {
  rsc: '#3b82f6',
  suspense: '#f59e0b',
  client: '#ec4899'
};

export const KIND_TAG: Record<TreeNodeKind, string> = {
  rsc: 'RSC',
  suspense: 'Suspense',
  client: 'use client'
};

/** 자식까지 포함한 노드 높이 */
export function measureNode(node: RenderTreeNode): number {
  const children = node.children ?? [];
  if (children.length === 0) return LEAF_H;
  const inner = children.reduce((sum, child) => sum + measureNode(child), 0) + GAP_Y * (children.length - 1);
  return HEADER_H + PAD_Y + inner + PAD_Y;
}

/** 중첩 박스를 부모부터 순서대로 평탄화한다 */
export function buildTreeBoxes(
  node: RenderTreeNode,
  x: number,
  y: number,
  width: number,
  depth = 0,
  parentId: string | null = null
): TreeBox[] {
  const height = measureNode(node);
  const boxes: TreeBox[] = [{ node, depth, parentId, x, y, width, height }];

  let cursor = y + HEADER_H + PAD_Y;
  for (const child of node.children ?? []) {
    boxes.push(...buildTreeBoxes(child, x + PAD_X, cursor, width - PAD_X * 2, depth + 1, node.id));
    cursor += measureNode(child) + GAP_Y;
  }
  return boxes;
}

export interface TreePaintOptions {
  boxes: TreeBox[];
  progress: number;
  hoveredId: string | null;
  timeMs: number;
}

export function paintTree(
  ctx: CanvasRenderingContext2D,
  { boxes, progress, hoveredId, timeMs }: TreePaintOptions
): void {
  const hidden = hiddenNodeIds(boxes, progress);

  for (const box of boxes) {
    if (hidden.has(box.node.id)) continue;
    paintBox(ctx, box, nodeStateAt(box.node, progress), hoveredId === box.node.id, timeMs);
  }
}

function paintBox(
  ctx: CanvasRenderingContext2D,
  box: TreeBox,
  state: NodeState,
  isHovered: boolean,
  timeMs: number
): void {
  const color = KIND_COLOR[box.node.kind];
  const dim = state === 'pending';
  const dashed = state === 'pending' || (box.node.kind === 'client' && state === 'ready');

  drawRoundRect(ctx, {
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    radius: 7,
    fill: dim ? '#f8fafc' : `${color}0e`,
    stroke: isHovered ? color : dim ? STRUCTURE_UI.panelBorder : `${color}99`,
    lineWidth: isHovered ? 2.2 : 1.3,
    lineDash: dashed ? [4, 3] : undefined
  });

  paintHeader(ctx, box, state, color, dim);

  if (state === 'streaming') {
    const body: Panel = {
      x: box.x + PAD_X,
      y: box.y + HEADER_H + PAD_Y,
      width: box.width - PAD_X * 2,
      height: Math.max(8, box.height - HEADER_H - PAD_Y * 2)
    };
    drawSkeletonLines(ctx, body, 2, timeMs);
  }

  if (state === 'hydrated') {
    const glow = 0.35 + 0.25 * Math.sin(timeMs / 260);
    drawRoundRect(ctx, {
      x: box.x - 1,
      y: box.y - 1,
      width: box.width + 2,
      height: box.height + 2,
      radius: 8,
      stroke: color,
      lineWidth: 1.6,
      globalAlpha: glow
    });
  }
}

function paintHeader(
  ctx: CanvasRenderingContext2D,
  box: TreeBox,
  state: NodeState,
  color: string,
  dim: boolean
): void {
  const tag = KIND_TAG[box.node.kind];
  const textY = box.y + HEADER_H / 2 + 1;

  ctx.font = `700 9px ${DEFAULT_FONT_FAMILY}`;
  const tagW = ctx.measureText(tag).width + 10;
  drawRoundRect(ctx, {
    x: box.x + 7,
    y: box.y + 4,
    width: tagW,
    height: 12,
    radius: 999,
    fill: dim ? '#e2e8f0' : color
  });
  drawText(ctx, tag, {
    x: box.x + 7 + tagW / 2,
    y: box.y + 10,
    align: 'center',
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 700,
    color: dim ? STRUCTURE_UI.faint : '#ffffff'
  });

  const titleX = box.x + 7 + tagW + 6;
  const statusText = state === 'streaming' ? '스켈레톤' : state === 'hydrated' ? '⚡ 수화됨' : state === 'ready' && box.node.kind === 'client' ? '수화 대기' : '';
  ctx.font = `600 9px ${DEFAULT_FONT_FAMILY}`;
  const statusW = statusText ? ctx.measureText(statusText).width + 8 : 0;
  const available = box.width - (titleX - box.x) - 8 - statusW;

  const fit = fitLabel(ctx, box.node.title, available, box.depth, [11, 10, 9]);
  if (fit.mode !== 'none') {
    drawText(ctx, fit.text, {
      x: titleX,
      y: textY,
      baseline: 'middle',
      fontSize: fit.fontSize,
      fontWeight: 700,
      color: dim ? STRUCTURE_UI.faint : '#0f172a'
    });
  }
  if (statusText) {
    drawText(ctx, statusText, {
      x: box.x + box.width - 8,
      y: textY,
      align: 'right',
      baseline: 'middle',
      fontSize: 9,
      fontWeight: 700,
      color
    });
  }
}

/** 가장 안쪽(= 가장 나중에 그려진) 박스를 우선해 판정한다 */
export function hitTestTree(
  boxes: TreeBox[],
  progress: number,
  pointer: { x: number; y: number; isInside: boolean }
): string | null {
  if (!pointer.isInside) return null;
  const hidden = hiddenNodeIds(boxes, progress);

  for (let i = boxes.length - 1; i >= 0; i--) {
    const box = boxes[i];
    if (hidden.has(box.node.id)) continue;
    if (
      pointer.x >= box.x &&
      pointer.x <= box.x + box.width &&
      pointer.y >= box.y &&
      pointer.y <= box.y + box.height
    ) {
      return box.node.id;
    }
  }
  return null;
}
