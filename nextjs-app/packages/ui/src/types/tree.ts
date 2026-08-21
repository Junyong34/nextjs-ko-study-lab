/**
 * 좌측 문서 트리가 그리는 노드입니다.
 *
 * 타입 소유권이 `@study/ui`에 있는 이유: 이 패키지의 컴포넌트가 props로 받는 화면 계약이라
 * 셸의 `lib/`에 두면 `@study/ui` → `apps/shell` 역방향 의존이 생깁니다.
 * 셸은 `docs-manifest.json`을 읽어 이 모양으로 넘기기만 합니다.
 */
export interface TreeNode {
  title: string
  url: string
  path: string
  order?: string
  section?: string
  demos?: unknown[]
  hasDemo?: boolean
  demoCount?: number
  isDemoItem?: boolean
  children?: TreeNode[]
}
