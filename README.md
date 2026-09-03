# Next.js App Router 한국어 학습 프로젝트

> Next.js App Router 공식 문서를 바탕으로 구성한 한국어 학습 가이드와, 각 개념의 실제 동작을 확인할 수 있는 데모 프로젝트입니다.

[학습 문서 둘러보기](https://www.learn-nextjs-lab.space/) · [데모 사이트 알아보기](https://www.learn-nextjs-lab.space/demo) · [프로젝트 구조 살펴보기](https://www.learn-nextjs-lab.space/getting-started/project-structure)

## 어떤 프로젝트인가요?

`nextjs-ko-study-lab`은 Next.js App Router를 한국어로 차근차근 학습하고, 문서에서 다룬 기능을 실제 데모로 확인할 수 있도록 만든 오픈소스 학습 프로젝트입니다.

공식 문서의 목차를 그대로 옮기는 데 그치지 않고 학습 순서에 맞게 내용을 재구성했습니다. 라우팅, Server Component, 데이터 페칭과 캐싱 같은 기본 개념부터 Next.js 16의 Cache Components까지 문서와 실행 예제를 함께 살펴볼 수 있습니다.

## 무엇을 제공하나요?

- **284편의 한국어 학습 문서**: 시작하기, 핵심 가이드, API 레퍼런스, 용어집, 아키텍처 순서로 구성했습니다.
- **241개의 인터랙티브 데모**: 설명만 읽는 대신 브라우저에서 직접 조작하며 기대 결과와 실제 동작을 비교할 수 있습니다.
- **Next.js 16 실습 환경**: 일반 App Router 기능과 `cacheComponents`가 필요한 기능을 독립된 Zone으로 나누어 실제 Next.js 런타임에서 실행합니다.
- **학습 탐색 도구**: 문서 탐색, 데모 검색과 필터링, 학습 진도 기록 기능을 제공합니다.

## 이런 분에게 적합합니다

- Next.js App Router를 처음부터 체계적으로 공부하려는 분
- Server Component, Server Action, 캐싱과 렌더링 동작을 직접 확인하고 싶은 분
- Next.js 16의 `use cache`, `cacheLife`, `revalidateTag`를 예제로 익히고 싶은 분
- 공식 문서를 읽으면서 함께 참고할 한국어 학습 자료가 필요한 분

## 저장소 구성

| 경로 | 역할 |
|---|---|
| [`nextjs-docs/`](./nextjs-docs/README.md) | Next.js App Router 공식 문서를 바탕으로 구성한 한국어 학습 콘텐츠 |
| [`nextjs-app/`](./nextjs-app/README.md) | 학습 문서와 인터랙티브 데모를 제공하는 Next.js 웹 애플리케이션 |
| [`CONTEXT-MAP.md`](./CONTEXT-MAP.md) | 학습 문서와 데모 사이트 사이의 책임 및 데이터 계약 |
| [`DESIGN.md`](./DESIGN.md) | 웹사이트의 UI·UX 원칙과 디자인 토큰 |

상세한 Multi-zones 구성과 데이터 흐름은 [아키텍처 명세서](./nextjs-app/ARCHITECTURE.md)에서 확인할 수 있습니다.

## 기술 스택

- Next.js App Router 16.3.2
- React 19.2.8
- TypeScript, Tailwind CSS v4
- pnpm workspaces, Turborepo
- Vitest, Playwright

## 기여하기

오류 제보와 개선 제안은 환영합니다. 자세한 내용은 [기여 안내](./.github/CONTRIBUTING.md)를 참고해 주세요.

## 공식 여부 및 라이선스

이 프로젝트는 Vercel 또는 Next.js 팀이 운영하는 공식 번역 프로젝트가 아닙니다. 학습 내용의 기준이 되는 원문은 [Next.js App Router 공식 문서](https://nextjs.org/docs/app)에서 확인할 수 있습니다.

소스 코드와 문서는 [MIT 라이선스](./LICENSE)를 따릅니다.
