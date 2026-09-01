# nextjs-app 작업 규칙 (Phase 2)

Next.js 학습 데모 사이트가 들어설 자리다. 셸(`apps/shell`)과 데모 존 2개(`demo-baseline`, `demo-cache-components`)가 구현되어 241개 데모가 `status: done`으로 공개돼 있다. 실제 배포 검증은 아직 남은 작업이며, 절차는 [04. Vercel 배포 계획](./docs/04-vercel-deployment-plan.md)을 따른다.

## 착수 조건 — 충족됨

[`nextjs-docs/PROGRESS.md`](../nextjs-docs/PROGRESS.md)의 항목이 전부 "완료"다 ([루트 Phase Gate](../AGENTS.md#phase-gate) 참고). 개념 증명(PoC, 셸 + 데모 2개, 스모크 배포 없이 로컬 기준)도 끝났다.

## 이 파일의 범위 — 하위 디렉토리 규칙은 따로 있다

아래 규칙은 **이 저장소 어디서 작업하든 적용되는 것만** 남겼다. zone·패키지별로 좁혀지는 규칙은 해당 디렉토리의 `AGENTS.md`에 있고, Claude Code는 작업 대상 경로에 걸리는 `AGENTS.md`를 전부 겹쳐 읽는다 — 즉 아래 표는 "이 작업을 하려면 어디를 먼저 읽어야 하는가"의 지도다.

| 작업 대상 | 규칙 위치 |
|---|---|
| zone 이동/경계, 데모 작성 표준(4단 레이아웃, No-Simulation 등) — `shell`/`demo-baseline`/`demo-cache-components` 공통 | [`apps/AGENTS.md`](./apps/AGENTS.md) |
| 셸 고유 규칙(문서 렌더링, 링크 카드, 스토리지 접두사, nextjs-docs 참조) | [`apps/shell/AGENTS.md`](./apps/shell/AGENTS.md) |
| `demo-baseline` zone 고유 정보(포트, 슬러그) | [`apps/demo-baseline/AGENTS.md`](./apps/demo-baseline/AGENTS.md) |
| `demo-cache-components` zone 고유 정보(포트, 슬러그, `cacheComponents`) | [`apps/demo-cache-components/AGENTS.md`](./apps/demo-cache-components/AGENTS.md) |
| `@study/ui`(셸 전용 UI) 규칙 | [`packages/ui/AGENTS.md`](./packages/ui/AGENTS.md) |
| `@study/demo-kit`(데모 공통 UI) 규칙 | [`packages/demo-kit/AGENTS.md`](./packages/demo-kit/AGENTS.md) |

## 설계 문서를 먼저 읽는다

이 디렉토리에서 작업하기 전에 [`docs/`](./docs/README.md)의 설계 문서와 ADR을 읽는다.

- [01. 화면 구성과 UI 설계](./docs/01-ui-and-screen-design.md) — 페이지 타입 5종, 헤더·검색 UI, UI 기반, 디자인 토큰
- [03. 데모 표준 구조 및 4단 레이아웃 패턴](./docs/03-demo-standard-and-layout-pattern.md) — 실제 Next.js 동작 원칙 및 통일된 fieldset 4단 템플릿
- [04. Vercel 배포 계획](./docs/04-vercel-deployment-plan.md) — zone당 프로젝트 분리, Related Projects, 첫 배포 검증 절차
- [05. Zone / 데모 추가 체크리스트](./docs/05-zone-onboarding-checklist.md) — zone·데모를 새로 추가할 때 따르는 절차
- [용어집 `CONTEXT.md`](./CONTEXT.md) — zone, 셸, 설정 축, 데모 지시자, 기준 버전

## 스택

- Next.js App Router **16.3.2** + React 19 + TypeScript + Tailwind CSS v4
- UI는 **shadcn/ui**를 소스로 복사해 쓴다. 문서 프레임워크(Nextra 등)는 쓰지 않는다 ([ADR 0006](./docs/adr/0006-shadcn-ui-as-ui-foundation.md))
- pnpm workspaces + Turborepo ([ADR 0002](./docs/adr/0002-pnpm-turborepo-catalog-pinning.md))
- 워크스페이스 루트는 **저장소 루트**다. 이 디렉토리가 아니다

## 구조

앱은 **전역 설정 충돌 축**으로 나눈다. 학습 카테고리로 나누지 않는다 ([ADR 0001](./docs/adr/0001-config-axis-as-app-boundary.md)).

```
nextjs-app/
├─ apps/       # zone — 각자 next.config를 온전히 소유하는 독립 Next.js 앱
└─ packages/   # zone들이 공유하는 코드
```

## 지켜야 할 것 — 이 저장소 전체에 적용

1. **버전을 `package.json`에 직접 적지 않는다.** `next`·`react`·`react-dom`은 반드시 `"catalog:"`로 참조한다. 기준 버전이 선언되는 곳은 루트 `pnpm-workspace.yaml` 하나뿐이며, 그 값은 `nextjs-docs/README.md`의 학습 기준 버전과 **항상 같아야 한다** (현재 `16.3.2`). 올릴 때는 두 곳을 같은 커밋에서 고친다.
2. **rewrites 목적지를 하드코딩하지 않는다.** 반드시 환경변수(`ZONE_*_URL`)로 둔다. 로컬↔배포 전환이 이것 하나에 달려 있다.
3. **데모의 존재는 `demos.yaml`이 정한다.** md의 `demo` 코드펜스는 **본문 링크 위치만** 정한다. 지시자를 데모 목록으로 쓰지 않는다 ([ADR 0004](./docs/adr/0004-demo-list-as-source-of-truth.md)).
4. **zone을 추가할 때는** [05. Zone 추가 체크리스트](./docs/05-zone-onboarding-checklist.md)를 그대로 따른다. 항목 하나만 빠져도 그 zone은 사이트에서 보이지 않는다.
5. **Next.js MCP(`next-devtools`)를 적극 활용한다.** 데모 설계 및 구현 시 `next-devtools` MCP(`nextjs_docs`, `nextjs_index`, `nextjs_call`)를 호출하여 `next@16.3.2` 공식 최신 API 스펙, 올바른 시그니처 및 주의사항을 1차 출처로 교차 검증한다.
6. **단일 파일 250줄 제한과 모듈별 분리를 엄격히 준수한다.** 한 파일에 모든 로직을 쏟아붓지 않는다. `page.tsx`(100~150줄 내외, 고수준 조립), `actions.ts`(Server Actions), `types.ts`(타입 정의), `components/*.tsx`(하위 위젯/폼 분리), `hooks/*.ts`(상태 로직)로 분할하여 유지보수성과 가독성을 극대화한다.

## 이미지 포맷

`nextjs-docs`의 캡쳐 이미지는 PNG가 아니라 무손실 WebP(`.webp`)로 저장돼 있다. 이 앱에서 새로 캡쳐하거나 처리하는 이미지도 동일하게 WebP를 쓴다.
