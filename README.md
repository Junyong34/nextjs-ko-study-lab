# Next.js 한국어 학습 랩

<p align="center">
  <a href="https://nextjs.org/docs/app"><img src="https://img.shields.io/badge/Next.js-16.3.2-black?style=flat-square&logo=next.js" alt="Next.js 16.3.2" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19.2.8" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong>"읽고, 눌러보고, 확인한다"</strong><br />
  Next.js App Router 공식 문서를 한국어로 체계화하고,<br />
  등록된 실습 예제를 단계적으로 공개하는 온라인 학습 플랫폼
</p>

<p align="center">
  <a href="https://www.learn-nextjs-lab.space/"><strong>웹사이트 바로가기</strong></a> |
  <a href="https://www.learn-nextjs-lab.space/getting-started"><strong>1장부터 학습 시작</strong></a> |
  <a href="https://www.learn-nextjs-lab.space/demo"><strong>데모 둘러보기</strong></a>
</p>

공식 문서는 잘 정리되어 있지만, 영어로 읽다 보면 한 번 훑고 넘어가기 쉽고, 읽은 내용이 브라우저에서 실제로 어떻게 동작하는지 확인하려면 따로 프로젝트를 만들어야 합니다. 이 두 과정을 한 곳에서 해결할 수 있도록 만들었습니다. 문서를 읽고, 문제를 풀고, 바로 옆의 예제에서 실제 동작까지 눈으로 확인하는 순서로 학습할 수 있습니다.

## 사이트에 있는 것

### 1. 공식 문서 한글 번역 (284편)

[nextjs.org/docs/app](https://nextjs.org/docs/app)의 App Router 문서를 Next.js **16.3.2** 기준으로 번역했습니다. 시작하기, 가이드, API 레퍼런스, 용어집, 아키텍처 다섯 카테고리로 나뉘며 원문 순서를 그대로 따릅니다.

단순히 옮기기만 한 것이 아니라 학습하기 좋은 형태로 다듬었습니다. 문서 앞에는 이 글에서 무엇을 배우는지 정리한 **학습 목표**를, 뒤에는 **챕터 요약**을 붙였습니다. 코드 블록은 Shiki로 하이라이팅했고, 오른쪽에는 페이지 목차를 두었습니다.

| 카테고리 | 내용 | 바로가기 |
| :--- | :--- | :--- |
| 시작하기 | 설치, 프로젝트 구조, 레이아웃과 페이지, 라우팅, Server/Client Component, 데이터 페칭, 캐싱 | [열기](https://www.learn-nextjs-lab.space/getting-started) |
| 가이드 | 렌더링, Server Actions, `use cache`, 폼, 인증, 마이그레이션, 배포 | [열기](https://www.learn-nextjs-lab.space/guides) |
| API 레퍼런스 | 컴포넌트, 함수, 지시어, 파일 규칙, `next.config` 옵션 | [열기](https://www.learn-nextjs-lab.space/api-reference) |
| 용어집 | RSC, PPR, Hydration, Cache Tags 같은 용어 48개 | [열기](https://www.learn-nextjs-lab.space/glossary) |
| 아키텍처 | Turbopack, SWC, Fast Refresh, 브라우저 지원 | [열기](https://www.learn-nextjs-lab.space/architecture) |

### 2. 문서마다 딸린 연습 문제

문서를 읽기만 하면 이해했다고 착각하기 쉽습니다. 그래서 각 문서 끝에 그 내용만으로 풀 수 있는 **연습 문제**를 넣었습니다. 단일 선택과 복수 선택 문제가 섞여 있고, 정답과 해설은 접어 두었으니 먼저 풀어 본 뒤 펼쳐서 확인하면 됩니다. 문서에 따라서는 스스로 점검할 수 있는 **학습 확인** 체크리스트도 있습니다.

### 3. 화면만 흉내 내지 않는 실습 데모

문서에서 설명하는 동작을 실제 Next.js 앱으로 그대로 구현해 두었습니다. 겉모습만 비슷하게 만든 화면이 아니라 진짜 `layout.tsx`·`template.tsx`, 라우트 그룹, `<Link>` 이동, Server Action 호출로 동작하기 때문에 브라우저 개발자 도구를 열어 보면 문서에서 설명한 것과 같은 RSC 페이로드나 요청을 그대로 확인할 수 있습니다. `use cache`처럼 Next.js 16에서 새로 도입된 캐싱 기능도 직접 눌러 보며 익힐 수 있습니다.

다만 등록된 예제 전부가 공개되어 있지는 않습니다. 아직 준비 중인 예제는 목록에 상태로 표시되며, 정확한 공개 현황과 기준은 [운영 가이드](./nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md)에서 확인할 수 있습니다.

### 4. 데모 검색과 필터링 (`/demo`)

등록된 예제를 한곳에서 살펴볼 수 있는 색인 페이지입니다. 제목, URL, 관련 문서명으로 검색하거나 카테고리로 필터링해서 원하는 예제를 찾을 수 있습니다.

### 5. 학습 진도 기록

로그인 없이도 브라우저의 로컬 저장소에 읽은 문서와 완료한 예제가 기록됩니다. 같은 브라우저로 다시 들어오면 직접 표시해 둔 완료 기록을 이어서 확인할 수 있습니다.

## 기타

- 기준 버전: Next.js 16.3.2, React 19.2.8
- 원문: [Next.js App Router Documentation](https://nextjs.org/docs/app)
- 오타나 잘못된 설명을 발견하면 사이트 하단의 **피드백 보내기** 버튼이나 [GitHub 이슈](https://github.com/Junyong34/nextjs-ko-study-lab/issues)로 알려 주세요.
- 콘텐츠와 코드 모두 [MIT 라이선스](./LICENSE)입니다.

<sub>번역 오류를 고치거나 새 예제를 추가하고 싶다면 PR로 보내 주세요. 문서는 <code>nextjs-docs/</code>, 사이트 코드는 <code>nextjs-app/</code>에 있고, 예제를 추가할 때는 <a href="./nextjs-app/docs/05-zone-onboarding-checklist.md">체크리스트</a>를 먼저 확인해 주세요.</sub>
