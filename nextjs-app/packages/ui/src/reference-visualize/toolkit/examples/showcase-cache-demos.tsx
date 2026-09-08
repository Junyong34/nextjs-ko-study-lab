/**
 * @fileoverview showcase-cache-demos Data
 * Cache Components 4종 메타데이터. 각 데모는 "핵심 그림" 하나를 갖는다 —
 * 셸 경계 상자 · 경계선과 키 조립 · 두 시간축 · 두 갈래 비교.
 */

import React from 'react';
import type { DemoMeta } from './showcase-types';
import { CacheShellDemo } from './CacheShellDemo';
import { CacheKeysDemo } from './CacheKeysDemo';
import { CacheLifetimeDemo } from './CacheLifetimeDemo';
import { CacheTagsDemo } from './CacheTagsDemo';

const common = {
  group: 'cache-components',
  layout: 'wide',
  category: 'Next.js · Cache Components',
  badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
} as const;

export const cacheDemos: DemoMeta[] = [
  {
    ...common,
    key: 'cache-shell',
    title: '정적 셸과 스트리밍',
    description:
      '핵심은 셸 경계 상자입니다. 정적 헤더와 use cache가 붙은 BlogPosts는 상자 안에 들어가고, cookies()를 읽는 Suspense 구역은 fallback만 상자 안에 남습니다. 본체는 요청 시 상자 밖에서 스트리밍됩니다. use cache는 페이지 전체를 정적으로 만드는 기능이 아니라 결과를 셸에 포함하는 기능입니다.',
    gridDescription: '셸 경계 상자 — 안(정적·캐시)과 밖(요청 시 스트리밍)',
    modules: ['paintShell', 'useCacheSequence', 'StructureControls', 'StructureNotes'],
    code: `// 한 페이지에 세 가지가 공존한다 (08-caching.md:241-300)
<header>…</header>              {/* 정적 — 자동 프리렌더 */}
<BlogPosts />                   {/* 'use cache' — 정적 셸에 포함 */}
<Suspense fallback={<P/>}>
  <UserPreferences />           {/* cookies() — 요청 시 스트리밍 */}
</Suspense>`,
    component: <CacheShellDemo />
  },
  {
    ...common,
    key: 'cache-keys',
    title: 'use cache 경계와 키',
    description:
      '경계와 키가 만들어지는 과정을 함께 봅니다. cookies()는 경계 밖에서 읽어 인자로 넘기고, 안에서 읽으면 next-request-in-use-cache 오류가 발생합니다. 값을 바꾸면 바뀐 키 조각이 즉시 강조되고 HIT 또는 MISS로 나뉩니다.',
    gridDescription: '경계 밖 → 인자 전달, 키 4조각 → 해시 → HIT/MISS',
    modules: ['paintKeys', 'keySegments', 'readEntry', 'StructureNotes'],
    code: `// 키 = Build ID + Function ID + 직렬화된 인자 (use-cache.md:74-99)
const locale = (await cookies()).get('locale')?.value   // 경계 밖에서 읽고
const product = await getProduct(id, locale)            // 인자로 넘긴다

async function getProduct(id: string, locale: string) {
  'use cache'                 // 여기서 cookies()를 읽으면 next-request-in-use-cache
}`,
    component: <CacheKeysDemo />
  },
  {
    ...common,
    key: 'cache-lifetime',
    title: 'cacheLife의 세 시간',
    description:
      '클라이언트와 서버에는 서로 다른 시간축이 있습니다. 위 레인의 stale은 라우터가 서버에 확인하지 않고 값을 쓰는 시간이고, 아래 레인의 revalidate·expire는 서버 쪽 시간입니다. 시간축을 클릭해 요청 시점을 옮기면 즉시 응답, 백그라운드 갱신, 대기 중 하나로 이어집니다.',
    gridDescription: '두 시간축 — 클라이언트 stale vs 서버 revalidate·expire',
    modules: ['paintLife', 'lifeZone', 'LIFE_PROFILES', 'StructureNotes'],
    code: `// 세 값의 주인이 다르다 (cacheLife.md:91-93)
cacheLife({
  stale: 300,       // 클라이언트 라우터가 서버 확인 없이 쓰는 시간
  revalidate: 3600, // 이후 "다음 요청"이 백그라운드 갱신을 트리거
  expire: 86400,    // 여기를 넘기면 그 요청은 기다린다
})`,
    component: <CacheLifetimeDemo />
  },
  {
    ...common,
    key: 'cache-tags',
    title: '태그와 갱신 방식',
    description:
      '저장이 성공한 뒤 갱신 방식에 따라 흐름이 둘로 나뉩니다. updateTag는 즉시 만료해 다음 읽기에서 새 값을 반환하고, revalidateTag는 기존 값을 먼저 반환한 뒤 백그라운드에서 갱신합니다. 왼쪽에서 태그를 바꾸면 함께 영향을 받는 항목도 확인할 수 있습니다.',
    gridDescription: 'updateTag(즉시 만료) vs revalidateTag(SWR)의 다음 읽기 비교',
    modules: ['paintTags', 'useCacheSequence', 'taggedEntries', 'StructureNotes'],
    code: `// 09-revalidating.md:91-163
updateTag('products')              // Server Actions 전용 · 즉시 만료
                                   // → 다음 읽기가 새 값 (read-your-own-writes)
revalidateTag('products', 'max')   // Actions + Route Handlers · SWR
                                   // → 다음 읽기는 구값, 갱신은 백그라운드`,
    component: <CacheTagsDemo />
  }
];
