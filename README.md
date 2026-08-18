# nextjs-ko-study-lab

Next.js App Router 공식 문서(nextjs.org/docs/app)를 한국어 학습 커리큘럼으로 재구성하는 저장소입니다. 문서 설계가 먼저이고, 실행 가능한 데모 앱은 그 다음입니다.

## 저장소 구조

```
nextjs-ko-study-lab/
├─ nextjs-docs/   # Next.js App Router 학습 문서 (Phase 1, 진행 중)
├─ nextjs-app/    # Next.js 데모 사이트 (Phase 2, 설계 완료·착수 전)
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
