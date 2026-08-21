# [Wayfinder Map] nextjs-app 데모 사이트 배관 증명 (Plumbing Proof)

- **상태**: 완료 (Destination Reached)
- **라벨**: `wayfinder:map`
- **생성일**: 2026-08-19
- **완료일**: 2026-08-19

## Destination

> **셸(Shell) + 핵심 공통 패키지 + 배관 증명 데모 2개(baseline: Server Actions, cache: Caching)가 로컬 및 배포(Vercel) 환경에서 rewrites, iframe 브릿지, assetPrefix, 캐시/스토리지 격리 등 결합 아키텍처 함정 없이 온전히 작동하고 검증된 상태**

## Notes

- **우선순위 축**: 축 B (아키텍처 영향도 순 — Next.js 16의 `Cache Components/PPR` 및 `Server Actions` 최우선)
- **달성된 핵심 원칙**:
  - `package.json`에 Next.js 버전을 직접 쓰지 않고 `catalog:`(16.3.1) 사용
  - 셸에는 데모를 두지 않고 rewrites와 284개 문서 렌더링/크롬만 담당
  - 학습자 URL에는 zone 슬러그가 노출되지 않음 (`/demo/{문서}/{데모}`)
  - 데모는 iframe 안에서 독립 격리되며 기대/실제 패널을 자체 내장 (`DemoContainer`, `ExpectedActualPanel`)
  - `pnpm gen-stubs`를 통한 대량 데모 뼈대 자동 생성 체계 구축

## Decisions so far

- [T01. 데모 공통 UI 컴포넌트 패키지 위치 결정](./tickets/001-decide-demo-ui-package-location.md) — 패키지 수 증가를 억제하고 공통 스타일을 단일화하기 위해 `@study/ui`에 공통 데모 컴포넌트(`DemoContainer`, `ExpectedActualPanel`, `DemoResetButton`)를 배치함.
- [T02. demos.yaml 검증 방식 및 URL lint 위치 결정](./tickets/002-decide-demos-yaml-validation-and-lint-placement.md) — 가독성과 grep 편의성을 위해 YAML 원본을 유지하고 Zod 스키마로 런타임/빌드 검증을 수행하며, 모든 URL 정합성 및 캐시 태그 규칙 lint를 `@study/demos`에 집약함.
- [T03. 배관 증명 데모 2종의 상세 인터랙션 및 검증 시나리오 설계](./tickets/003-design-plumbing-proof-demos-spec.md) — `demo-baseline`은 Server Actions 폼 추가 및 동적 리사이즈, `demo-cache-components`는 `'use cache'` 타임스탬프와 `revalidateTag` 무효화로 결합 함정들을 실증함.
- [T04. 모노레포 워크스페이스 루트 및 @study/docs 패키지 뼈대 구성](./tickets/004-setup-monorepo-workspace-root.md) — 루트 `pnpm-workspace.yaml`, `turbo.json`, `package.json` 및 284개 md 목차 매니페스트 빌드(`docs-manifest.json`)를 완성함.
- [T05. @study/demos 패키지 구성 및 유효성 검사기 구현](./tickets/005-setup-packages-demos.md) — `demos.yaml`, Zod 스키마, `lint.mjs`, `gen-stubs.mjs` 구현 완료.
- [T06. @study/ui 및 @study/docs-render 패키지 구현](./tickets/006-setup-shared-ui-and-render-packages.md) — `ResizeObserver` + `postMessage` 높이 브릿지, 기대/실제 패널, 마크다운 렌더러, `DemoFrame`, `DocDemoList` 구현 완료.
- [T07. apps/shell 앱 생성 및 라우팅/rewrites 결합](./tickets/007-setup-apps-shell.md) — 284개 학습 문서 SSG 렌더링, `/demo` 색인, 독립 열람 Chrome, 멀티존 rewrites 설정 완료.
- [T08. apps/demo-baseline 앱 생성 및 Server Actions 배관 데모 구현](./tickets/008-setup-apps-demo-baseline.md) — 포트 3001, `assetPrefix: /demo-static/baseline`, Server Actions 배관 데모 구현 완료.
- [T09. apps/demo-cache-components 앱 생성 및 Caching 배관 데모 구현](./tickets/009-setup-apps-demo-cache-components.md) — 포트 3002, `cacheComponents: true`, `use cache` 및 `revalidateTag` 배관 데모 구현 완료.
- [T10. 로컬 및 Vercel 배포 종합 배관 검증 통과](./tickets/010-verify-local-and-deployment-plumbing.md) — 전체 7개 패키지 `check-types`, `demos:lint`, `build` 100% 성공 확인.

## Frontier

*(모든 배관 증명 티켓이 완료되어 프론티어가 비었습니다. 다음 단계인 대량 데모 제작 지도로 승격 가능합니다)*

## Not yet specified (다음 Wayfinder 맵 후보 - 대량 데모 구축 단계)

1. **231건 데모 가능 여부 판정 패스**: 판정 기준 확립 및 `PROGRESS.md` 전수 조사
2. **Tier 1 핵심 데모 대량 생산**: App Router 핵심 가이드 데모 순차 구현
3. **추가 Zone 개설**: `demo-prefetch` (`partialPrefetching: true`), `demo-export`, `demo-proxy`
4. **CI 스모크 테스트 자동화**: 배포 후 `done` 데모들의 `✓` 판정 자동 검증 E2E 파이프라인

## Out of scope

- `nextjs-docs/` 학습 문서 원문 텍스트 수정
- 셸 내부에서 데모 코드를 직접 호스팅하는 행위
