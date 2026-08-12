# Next.js 학습 사이트 문서 설계

> Next.js 공식 문서의 App Router 사이드바를 기준으로, 설명·예제·시각적 데모를 단계적으로 설계하기 위한 문서 구조입니다.

## 문서 범위

이 디렉토리는 코드 구현 전에 학습 콘텐츠의 목차, 용어, 설명 방식, 데모 방향을 합의하기 위한 문서 공간입니다. 각 메뉴 문서는 현재 초안 상태이며, 교육 설계가 완료된 뒤 구현 단계로 넘어갑니다.

## 권장 학습 흐름

1. [Getting Started](./1-getting-started/README.md): 기본 프로젝트와 App Router의 핵심 흐름 (기존 순서 유지)
2. [Guides](./2-guides/README.md): 실제 문제를 해결하는 주제별 학습 (학습 의존성 기준 재배열, ADR 0002)
3. [API Reference](./3-api-reference/README.md): 기능별 세부 동작과 사용법 (하위 그룹 순서 재배열, ADR 0002)
4. [Glossary](./4-glossary/README.md): 반복해서 등장하는 용어 확인 (참고용, 하위 순번 없음)
5. [Architecture](./5-architecture/README.md): 내부 동작과 설계 원리 (기존 순서 유지)
6. [Community](./6-community/README.md): 기여와 생태계 자료 (참고용, 하위 순번 없음)

> 위 번호(1~6)는 카테고리 대분류 번호입니다. 하위 메뉴까지 포함한 전체 트리형 순번(`1.1`, `3.1.1` 등)은 각 카테고리 `README.md`와 [PROGRESS.md](./PROGRESS.md)에 동일하게 반영되어 있습니다. 카테고리·하위그룹 폴더명에도 같은 번호를 접두어로 붙여, 탐색기에서 폴더만 봐도 학습 순서가 보이도록 했습니다 (개별 md 파일명에는 붙이지 않습니다).

## 공식 메뉴 구조

- [Getting Started](./1-getting-started/README.md)
- [Guides](./2-guides/README.md)
- [API Reference](./3-api-reference/README.md)
- [Glossary](./4-glossary/README.md)
- [Architecture](./5-architecture/README.md)
- [Community](./6-community/README.md)

## 문서 작성 원칙

- 공식 문서의 메뉴 계층과 링크를 유지합니다.
- 각 항목은 개념 설명, 예제/데모 설계, 학습 확인 항목으로 확장합니다.
- 코드 구현은 문서 설계가 완료되고 학습 목표와 검증 방법이 합의된 뒤 시작합니다.
- 공식 문서 링크를 함께 남겨 원문과 학습 문서를 오갈 수 있게 합니다.

## 설계 기록

- [용어집](./CONTEXT.md)
- [공식 사이드바 계층 미러링 결정](./docs/adr/0001-mirror-official-sidebar-hierarchy.md)
- [학습 순서 재배열 결정](./docs/adr/0002-reorder-learning-sequence.md)
- [문서 작성 규칙 (CLAUDE.md)](./CLAUDE.md)
- [전체 진행 트래킹](./PROGRESS.md)

## 기준 출처

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- 확인한 공식 사이드바 메뉴 수: 286개
- **학습 기준 Next.js 버전: 16.3.0** (React 19 / Node.js >=20.9 기준, 확인일 2026-08-12, [npm](https://www.npmjs.com/package/next))
  - 버전이 올라가면 이 값을 갱신하고, 변경된 기능과 관련된 "완료" 문서를 재검토 대상으로 표시한다.
