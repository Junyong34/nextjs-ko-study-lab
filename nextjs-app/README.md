# nextjs-app (Phase 2)

`nextjs-docs/`의 학습 문서를 화면에 그리고, 각 개념의 데모를 실행하는 학습 사이트입니다.

셸과 데모 존 2개가 있으며 데모는 단계적으로 공개합니다. 등록 수와 공개 상태는 [09. 공개 운영 가이드](./docs/09-demo-status-and-stepwise-release-guide.md), 첫 배포 기록과 남은 운영 검증은 [04. 배포 계획](./docs/04-vercel-deployment-plan.md)을 참조하세요.

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

[문서 색인](./docs/README.md)에서 현재 구현 설명, 운영 절차, 백로그와 ADR을 구분해 안내합니다. 시스템 경계는 [ARCHITECTURE](./ARCHITECTURE.md), 코드 탐색과 명령은 [02](./docs/02-codebase-deep-dive-guide.md)를 참조하세요.

## 로컬 실행

저장소 루트에서 실행합니다. Node.js와 pnpm 기준은 루트 `package.json`을 따릅니다.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

셸은 `http://localhost:3000`, baseline은 3001, cache는 3002를 사용합니다. 환경변수 형식은 [04](./docs/04-vercel-deployment-plan.md), 데모 추가·검증은 [05](./docs/05-zone-onboarding-checklist.md)를 따릅니다.

## 스택

- Next.js App Router **16.3.2** + React **19.2.8** + TypeScript + Tailwind CSS v4
- pnpm workspaces + Turborepo (워크스페이스 루트는 저장소 루트)
- 기준 버전은 루트 `pnpm-workspace.yaml`의 catalog 한 곳에서만 선언하며, `nextjs-docs/README.md`의 학습 기준 버전과 같은 값입니다

## 착수 조건 — 충족됨

`nextjs-docs/PROGRESS.md`의 항목이 전부 "완료"입니다 ([Phase Gate](../AGENTS.md#phase-gate) 참고). 셸과 데모 존 2개가 있으며 공개 상태는 09번 가이드에서 관리합니다.

작업 규칙은 [`AGENTS.md`](./AGENTS.md)에 있습니다.
