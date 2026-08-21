# nextjs-app (Phase 2)

`nextjs-docs/`의 학습 문서를 화면에 그리고, 각 개념의 데모를 실행하는 학습 사이트가 들어설 자리입니다.

**설계 및 멀티 존 기본 뼈대/공통 패키지 구축과 리팩토링이 완료된 상태입니다.**

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

데모는 **언제나 독립 페이지로 열립니다.** 문서 본문에는 심지 않고 링크로 넘깁니다 ([06](./docs/06-ui-and-screen-design.md)). 학습자가 보는 주소에는 zone이 나타나지 않습니다 — 데모를 다른 zone으로 옮겨도 주소가 깨지지 않게 하기 위해서입니다.

## 설계 문서

착수 전에 [`docs/`](./docs/README.md)를 먼저 읽어주세요.

| # | 문서 |
|---|---|
| 01 | [프로젝트 구성 방법 및 절차](./docs/01-project-setup.md) |
| 02 | [모노레포 구성 방식 조사와 선택](./docs/02-monorepo-options.md) |
| 03 | [결합 구조 설계](./docs/03-composition-architecture.md) |
| 04 | [설계 실현 가능성 검증](./docs/04-feasibility-verification.md) |
| 05 | [남은 설계 질문](./docs/05-open-questions.md) |
| 06 | [화면 구성과 UI 설계](./docs/06-ui-and-screen-design.md) |

ADR 6건과 용어집은 [`docs/README.md`](./docs/README.md)에 정리돼 있습니다.

01~03의 사실 주장은 `next@16.3.1`의 소스와 동봉 문서에 대조해 검증했고, 지적된 12건은 모두 반영했습니다 (04). 아직 안 정한 것은 05에 모아뒀습니다.

## 스택

- Next.js App Router **16.3.1** + React **19.2.8** + TypeScript + Tailwind CSS v4
- pnpm workspaces + Turborepo (워크스페이스 루트는 저장소 루트)
- 기준 버전은 루트 `pnpm-workspace.yaml`의 catalog 한 곳에서만 선언하며, `nextjs-docs/README.md`의 학습 기준 버전과 같은 값입니다

## 착수 조건

`nextjs-docs/PROGRESS.md`의 항목이 대부분 "완료"가 되어야 합니다 ([Phase Gate](../AGENTS.md#phase-gate) 참고).

작업 규칙은 [`AGENTS.md`](./AGENTS.md)에 있습니다.
