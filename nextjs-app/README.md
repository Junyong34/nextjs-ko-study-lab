# nextjs-app (Phase 2)

`nextjs-docs/`의 학습 문서를 화면에 그리고, 각 개념의 데모를 실행하는 학습 사이트입니다.

**셸과 데모 존 2개, 241개 데모 구현이 완료됐습니다. 실제 배포(Vercel) 검증은 아직 남은 작업입니다 — 절차는 [04](./docs/04-vercel-deployment-plan.md).**

## 무엇을 만드는가

학습자에게는 **사이트 하나**로 보이지만, 뒤에서는 여러 개의 독립 Next.js 앱(zone)이 동작합니다. 앱을 나누는 이유는 관리 편의가 아니라 기술적 불가피성입니다 — `cacheComponents`처럼 앱 전역 설정으로만 켤 수 있는 개념은, 켠 상태와 끈 상태를 한 앱에서 동시에 보여줄 수 없기 때문입니다.

```
학습자: study.example.com/getting-started/caching
              │
              ▼
        셸 (문서 렌더 + 데모 색인·독립 열람 + 정문)
              │  rewrites — 주소창은 그대로
      ┌───────┴───────┐
      ▼               ▼
 /zone/baseline/*  /zone/cache/*
 cacheComponents 끔  cacheComponents 켬
```

데모는 **언제나 독립 페이지로 열립니다.** 문서 본문에는 심지 않고 링크로 넘깁니다 ([01](./docs/01-ui-and-screen-design.md)). 학습자가 보는 주소에는 zone이 나타나지 않습니다 — 데모를 다른 zone으로 옮겨도 주소가 깨지지 않게 하기 위해서입니다.

## 설계 문서

작업 전에 [`docs/`](./docs/README.md)를 먼저 읽어주세요.

| # | 문서 |
|---|---|
| 01 | [화면 구성과 UI 설계](./docs/01-ui-and-screen-design.md) |
| 02 | [코드베이스 심층 분석 및 데이터 흐름 가이드](./docs/02-codebase-deep-dive-guide.md) |
| 03 | [데모 표준 구조 및 4단 레이아웃 패턴](./docs/03-demo-standard-and-layout-pattern.md) |
| 04 | [Vercel 배포 계획](./docs/04-vercel-deployment-plan.md) |
| 05 | [Zone / 데모 추가 체크리스트](./docs/05-zone-onboarding-checklist.md) |
| 06 | [학습 기록 기능 설계](./docs/06-learning-progress-design.md) |

ADR 9건과 용어집은 [`docs/README.md`](./docs/README.md)에 정리돼 있습니다.

## 스택

- Next.js App Router **16.3.2** + React **19.2.8** + TypeScript + Tailwind CSS v4
- pnpm workspaces + Turborepo (워크스페이스 루트는 저장소 루트)
- 기준 버전은 루트 `pnpm-workspace.yaml`의 catalog 한 곳에서만 선언하며, `nextjs-docs/README.md`의 학습 기준 버전과 같은 값입니다

## 착수 조건 — 충족됨

`nextjs-docs/PROGRESS.md`의 항목이 전부 "완료"입니다 ([Phase Gate](../AGENTS.md#phase-gate) 참고). 셸과 데모 존 2개, 241개 데모가 구현돼 있습니다.

작업 규칙은 [`AGENTS.md`](./AGENTS.md)에 있습니다.
