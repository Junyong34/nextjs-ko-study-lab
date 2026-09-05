# 02. 코드베이스 심층 분석 및 데이터 흐름 가이드

2026-09-05 소스 기준의 코드 탐색 지도다. 시스템 경계와 요청 다이어그램은 [ARCHITECTURE](../ARCHITECTURE.md), 실행·공개 절차는 [05](./05-zone-onboarding-checklist.md)와 [09](./09-demo-status-and-stepwise-release-guide.md)를 따른다.

## 1. 코드 탐색 지도

아래 첫 경로는 `nextjs-app/` 기준이다. 같은 셀의 짧은 파일명은 첫 파일과 같은 디렉토리, `src/`로 시작하는 경로는 같은 앱·패키지 루트를 기준으로 읽는다. 패키지 구현 파일은 `src/` 아래에 있다.

| 작업 | 먼저 볼 코드 |
|---|---|
| 문서 원본 찾기 | `apps/shell/src/lib/docs-root.ts` |
| 문서 조회·내용 읽기 | `apps/shell/src/lib/manifest.ts` |
| 셸 데이터 접근·트리 결합 | `apps/shell/src/lib/docs.ts` |
| 문서 변환 | `packages/docs-render/src/markdown/MarkdownRenderer.tsx` |
| 데모 조회 | `packages/demos/src/index.ts` |
| 색인 검색·정렬·페이지 | `apps/shell/src/lib/demo-index.ts`, `demo-index-items.ts` |
| 문서별 허브·직접 실행 분기 | `apps/shell/src/app/demo/[...slug]/page.tsx` |
| 목록 복원 | `apps/shell/src/components/demo/useDemoListRestoration.ts`, `src/lib/demo-storage.ts` |
| 홈 구성 | `apps/shell/src/app/page.tsx`, `src/components/home/` |
| 학습 기록 | `apps/shell/src/lib/learning-progress/`, `src/components/learning-progress/` |
| 공유 도메인·zone 메타데이터 | `packages/demos/src/metadata.ts` |
| 셸 SEO | `apps/shell/src/lib/seo/`, `src/app/robots.ts`, `src/app/sitemap.ts` |
| 피드백·공유·GitHub 안내 | `packages/ui/src/feedback/`, `src/share/`, `apps/shell/src/components/github-star/` |

## 2. 원본과 생성물

### 2.1 기준 버전

저장소 루트 `pnpm-workspace.yaml`이 Next.js·React 버전을 선언한다. 앱의 `package.json`은 `catalog:`로 참조한다. 설치 도구·Node 기준은 루트 `package.json`, 설치 결과는 `pnpm-lock.yaml`을 대조한다.

### 2.2 데모 생성 흐름

현재 소비 경로는 둘이다.

- 셸·본문: `demos.yaml` → `@study/demos`의 `loadDemos()`·`getDemos()` → 셸 → 렌더러 props. 기본 조회는 YAML을 읽는다.
- 공유 zone 메타데이터: `demos.yaml` → `packages/demos/scripts/build-manifest.mjs` → `demos-manifest.json` → `packages/demos/src/metadata.ts`.

따라서 YAML과 생성 JSON을 함께 유지해야 한다. 생성 JSON만을 모든 화면의 입력으로 설명하지 않는다.

빌더의 Zod 스키마는 필드 형식과 상태·zone 값을 확인한다. URL 중복, 문서 연결, 코드펜스·라우트 검증은 `scripts/lint.mjs`의 별도 역할이다. 매니페스트 build 성공을 전체 검증으로 설명하지 않는다.

`gen-stubs.mjs`는 zone과 앱 디렉토리 매핑을 사용한다. `cache`의 앱 이름은 `demo-cache-components`이므로 `demo-${zone}`으로 경로를 추정하지 않는다. 생성 명령은 실행 코드를 쓰므로 문서만 고칠 때 실행하지 않는다.

### 2.3 문서 생성 흐름

저장소 루트의 `nextjs-docs/scripts/build-manifest.mjs`가 콘텐츠를 읽어 `docs-manifest.json`을 만든다. 셸은 문서 slug를 조회하고 해당 Markdown을 렌더링한다. 매니페스트 전체 항목 수, 실제 상세 페이지 수, 학습 기록 inventory 수는 목적과 제외 규칙이 달라 같은 수라고 가정하지 않는다.

## 3. 패키지 격리 정책

셸 UI는 `@study/ui`, 데모 UI는 `@study/demo-kit`에 둔다. Markdown과 문서 지시자 렌더링은 `@study/docs-render`가 맡는다. 전체 의존 경계는 [ARCHITECTURE](../ARCHITECTURE.md), 제작 표준은 [03](./03-demo-standard-and-layout-pattern.md)을 참조한다.

## 4. 명령과 검사 범위

모든 명령은 저장소 루트에서 실행한다. 최초 설치는 `pnpm install --frozen-lockfile`을 사용한다.

| 명령 | 역할·주의 |
|---|---|
| `pnpm dev` | 세 앱의 개발 서버 실행 |
| `pnpm build` | Turbo 의존 순서로 패키지·앱 빌드. 생성 매니페스트를 갱신할 수 있음 |
| `pnpm check-types` | 워크스페이스 타입 검사 |
| `pnpm --filter @study/demos lint` | 데모 목록·문서·라우트·지시자 검사. 경고도 검토 |
| `pnpm --filter @study/demos build` | 데모 매니페스트 생성 |
| `pnpm gen-stubs` | 데모 진입점 코드 생성. 단순 검사가 아님 |
| `pnpm test:manifest` | 라우트·매니페스트 정합성 검사 |
| `pnpm test:guide` | 가이드 일관성 검사 |
| `pnpm test` | test-suite의 전체 runner. 실제 검사 범위는 runner와 결과로 판단 |

`test:guide-audit`는 보고서를 쓰는 명령이다. 현재 스크립트 인자는 `--report=docs/14-demo-guide-audit-report.md`로, 현행 문서 색인에 없는 과거 보고서 이름을 사용한다. 출력 경로 정비는 별도 구현 후속 항목이며 문서 검증 목적으로 무심코 실행하지 않는다.

## 5. 런타임 추적

### 5.1 Multi-zones 프록시

셸 `next.config.ts`의 host 조회와 rewrites에서 시작해 해당 zone `next.config.ts`와 `src/app/zone/` 라우트를 확인한다. 직접 zone 요청과 셸 프록시 요청을 각각 비교한다. 환경변수 형식은 [04](./04-vercel-deployment-plan.md)를 따른다.

### 5.2 Iframe Height Bridge

송신: `packages/demo-kit/src/useResizeBridge.ts`. 수신: `packages/docs-render/src/demo/useDemoResizeBridge.ts`. 메시지 타입은 `DEMO_RESIZE`다. 컨테이너 관찰·origin/source 검사·2px 변화 기준이 양쪽에서 맞는지 확인한다.

### 5.3 Server Actions

두 zone은 `withRelatedProject({ projectName: 'study-shell', defaultHost: ... })`로 얻은 host를 `experimental.serverActions.allowedOrigins`에 넣는다. 실제 학습자 host와 일치하는지는 배포 환경에서 확인한다.

## 6. 변경 시 함께 볼 문서

UI 변경은 [01](./01-ui-and-screen-design.md), 제작 방식은 [03](./03-demo-standard-and-layout-pattern.md), zone 추가는 [05](./05-zone-onboarding-checklist.md), 학습 기록은 [06](./06-learning-progress-design.md), SEO는 [07](./07-seo-plan.md), 공개 상태는 [09](./09-demo-status-and-stepwise-release-guide.md)를 갱신한다. 미해결 코드 차이는 [최신화 기록](./maintenance/2026-09-05-documentation-refresh.md)에 남긴다.
