# nextjs-app (Phase 2)

`nextjs-docs/`의 학습 문서를 화면에 그리고, 각 개념의 데모를 실행하는 학습 사이트가 들어설 자리입니다.

**설계는 완료됐고 실행 코드는 아직 없습니다.**

## 무엇을 만드는가

학습자에게는 **사이트 하나**로 보이지만, 뒤에서는 여러 개의 독립 Next.js 앱(zone)이 동작합니다. 앱을 나누는 이유는 관리 편의가 아니라 기술적 불가피성입니다 — `cacheComponents`처럼 앱 전역 설정으로만 켤 수 있는 개념은, 켠 상태와 끈 상태를 한 앱에서 동시에 보여줄 수 없기 때문입니다.

```
학습자: study.example.com/guides/isr-cache-components
              │
              ▼
        셸 (문서 렌더 + 정문)
              │  rewrites — 주소창은 그대로
      ┌───────┴───────┐
      ▼               ▼
 /demo/baseline/*  /demo/cache/*
 cacheComponents 끔  cacheComponents 켬
```

문서를 읽다가 그 자리에서 데모를 조작할 수 있도록, 문서 본문에 데모를 심습니다.

## 설계 문서

착수 전에 [`docs/`](./docs/README.md)를 먼저 읽어주세요.

| # | 문서 |
|---|---|
| 01 | [프로젝트 구성 방법 및 절차](./docs/01-project-setup.md) |
| 02 | [모노레포 구성 방식 조사와 선택](./docs/02-monorepo-options.md) |
| 03 | [결합 구조 설계](./docs/03-composition-architecture.md) |

ADR 3건과 용어집은 [`docs/README.md`](./docs/README.md)에 정리돼 있습니다.

## 스택

- Next.js App Router **16.3.1** + React 19 + TypeScript + Tailwind CSS
- pnpm workspaces + Turborepo (워크스페이스 루트는 저장소 루트)

## 착수 조건

`nextjs-docs/PROGRESS.md`의 항목이 대부분 "완료"가 되어야 합니다 ([Phase Gate](../AGENTS.md#phase-gate) 참고).

작업 규칙은 [`AGENTS.md`](./AGENTS.md)에 있습니다.
