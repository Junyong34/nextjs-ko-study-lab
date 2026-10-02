import { nextjsVisualizeDemos, getDemoBadge, type DemoKey } from './data'
import type { NextjsDemoGroup } from './types'

export const visualizeGroupLabels: Record<NextjsDemoGroup, string> = {
  timeline: '타임라인 비교',
  nextjs: '구조와 흐름',
  'cache-components': 'Cache Components',
}

const summaries: Partial<Record<DemoKey, string>> = {
  'streaming-timeline': '일괄 SSR과 스트리밍의 첫 화면 표시 시점을 비교합니다.',
  'hydration-timeline': '일괄 수화와 선택적 수화에서 클릭이 처리되는 시점을 비교합니다.',
  'ppr-timeline': '전체 동적 렌더링과 정적 셸·동적 영역의 스트리밍을 비교합니다.',
  'transitions-timeline': '동기 렌더링과 작업을 나누는 렌더링의 입력 지연을 비교합니다.',
  'optimistic-timeline': '서버 응답을 기다리는 UI와 먼저 반영하는 낙관적 UI를 비교합니다.',
  'isr-timeline': '재생성을 기다리는 응답과 기존 값을 먼저 반환하는 응답을 비교합니다.',
  'streaming-waterfall': '서버 청크의 도착 시점과 브라우저 화면이 채워지는 과정을 연결합니다.',
  'isr-cache': '요청 시점에 따른 HIT·STALE 응답과 백그라운드 재생성을 확인합니다.',
  'render-tree': 'URL 세그먼트와 중첩 레이아웃, 렌더 순서를 연결합니다.',
  'metadata-flow': 'metadata 평가 순서와 얕은 병합이 최종 head에 미치는 영향을 확인합니다.',
  'render-strategy': 'SSG·SSR·CSR과 정적 셸·동적 영역의 실행 위치를 비교합니다.',
  'cache-shell': '정적 셸에 포함되는 영역과 요청 시 스트리밍되는 영역을 구분합니다.',
  'cache-keys': 'use cache 경계와 인자에 따른 캐시 키·HIT·MISS를 확인합니다.',
  'cache-lifetime': '클라이언트 stale과 서버 revalidate·expire의 시간축을 비교합니다.',
  'cache-tags': 'updateTag와 revalidateTag 이후의 읽기·갱신 방식을 비교합니다.',
  'cache-mall': '상품·상세·장바구니 요청에서 캐시와 원본 서버를 지나는 경로를 추적합니다.',
  'cache-regions': '정적 셸·컴포넌트 캐시·함수 캐시·캐시 없는 영역의 데이터 경로를 비교합니다.',
}

export const visualizeCatalog = nextjsVisualizeDemos.map((demo) => ({
  ...demo,
  summary: summaries[demo.key] ?? demo.gridDescription,
  badge: getDemoBadge(demo),
}))

export type VisualizeEntry = (typeof visualizeCatalog)[number]
