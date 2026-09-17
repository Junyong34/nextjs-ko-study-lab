/**
 * @fileoverview structure/tree-sequence.ts
 * App Router가 화면을 만드는 순서 — RSC 셸 → Suspense 스트리밍 → 클라이언트 수화.
 * 구조 그림에 시간을 붙여, "무엇이 먼저 오고 무엇이 나중에 살아나는지"를 계산한다.
 */

import type { NodeState, RenderPhase, RenderTreeNode, TreeBox } from './types';

export const RENDER_PHASES: RenderPhase[] = [
  { key: 'shell', label: 'RSC 셸', until: 0.34 },
  { key: 'stream', label: 'Suspense 스트리밍', until: 0.68 },
  { key: 'hydrate', label: '클라이언트 수화', until: 1 }
];

export function phaseIndexAt(progress: number): number {
  const index = RENDER_PHASES.findIndex((phase) => progress < phase.until);
  return index === -1 ? RENDER_PHASES.length - 1 : index;
}

/**
 * 노드 하나의 표시 상태.
 * - rsc: 자기 차례가 오기 전엔 `pending`, 지나면 `ready`
 * - suspense: 셸 단계가 끝나면 `streaming`(스켈레톤), 청크가 도착하면 `ready`
 * - client: HTML은 부모와 함께 와 있으므로 `ready`(아직 반응 못 함) → 수화되면 `hydrated`
 */
export function nodeStateAt(node: RenderTreeNode, progress: number): NodeState {
  if (node.kind === 'suspense') {
    if (progress < RENDER_PHASES[0].until) return 'pending';
    return progress < node.readyAt ? 'streaming' : 'ready';
  }
  if (node.kind === 'client') {
    return progress < node.readyAt ? 'ready' : 'hydrated';
  }
  return progress < node.readyAt ? 'pending' : 'ready';
}

/**
 * 부모가 아직 자리를 잡지 못한 노드는 화면에 존재하지 않는다.
 * 렌더 순서를 정직하게 보여 주려면 그런 노드는 그리지 않아야 한다.
 */
export function hiddenNodeIds(boxes: TreeBox[], progress: number): Set<string> {
  const hidden = new Set<string>();
  const byId = new Map(boxes.map((box) => [box.node.id, box]));

  for (const box of boxes) {
    let parentId = box.parentId;
    while (parentId) {
      const parent = byId.get(parentId);
      if (!parent) break;
      const state = nodeStateAt(parent.node, progress);
      if (state === 'pending' || state === 'streaming') {
        hidden.add(box.node.id);
        break;
      }
      parentId = parent.parentId;
    }
  }
  return hidden;
}

/** 현재 단계에서 무엇이 벌어지는지 한 줄 설명 (캔버스가 아닌 DOM 요약용) */
export function phaseSummary(progress: number): string {
  const phase = RENDER_PHASES[phaseIndexAt(progress)];
  if (phase.key === 'shell') return '서버가 RSC 셸을 바깥 레이아웃부터 안쪽 page까지 차례로 만든다.';
  if (phase.key === 'stream')
    return 'Suspense 경계가 스켈레톤으로 먼저 자리를 잡고, 데이터가 준비된 것부터 교체된다.';
  return "HTML은 이미 보이는 상태에서 'use client' 컴포넌트만 수화되어 조작 가능해진다.";
}
