# Next.js 한국어 학습 랩

<p align="center">
  <a href="https://nextjs.org/docs/app"><img src="https://img.shields.io/badge/Next.js-16.3.2-black?style=flat-square&logo=next.js" alt="Next.js 16.3.2" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19.2.8" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

**https://www.learn-nextjs-lab.space/**

Next.js 16 App Router 공식 문서를 한국어로 옮기고, 문서마다 연습 문제를 붙이고, 직접 눌러볼 수 있는 실습 예제를 곁들인 학습 사이트입니다.

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

### 3. 눈으로 확인하는 실습 예제

문서에 나온 동작을 실제 Next.js 앱에서 그대로 재현한 예제입니다. 화면만 그럴듯하게 흉내 내지 않고 진짜 `layout.tsx`, `template.tsx`, 라우트 그룹, `<Link>`, Server Action을 사용합니다. 그래서 개발자 도구를 열면 RSC Payload와 `POST` 요청 본문을 그대로 볼 수 있습니다.

예제 페이지는 네 부분으로 되어 있습니다.

1. **가이드**: 이 예제에서 무엇을 확인하는지, 어떤 순서로 눌러 보면 되는지
2. **실습 화면**: 버튼을 누르고 폼을 제출하고 페이지를 이동하는 영역
3. **검증 패널**: 공식 문서대로라면 이렇게 되어야 한다는 기대값과 지금 브라우저에서 관찰한 실제값을 나란히 표시
4. **개념 정리**: 왜 그렇게 동작하는지 컴포넌트 트리와 함께 설명

`use cache`, `cacheLife`, `revalidateTag`처럼 `cacheComponents` 설정이 필요한 Next.js 16 기능은 별도 앱으로 분리해 두어서 설정 충돌 없이 돌아갑니다.

예제는 총 241개를 계획했고, 직접 검증을 마친 것부터 순서대로 공개하고 있습니다. 아직 공개하지 않은 예제는 사이트에서 "준비 중"으로 표시됩니다. 현재 상태는 [예제 목록](https://www.learn-nextjs-lab.space/demo)에서 볼 수 있고, 키워드와 카테고리로 찾을 수 있습니다.

### 4. 학습 진도

로그인 없이 브라우저 로컬 저장소에 읽은 문서와 완료한 예제를 기록합니다. 다시 들어오면 어디까지 봤는지 바로 확인할 수 있습니다.

## 권장하는 학습 순서

1. 문서를 읽습니다.
2. 문서 끝의 연습 문제를 풀고 정답을 펼쳐 봅니다.
3. 본문에 걸려 있는 예제 카드로 이동해 직접 눌러 봅니다.
4. 검증 패널에서 기대값과 실제값이 같은지 확인합니다.
5. 더 파고들고 싶으면 개발자 도구 Network 탭에서 요청과 페이로드를 봅니다.

Next.js를 처음 본다면 [시작하기](https://www.learn-nextjs-lab.space/getting-started)부터 순서대로, 이미 써 봤다면 [가이드](https://www.learn-nextjs-lab.space/guides)나 [용어집](https://www.learn-nextjs-lab.space/glossary)에서 필요한 부분만 골라 봐도 됩니다.

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
