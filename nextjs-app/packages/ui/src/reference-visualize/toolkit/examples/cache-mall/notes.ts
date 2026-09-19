/**
 * @fileoverview cache-mall/notes.ts
 * 캔버스 아래 `StructureNotes`에 넣을 항목 — 레인별 개념 노트 3개(호버 시 해당 레인 강조)와
 * 최근 페이지 요청 로그. 긴 한국어 설명은 전부 DOM에 두고 캔버스에는 짧은 라벨만 남긴다.
 */

import type { NoteItem } from '../../components/structure';
import { RESULT_COLOR } from '../../components/cache-components/paint-mall';
import {
  LANE_KEYS,
  RESULT_LABEL,
  type LaneKey,
  type PageRequestOutcome,
  type ShelfLifeOption,
  type TagMode
} from '../../components/cache-components/mall-model';

export const MALL_SOURCE = 'https://nextjs.org/docs/app/api-reference/functions/cacheLife';

const LANE_NAME: Record<LaneKey, string> = { shelf: '진열대', product: '상품 상세', cart: '장바구니' };

export function conceptNotes(shelfLife: ShelfLifeOption, lastTag: TagMode | null): NoteItem[] {
  return [
    {
      id: 'shelf',
      label: `진열대 — ${shelfLife.code}`,
      meta: 'cacheLife.md:44-52 · :35',
      detail: `${shelfLife.note}. revalidate를 넘기면 다음 요청이 구값을 즉시 받으면서 백그라운드 재생성을 시작시키고, expire까지 넘기면 그 요청은 새 값이 만들어질 때까지 기다린다. 시간이 지나기만 해서는 아무 일도 일어나지 않는다 — 요청이 트리거다.`,
      color: RESULT_COLOR.STALE
    },
    {
      id: 'product',
      label:
        lastTag === 'revalidateTag'
          ? "상품 상세 — revalidateTag('product:1', 'max')"
          : lastTag === 'updateTag'
            ? "상품 상세 — updateTag('product:1')"
            : "상품 상세 — cacheTag('product:1')",
      meta: 'updateTag.md:22-27 · revalidateTag.md:69',
      detail:
        lastTag === 'updateTag'
          ? '즉시 만료 — 관리자가 재고를 바꾼 직후 다음 요청은 구값을 받지 않고 새 값이 준비될 때까지 기다린다(read-your-own-writes). Server Action 안에서만 부를 수 있다.'
          : lastTag === 'revalidateTag'
            ? "STALE 표시 — 다음 요청은 구값을 즉시 받고 그 요청이 백그라운드 재생성을 시작시킨다. 두 번째 인자 'max'는 구값을 줘도 되는 기간이다. Route Handler(웹훅)에서도 쓸 수 있다."
            : "cacheLife를 생략해 default(revalidate 15분)를 상속한다 — 시연 중엔 시간으로 만료되지 않고, 위 관리자 버튼(태그 갱신 API)으로만 바뀐다. 태그를 붙여 두면 '어느 항목을' 갱신할지 이름으로 고를 수 있다.",
      color: '#7c3aed'
    },
    {
      id: 'cart',
      label: '장바구니 — cookies()는 use cache 안에서 못 읽는다',
      meta: 'use-cache.md:126',
      detail:
        "요청마다 다른 사용자의 세션을 읽어야 하므로 결과를 저장해 둘 수 없다. 'use cache' 안에서 cookies()를 부르면 next-request-in-use-cache 오류가 나고, 이 구역은 Suspense 경계 안에서 요청 시점에 서버가 렌더링해 스트리밍한다. 캐시 노드가 없는 이유다.",
      color: RESULT_COLOR.DYNAMIC
    }
  ];
}

export function requestLogNotes(logs: PageRequestOutcome[]): NoteItem[] {
  return logs.map((log) => {
    const dominant = log.lanes.shelf.result !== 'HIT' ? log.lanes.shelf.result : log.lanes.product.result !== 'HIT' ? log.lanes.product.result : 'HIT';
    return {
      id: `req-${log.id}`,
      label: `요청 #${log.id} · ${LANE_KEYS.map((k) => `${LANE_NAME[k]} ${log.lanes[k].result}`).join(' · ')}`,
      meta: `시뮬레이션 ${log.atSec.toFixed(1)}s`,
      detail: LANE_KEYS.map((k) => `${LANE_NAME[k]}: ${log.lanes[k].reason}`).join(' '),
      color: RESULT_COLOR[dominant]
    };
  });
}

/** 결론 스트립 한 줄 — "이번 요청이 겪은 일" */
export function conclusionOf(last: PageRequestOutcome | null): string {
  if (!last) return '아직 요청이 없습니다. "페이지 요청"을 누르면 점 3개가 동시에 출발해 레인마다 다른 곳에서 돌아옵니다.';
  return LANE_KEYS.map((k) => `${LANE_NAME[k]} ${RESULT_LABEL[last.lanes[k].result]}`).join('  ·  ');
}
