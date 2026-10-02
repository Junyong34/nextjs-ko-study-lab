import type { SlashCase } from '../types'

export const BASE = '/zone/baseline/config/trailing-slash/url-normalization'

// 서버 probe는 이 목록의 id만 받는다(임의 URL 요청 방지).
export const CASES: SlashCase[] = [
  {
    id: 'page',
    label: '페이지 · 슬래시 없음',
    path: `${BASE}/catalog`,
    expectStatus: 200,
    expectLocation: null,
    ifTrue: '308 → /catalog/',
  },
  {
    id: 'page-slash',
    label: '페이지 · 끝 슬래시',
    path: `${BASE}/catalog/`,
    expectStatus: 308,
    expectLocation: `${BASE}/catalog`,
    ifTrue: '200 (정규 URL)',
  },
  {
    id: 'query-slash',
    label: '끝 슬래시 + 쿼리',
    path: `${BASE}/catalog/?sort=price&page=2`,
    expectStatus: 308,
    expectLocation: `${BASE}/catalog?sort=price&page=2`,
    ifTrue: '200 (정규 URL)',
  },
  {
    id: 'file',
    label: '확장자 경로 · 슬래시 없음',
    path: `${BASE}/catalog/spec.txt`,
    expectStatus: 200,
    expectLocation: null,
    ifTrue: '200 (확장자 예외, 슬래시를 붙이지 않음)',
  },
  {
    id: 'file-slash',
    label: '확장자 경로 · 끝 슬래시',
    path: `${BASE}/catalog/spec.txt/`,
    expectStatus: 308,
    expectLocation: `${BASE}/catalog/spec.txt`,
    ifTrue: '308 → /catalog/spec.txt (확장자 경로는 true에서도 슬래시를 떼어 냄)',
  },
  {
    id: 'root',
    label: '앱 루트 /',
    path: '/',
    expectStatus: 200,
    expectLocation: null,
    ifTrue: '200 (루트는 원래 /)',
  },
]
