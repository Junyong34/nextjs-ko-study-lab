# Next.js 한국어 학습 랩

<p align="center">
  <a href="https://nextjs.org/docs/app"><img src="https://img.shields.io/badge/Next.js-16.3.2-black?style=flat-square&logo=next.js" alt="Next.js 16.3.2" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19.2.8" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong>"읽고, 눌러보고, 확인한다"</strong><br />
  Next.js App Router 공식 문서의 한글 번역과<br />
  실습 예제, 애니메이션 시각화로 배우는 학습 사이트
</p>

<p align="center">
  <a href="https://www.learn-nextjs-lab.space/"><strong>웹사이트 바로가기</strong></a> |
  <a href="https://www.learn-nextjs-lab.space/getting-started"><strong>1장부터 학습 시작</strong></a> |
  <a href="https://www.learn-nextjs-lab.space/demo"><strong>데모 둘러보기</strong></a> |
  <a href="https://www.learn-nextjs-lab.space/visualize"><strong>시각화 갤러리</strong></a>
</p>

Next.js App Router 공식 문서를 한국어로 읽고, 챕터별 실습 예제를 직접 눌러 보며 기능이 어떻게 동작하는지 확인할 수 있습니다. 예제의 실제 코드도 오픈소스로 공개해 구현을 함께 살펴볼 수 있습니다.

시각화 메뉴에서는 애니메이션으로 동작 흐름을 살펴보고, 학습 기록 버튼으로 공부한 문서와 예제를 체크하며 학습을 이어갈 수 있습니다.

## 사이트에 있는 것

### 1. 공식 문서 한글 번역 (284편)

[nextjs.org/docs/app](https://nextjs.org/docs/app)의 App Router 문서를 Next.js **16.3.2** 기준으로 번역했습니다. 시작하기, 가이드, API 레퍼런스, 용어집, 아키텍처 다섯 카테고리로 나뉘며 원문 순서를 그대로 따릅니다.

문서 앞의 **학습 목표**와 뒤의 **챕터 요약**으로 배울 내용과 핵심을 확인할 수 있습니다. 코드 블록에는 Shiki 하이라이팅을 적용했고, 오른쪽 목차로 원하는 내용을 찾아볼 수 있습니다.

| 카테고리 | 내용 | 바로가기 |
| :--- | :--- | :--- |
| 시작하기 | 설치, 프로젝트 구조, 레이아웃과 페이지, 라우팅, Server/Client Component, 데이터 페칭, 캐싱 | [열기](https://www.learn-nextjs-lab.space/getting-started) |
| 가이드 | 렌더링, Server Actions, `use cache`, 폼, 인증, 마이그레이션, 배포 | [열기](https://www.learn-nextjs-lab.space/guides) |
| API 레퍼런스 | 컴포넌트, 함수, 지시어, 파일 규칙, `next.config` 옵션 | [열기](https://www.learn-nextjs-lab.space/api-reference) |
| 용어집 | RSC, PPR, Hydration, Cache Tags 같은 용어 48개 | [열기](https://www.learn-nextjs-lab.space/glossary) |
| 아키텍처 | Turbopack, SWC, Fast Refresh, 브라우저 지원 | [열기](https://www.learn-nextjs-lab.space/architecture) |

### 2. 문서별 연습 문제

각 문서 끝에는 단일 선택·복수 선택 **연습 문제**가 있습니다. 문서에서 배운 내용으로 문제를 푼 뒤 접힌 정답과 해설을 펼쳐 확인할 수 있습니다. 일부 문서에는 **학습 확인** 체크리스트도 제공합니다.

### 3. 직접 실행하고 코드를 확인하는 실습 데모

챕터별 실습 예제를 직접 클릭하며 문서에서 배운 기능의 동작을 확인할 수 있습니다. 예제의 [소스 코드](./nextjs-app/)도 오픈소스로 제공하므로 실행 결과와 구현을 함께 살펴볼 수 있습니다.

`layout.tsx`·`template.tsx`, 라우트 그룹, `<Link>`, Server Action, `use cache` 등을 실제 Next.js 앱으로 구현했습니다. 브라우저 개발자 도구에서는 RSC 페이로드와 요청도 확인할 수 있습니다.

다만 등록된 예제 전부가 공개되어 있지는 않습니다. 아직 준비 중인 예제는 목록에 상태로 표시되며, 정확한 공개 현황과 기준은 [운영 가이드](./nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md)에서 확인할 수 있습니다.

### 4. 데모 검색과 필터링 (`/demo`)

등록된 예제를 한곳에서 살펴볼 수 있는 색인 페이지입니다. 제목, URL, 관련 문서명으로 검색하거나 카테고리로 필터링해서 원하는 예제를 찾을 수 있습니다.

### 5. 학습 기록

**학습 기록** 버튼을 눌러 공부한 문서와 예제를 완료로 체크할 수 있습니다. 기록은 로그인 없이 브라우저의 로컬 저장소에 보관되며, 같은 브라우저로 다시 방문하면 완료한 항목을 확인하며 학습을 이어갈 수 있습니다.

### 6. 인터랙티브 아키텍처 시각화 (`/visualize`)

시각화 메뉴에서는 Streaming SSR, Selective Hydration, ISR, Cache Components의 동작 흐름을 캔버스 애니메이션으로 살펴볼 수 있습니다. 문서에서 배운 개념을 움직이는 화면으로 확인할 수 있습니다.

## 기타

- 기준 버전: Next.js 16.3.2, React 19.2.8
- 원문: [Next.js App Router Documentation](https://nextjs.org/docs/app)
- 오타나 잘못된 설명을 발견하면 사이트 하단의 **피드백 보내기** 버튼이나 [GitHub 이슈](https://github.com/Junyong34/nextjs-ko-study-lab/issues)로 알려 주세요.
- 콘텐츠와 코드 모두 [MIT 라이선스](./LICENSE)입니다.

<sub>번역 오류를 고치거나 새 예제를 추가하고 싶다면 PR로 보내 주세요. 문서는 <code>nextjs-docs/</code>, 사이트 코드는 <code>nextjs-app/</code>에 있고, 예제를 추가할 때는 <a href="./nextjs-app/docs/05-zone-onboarding-checklist.md">체크리스트</a>를 먼저 확인해 주세요.</sub>
