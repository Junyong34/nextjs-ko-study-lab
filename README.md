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

공식 문서는 잘 쓰여 있지만 영어로 읽다 보면 한 번 읽고 넘어가게 되고, 읽은 내용이 실제로 브라우저에서 어떻게 동작하는지는 따로 프로젝트를 만들어 봐야 알 수 있습니다. 그 과정을 한 곳에서 끝내고 싶어서 만들었습니다. 문서를 읽고, 문제를 풀어 보고, 바로 옆의 예제에서 실제 동작을 눈으로 확인하는 순서로 학습하도록 구성했습니다.

## 사이트에 있는 것

### 1. 공식 문서 한글 번역 (284편)

[nextjs.org/docs/app](https://nextjs.org/docs/app)의 App Router 문서를 Next.js **16.3.2** 기준으로 번역했습니다. 시작하기, 가이드, API 레퍼런스, 용어집, 아키텍처의 다섯 카테고리로 나뉘어 있고 원문의 순서를 그대로 따릅니다.

단순 직역이 아니라 학습용으로 손을 봤습니다. 각 문서 앞에는 이 문서에서 무엇을 알게 되는지 적은 **학습 목표**를, 뒤에는 **챕터 요약**을 두었습니다. 코드 블록은 Shiki로 하이라이팅하고, 우측에 페이지 목차를 붙였습니다.

| 카테고리 | 내용 | 바로가기 |
| :--- | :--- | :--- |
| 시작하기 | 설치, 프로젝트 구조, 레이아웃과 페이지, 라우팅, Server/Client Component, 데이터 페칭, 캐싱 | [열기](https://www.learn-nextjs-lab.space/getting-started) |
| 가이드 | 렌더링, Server Actions, `use cache`, 폼, 인증, 마이그레이션, 배포 | [열기](https://www.learn-nextjs-lab.space/guides) |
| API 레퍼런스 | 컴포넌트, 함수, 지시어, 파일 규칙, `next.config` 옵션 | [열기](https://www.learn-nextjs-lab.space/api-reference) |
| 용어집 | RSC, PPR, Hydration, Cache Tags 같은 용어 48개 | [열기](https://www.learn-nextjs-lab.space/glossary) |
| 아키텍처 | Turbopack, SWC, Fast Refresh, 브라우저 지원 | [열기](https://www.learn-nextjs-lab.space/architecture) |

### 2. 문서마다 붙어 있는 연습 문제

문서를 읽기만 하면 이해했다고 착각하기 쉽습니다. 그래서 각 문서 끝에 그 문서 내용으로만 풀 수 있는 **연습 문제**를 넣었습니다. 단일 선택과 복수 선택 문제가 섞여 있고, 정답과 해설은 접혀 있어서 먼저 풀어 본 뒤 펼쳐 확인하면 됩니다. 문서에 따라 이해했는지 스스로 점검하는 **학습 확인** 체크리스트도 있습니다.

### 3. 단계적으로 공개하는 실습 데모

등록 수와 실행 가능한 공개 예제 수는 다릅니다. 준비 중 항목은 목록에서 상태를 확인할 수 있습니다. 현재 집계와 공개 기준은 [운영 가이드](./nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md)를 참조하세요.

- No-Simulation 원칙에 따라 화면 상태만 흉내 내지 않고 실제 파일 규칙(`layout.tsx`, `template.tsx`, `(group)`)과 브라우저 라우터(`<Link>`, `useRouter`)를 사용합니다.
- Server Actions 데모는 실제 `'use server'` 함수를 호출합니다. 개발자 도구의 Network 탭에서 `POST` 요청과 페이로드를 확인할 수 있습니다.
- `use cache`, `cacheLife`, `revalidateTag` 같은 Next.js 16 기능은 별도의 Cache Zone에서 실행합니다.

문서에 나온 동작을 실제 Next.js 앱에서 그대로 재현한 예제입니다. 화면만 그럴듯하게 흉내 내지 않고 진짜 `layout.tsx`, `template.tsx`, 라우트 그룹, `<Link>`, Server Action을 사용합니다. 그래서 개발자 도구를 열면 RSC Payload와 `POST` 요청 본문을 그대로 볼 수 있습니다.

### 4. 데모 검색과 필터링 (`/demo`)
- 등록된 데모를 한곳에서 살펴볼 수 있는 색인 페이지입니다.
- 제목·URL·관련 문서명 검색과 카테고리 필터로 데모를 찾을 수 있습니다.

### 5. 학습 진도 기록
- 로그인 없이 브라우저의 로컬 저장소에 읽은 문서와 완료한 데모를 기록합니다.
- 같은 브라우저에서 직접 표시한 완료 기록을 다시 확인할 수 있습니다.

## 저장소 구성

| 디렉토리 | 내용 |
| :--- | :--- |
| [`nextjs-docs/`](./nextjs-docs/) | 번역 문서 원본 (Markdown) |
| [`nextjs-app/`](./nextjs-app/) | 사이트 코드. 문서를 보여주는 셸과 예제 앱들의 pnpm 모노레포 |

## 기타

- 기준 버전: Next.js 16.3.2, React 19.2.8
- 원문: [Next.js App Router Documentation](https://nextjs.org/docs/app)
- 오타나 잘못된 설명을 발견하면 사이트 하단의 **피드백 보내기** 버튼이나 [GitHub 이슈](https://github.com/Junyong34/nextjs-ko-study-lab/issues)로 알려 주세요.
- 문서와 코드 모두 [MIT 라이선스](./LICENSE)입니다.

<sub>번역 오류 수정이나 새 실습 예제 추가는 PR로도 받고 있습니다. 문서는 <code>nextjs-docs/</code>, 예제는 <code>nextjs-app/</code>에 있고, 예제를 추가할 때는 <a href="./nextjs-app/docs/05-zone-onboarding-checklist.md">체크리스트</a>를 한 번 훑어봐 주세요.</sub>
