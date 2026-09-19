/**
 * @fileoverview showcase-cache-demos Data
 * Cache Components 6종 메타데이터. 앞 4종은 각각 "핵심 그림" 하나를 갖는다 —
 * 셸 경계 상자 · 경계선과 키 조립 · 두 시간축 · 두 갈래 비교.
 * 5번째(`cache-mall`)는 앞 세 개념(cacheLife·cacheTag·동적 예외)을 쇼핑몰 스토리 하나로
 * 묶어 통합 체감하게 하는 데모다 — 브라우저 → 레인 3개 → 원본 서버의 요청 추적도.
 * 6번째(`cache-regions`)는 한 페이지의 네 영역이 각기 다른 캐시 경계(정적 셸 · 컴포넌트 캐시 ·
 * 함수 캐시 · 캐시 없음)로 데이터를 가져와 화면에 닿는 경로를 나란히 비교한다.
 */

import React from 'react';
import type { DemoMeta } from './showcase-types';
import { CacheShellDemo } from './CacheShellDemo';
import { CacheKeysDemo } from './CacheKeysDemo';
import { CacheLifetimeDemo } from './CacheLifetimeDemo';
import { CacheTagsDemo } from './CacheTagsDemo';
import { CacheMallDemo } from './CacheMallDemo';
import { CachePageRegionsDemo } from './CachePageRegionsDemo';

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
    keywords: ['Next.js Cache Components', 'Next.js use cache 셸', 'Next.js 정적 셸', 'Next.js 부분 캐싱'],
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
    keywords: ['Next.js use cache', 'Next.js 캐시 키', 'next-request-in-use-cache', 'Next.js Cache Components'],
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
    keywords: ['Next.js cacheLife', 'Next.js stale revalidate expire', 'Next.js 캐시 수명', 'Next.js Cache Components'],
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
    keywords: ['Next.js updateTag', 'Next.js revalidateTag', 'Next.js 캐시 태그', 'Next.js Cache Components'],
    component: <CacheTagsDemo />
  },
  {
    ...common,
    key: 'cache-mall',
    title: '쇼핑몰로 보는 캐시 설정',
    description:
      '스터디몰 홈페이지 한 번의 요청이 세 구역을 동시에 지납니다. 베스트셀러 진열대는 use cache와 cacheLife로 수명을 정한 캐시에서 돌아오고, 상품 상세는 cacheTag가 붙어 관리자의 updateTag()·revalidateTag()에 따라 다음 요청이 달라지며, 장바구니는 cookies()를 읽어야 해서 매번 원본 서버까지 갑니다. 시계를 흘려 수명을 넘기고 페이지 요청을 보내면 점 3개가 어디서 돌아오는지가 곧 캐시의 답입니다.',
    gridDescription: '한 페이지 요청 → 세 레인 — 캐시에서 돌아오나(HIT·STALE), 서버까지 가나(EXPIRED·동적)',
    modules: ['paintMall', 'useCacheMallSim', 'sendPageRequest', 'StructureControls', 'StructureNotes'],
    keywords: ['Next.js cacheLife 예시', 'Next.js updateTag revalidateTag 비교', 'Next.js Cache Components 실전', 'Next.js 캐시 스토리텔링'],
    component: <CacheMallDemo />
  },
  {
    ...common,
    key: 'cache-regions',
    title: '한 페이지, 영역별 캐시 경계',
    description:
      "같은 페이지 안에서도 영역마다 캐시 전략이 다릅니다. 헤더는 데이터가 없어 정적 셸에 들어가고, 상품 목록은 컴포넌트 첫 줄의 'use cache'로 렌더 결과째 캐시되며, 환율 배너는 cookies()를 읽어 요청마다 렌더하되 getRate() 함수 결과만 재사용하고, 맞춤 추천은 캐시 없이 매번 서버에서 렌더해 스트리밍됩니다. 한 번의 요청을 재생하면 네 영역의 데이터가 원천 → 캐시 계층 → 화면으로 어떤 경로를 지나 언제 도착하는지, 캐시가 비어 있을 때 무엇이 늦어지는지가 보입니다.",
    gridDescription: '정적 셸 · use cache 컴포넌트 · use cache 함수 · 캐시 없음 — 영역별 원천 → 캐시 → 화면 경로 비교',
    modules: ['paintRegions', 'flowStepsFor', 'RegionCodeMap', 'useTimelinePlayback', 'StructureNotes'],
    keywords: ['Next.js use cache 컴포넌트 함수 차이', 'Next.js 부분 캐싱 영역', 'Next.js cookies 캐시 불가', 'Next.js Cache Components 페이지 구성'],
    component: <CachePageRegionsDemo />
  }
];
