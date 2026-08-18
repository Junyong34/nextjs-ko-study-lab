# nextjs-ko-study-lab

Next.js App Router 공식 문서(nextjs.org/docs/app)를 한국어 학습 커리큘럼으로 재구성하는 저장소입니다. 문서 설계가 먼저이고, 실행 가능한 데모 앱은 그 다음입니다.

## 저장소 구조

```
nextjs-ko-study-lab/
├─ nextjs-docs/   # 학습 문서 (Phase 1, 진행 중) — 공식 사이드바 구조를 미러링한 번역·학습 콘텐츠
├─ nextjs-app/    # Next.js 데모 사이트 (Phase 2, 설계 완료·착수 전) — 설계 문서만 있고 코드는 아직 없음
├─ CONTEXT-MAP.md # 두 컨텍스트(학습 문서 / 데모 사이트)의 용어집과 관계
├─ AGENTS.md      # 저장소 전체 작업 규칙 (Codex 등) — Claude Code는 CLAUDE.md를 통해 동일 내용을 읽음
├─ CLAUDE.md
├─ LICENSE
└─ README.md
```

각 디렉토리에는 그 디렉토리 작업에 특화된 `AGENTS.md`가 있고, 그 디렉토리의 `CLAUDE.md`는 `@AGENTS.md`로 동일 내용을 가리킵니다 (Claude Code의 import 문법). Codex 등 AGENTS.md만 읽는 도구도, Claude Code도 결국 같은 내용을 보게 됩니다.

## Phase

1. **Phase 1: 문서화** (진행 중) — [`nextjs-docs/`](./nextjs-docs/README.md)에서 공식 문서를 학습 목표·핵심 개념·연습 문제 중심으로 재구성합니다. 코드보다 md 문서가 먼저입니다.
2. **Phase 2: 데모 사이트** (설계 완료, 착수 전) — [`nextjs-app/`](./nextjs-app/README.md)에 학습 문서를 화면에 그리고 각 개념의 데모를 실행하는 사이트를 만듭니다. 여러 개의 독립 Next.js 앱(zone)을 Multi-Zones로 한 도메인에 결합하는 구조이며, 조사와 설계는 [`nextjs-app/docs/`](./nextjs-app/docs/README.md)에 정리돼 있습니다. 실제 착수는 `nextjs-docs/`의 학습이 대부분 "완료" 상태가 된 뒤입니다.

## 학습 문서 바로가기

- [학습 문서 목차 및 흐름](./nextjs-docs/README.md)
- [전체 진행 상태 트래킹](./nextjs-docs/PROGRESS.md)
- [문서 작성 규칙](./nextjs-docs/AGENTS.md)

## 데모 사이트 설계 바로가기

- [설계 문서 목차](./nextjs-app/docs/README.md)
- [모노레포 구성 방식 조사와 선택](./nextjs-app/docs/02-monorepo-options.md)
- [결합 구조 설계](./nextjs-app/docs/03-composition-architecture.md)
- [프로젝트 구성 방법 및 절차](./nextjs-app/docs/01-project-setup.md)

## 기준 출처

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- 학습 기준 Next.js 버전은 [`nextjs-docs/README.md`](./nextjs-docs/README.md#기준-출처)에 고정되어 있습니다.

## License

[MIT](./LICENSE)
