# [T06] @study/ui 및 @study/docs-render 패키지 구현

- **라벨**: `wayfinder:task`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Blocked
- **선행 티켓**:
  - [T01. 데모 공통 UI 컴포넌트 패키지 위치 결정](./001-decide-demo-ui-package-location.md)
  - [T04. 모노레포 워크스페이스 루트 및 @study/docs 패키지 뼈대 구성](./004-setup-monorepo-workspace-root.md)
- **차단 중**:
  - [T07. apps/shell 앱 생성 및 라우팅/rewrites 결합](./007-setup-apps-shell.md)
  - [T08. apps/demo-baseline 앱 생성 및 Server Actions 배관 데모 구현](./008-setup-apps-demo-baseline.md)
  - [T09. apps/demo-cache-components 앱 생성 및 Caching 배관 데모 구현](./009-setup-apps-demo-cache-components.md)

## Question

앱 전역에서 공유할 공통 UI 및 마크다운 문서 렌더러 패키지를 Internal Package 패턴으로 구현한다.

### 작업 목록
1. **`@study/ui` (또는 `@study/demo-kit`)**:
   - `DemoContainer`: iframe 내부에서 `ResizeObserver`로 높이 측정 후 `postMessage({ type: 'DEMO_RESIZE', height })` 전송하는 클라이언트 래퍼
   - `ExpectedActualPanel`: 기대값과 실제 관찰값을 비교하고 일치 여부(`✓` / `✗`)를 표시하는 컴포넌트
   - `DemoResetButton`: 데모 상태 초기화 버튼
2. **`@study/docs-render`**:
   - `MarkdownRenderer`: `nextjs-docs`의 md 문서를 파싱하여 화면에 렌더링
   - `DemoFrame`: 문서 내부 `demo` 코드펜스를 받아 안전한 origin 검증과 함께 높이를 실시간 동기화하는 iframe 컴포넌트
   - `DocDemoList`: 문서 하단에 해당 문서의 데모 목록(`demos.yaml`과 doc 매핑)을 자동 렌더링하는 컴포넌트
