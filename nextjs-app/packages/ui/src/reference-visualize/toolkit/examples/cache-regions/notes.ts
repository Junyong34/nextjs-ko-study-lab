/**
 * @fileoverview cache-regions/notes.ts
 * `StructureNotes` 항목 — 영역 4개의 캐시 전략 설명. id가 영역 id라 캔버스·코드 지도와 호버가 동기화된다.
 */

import type { NoteItem } from '../../components/structure';
import { MODE_COLOR } from '../../components/cache-components/paint-regions';
import { MODE_LABEL, REGIONS, type CacheFill } from '../../components/cache-components/regions-model';

export const REGIONS_SOURCE = 'https://nextjs.org/docs/app/api-reference/directives/use-cache';

const META: Record<string, string> = {
  header: 'caching.md · 정적 셸',
  products: 'use-cache.md · cacheLife.md · cacheTag.md',
  price: 'use-cache.md:126 (cookies는 밖에서 읽어 인자로)',
  recs: 'caching.md · Suspense 스트리밍'
};

export function regionNotes(fill: CacheFill): NoteItem[] {
  return REGIONS.map((r) => ({
    id: r.id,
    label: `${r.title} — ${MODE_LABEL[r.mode]}`,
    meta: `${r.file} · ${META[r.id]}`,
    detail:
      fill === 'cold' && r.id === 'products'
        ? `${r.detail} 지금 시나리오(캐시 비어 있음)에서는 이 영역 때문에 첫 페인트가 늦어지는 것을 볼 수 있다 — 캐시 컴포넌트는 Suspense 밖에 있어 셸의 일부이기 때문이다.`
        : fill === 'cold' && r.id === 'price'
          ? `${r.detail} 지금 시나리오에서는 getRate('KRW')가 MISS라 외부 API를 호출하고 저장한 뒤 렌더한다 — 다음 요청부터는 호출 없이 HIT다.`
          : r.detail,
    color: MODE_COLOR[r.mode]
  }));
}
