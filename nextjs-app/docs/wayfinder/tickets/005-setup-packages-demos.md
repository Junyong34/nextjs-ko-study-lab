# [T05] @study/demos 패키지 구성 및 유효성 검사기 구현

- **라벨**: `wayfinder:task`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Blocked
- **선행 티켓**:
  - [T02. demos.yaml 검증 방식 및 URL lint 위치 결정](./002-decide-demos-yaml-validation-and-lint-placement.md)
  - [T04. 모노레포 워크스페이스 루트 및 @study/docs 패키지 뼈대 구성](./004-setup-monorepo-workspace-root.md)
- **차단 중**:
  - [T07. apps/shell 앱 생성 및 라우팅/rewrites 결합](./007-setup-apps-shell.md)
  - [T08. apps/demo-baseline 앱 생성 및 Server Actions 배관 데모 구현](./008-setup-apps-demo-baseline.md)
  - [T09. apps/demo-cache-components 앱 생성 및 Caching 배관 데모 구현](./009-setup-apps-demo-cache-components.md)

## Question

데모 목록의 단일 원본인 `demos.yaml`과 이를 검증/로딩/스텁 생성하는 `@study/demos` 패키지를 구성한다.

### 작업 목록
1. **`nextjs-app/packages/demos/package.json`**: name `@study/demos`, `build` (검증 및 `demos-manifest.json` 생성)
2. **`demos.yaml`**: 초기 배관 데모 2종(`caching/basic`, `server-actions/basic`) 선언
3. **`src/index.ts`**: Zod 기반 스키마 및 YAML 파싱/로더 함수 export
4. **`scripts/lint.mjs`**:
   - URL 유일성 검사
   - md 코드펜스 `path` ↔ 목록 대조
   - `status: done` 데모의 실제 진입점 라우트 존재 여부 검사
   - 캐시 태그 접두사 규칙 검사
5. **`scripts/gen-stubs.mjs`**: 목록 기반으로 zone 내부 스텁 라우트 폴더 및 `page.tsx` 뼈대 자동 생성기
