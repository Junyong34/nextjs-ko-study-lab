/**
 * 셸이 쓰는 데이터 접근 표면입니다.
 *
 * 실제 구현은 책임별로 나눠져 있습니다.
 *   - `docs-root.ts` — nextjs-docs 경로 찾기
 *   - `manifest.ts`  — 문서 색인 읽기와 조회
 *   - `@study/demos` — 데모 목록 (demos.yaml이 단일 원본)
 */
export { getDocsRoot } from './docs-root'
export {
  getManifest,
  getDocBySlug,
  getDocContent,
  findDocForDemo,
  type DocEntry,
  type DocsManifest,
} from './manifest'
export { getDemos, getDemoByUrl, getDemosByDoc, type Demo } from '@study/demos'

// 좌측 트리가 그리는 노드 타입은 @study/ui가 소유합니다 (화면 계약이므로).
export type { TreeNode } from '@study/ui'
