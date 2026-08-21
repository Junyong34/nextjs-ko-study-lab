/**
 * 셸이 쓰는 데이터 접근 표면입니다.
 *
 * 실제 구현은 책임별로 나눠져 있습니다.
 *   - `docs-root.ts` — nextjs-docs 경로 찾기
 *   - `manifest.ts`  — 문서 색인 읽기와 조회
 *   - `@study/demos` — 데모 목록 (demos.yaml이 단일 원본)
 */
import { getManifest, type DocsManifest, type DocEntry } from './manifest'
import { getDemos, getDemoByUrl, getDemosByDoc, type Demo } from '@study/demos'
import type { TreeNode } from '@study/ui'

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

/**
 * demos.yaml의 데모 데이터를 트리 노드에 결합하여
 * 각 노드의 데모 보유 여부(`hasDemo`, `demoCount`, `demos`)를 포함한 트리를 반환합니다.
 * 기존 문서 노드의 트리 계층(카테고리 - 문서 리프 노드)을 그대로 유지합니다.
 */
export function getAugmentedTree(): TreeNode[] {
  try {
    const manifest = getManifest()
    const allDemos = getDemos()

    const augmentNode = (node: TreeNode): TreeNode => {
      const nodeDemos = node.path ? getDemosByDoc(node.path, allDemos) : []
      const hasDemos = nodeDemos.length > 0
      const children = node.children ? node.children.map(augmentNode) : undefined

      return {
        ...node,
        demos: nodeDemos,
        hasDemo: hasDemos,
        demoCount: nodeDemos.length,
        children,
      }
    }

    return (manifest.tree || []).map(augmentNode)
  } catch (err) {
    console.error('Failed to get augmented tree:', err)
    return []
  }
}
