# nextjs-ko-study-lab

Next.js App Router 공식 문서(nextjs.org/docs/app)를 한국어 학습 커리큘럼으로 재구성하고, 실행 가능한 데모 사이트로 실습을 더하는 저장소입니다.

## 저장소 구조

```
nextjs-ko-study-lab/
├─ nextjs-docs/   # Next.js App Router 학습 문서 194편 (Phase 1, 완료)
├─ nextjs-app/    # Next.js 데모 사이트 — 데모 241건 (Phase 2, 진행 중)
├─ CONTEXT-MAP.md # 컨텍스트 용어집과 관계
├─ AGENTS.md      # 저장소 전체 작업 규칙
├─ CLAUDE.md
├─ LICENSE
└─ README.md
```

각 디렉토리에는 그 디렉토리 작업에 특화된 `AGENTS.md`가 있고, 그 디렉토리의 `CLAUDE.md`는 `@AGENTS.md`로 동일 내용을 가리킵니다.

## 주요 학습 커리큘럼

### 1. Next.js App Router 학습 문서 (Phase 1)
- [Next.js 학습 문서 목차 및 흐름](./nextjs-docs/README.md)
- [전체 진행 상태 트래킹](./nextjs-docs/PROGRESS.md)
- [문서 작성 규칙](./nextjs-docs/AGENTS.md)

### 이슈·보안 신고

- [이슈 등록 안내](./.github/CONTRIBUTING.md)
- [지원 범위](./.github/SUPPORT.md)
- [보안 정책](./.github/SECURITY.md)

## 데모 사이트 (Phase 2)

학습 문서 194편을 화면에 그리고, 각 개념의 인터랙티브 데모 **241건**을 실행하는 pnpm + Turborepo 멀티 존 모노레포입니다.

- [데모 사이트 개요 및 실행 방법](./nextjs-app/README.md)
- [설계 문서 목차](./nextjs-app/docs/README.md)
- [모노레포 구성 방식 조사와 선택](./nextjs-app/docs/02-monorepo-options.md)
- [결합 구조 설계](./nextjs-app/docs/03-composition-architecture.md)
- [프로젝트 구성 방법 및 절차](./nextjs-app/docs/01-project-setup.md)

## 기준 출처

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- 학습 기준 Next.js 버전은 [`nextjs-docs/README.md`](./nextjs-docs/README.md#기준-출처)에 고정되어 있습니다.

## License

[MIT](./LICENSE)
