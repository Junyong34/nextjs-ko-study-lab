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

## 사이트에 있는 것

### 1. 공식 문서 한글 번역

[nextjs.org/docs/app](https://nextjs.org/docs/app)의 App Router 문서를 Next.js **16.3.2** 기준으로 번역했습니다. 시작하기, 가이드, API 레퍼런스, 용어집, 아키텍처 다섯 카테고리로 나뉘며 원문 순서를 그대로 따릅니다.

문서 앞의 **학습 목표**와 뒤의 **챕터 요약**으로 배울 내용과 핵심을 확인할 수 있습니다. 코드 블록에는 Shiki 하이라이팅을 적용했고, 오른쪽 목차로 원하는 내용을 찾아볼 수 있습니다.

| 카테고리 | 내용 | 바로가기 |
| :--- | :--- | :--- |
| 시작하기 | 설치, 프로젝트 구조, 레이아웃과 페이지, 라우팅, Server/Client Component, 데이터 페칭, 캐싱 | [열기](https://www.learn-nextjs-lab.space/getting-started) |
| 가이드 | 렌더링, Server Actions, `use cache`, 폼, 인증, 마이그레이션, 배포 | [열기](https://www.learn-nextjs-lab.space/guides) |
| API 레퍼런스 | 컴포넌트, 함수, 지시어, 파일 규칙, `next.config` 옵션 | [열기](https://www.learn-nextjs-lab.space/api-reference) |
| 용어집 | RSC, PPR, Hydration, Cache Tags 같은 용어 48개 | [열기](https://www.learn-nextjs-lab.space/glossary) |
| 아키텍처 | Turbopack, SWC, Fast Refresh, 브라우저 지원 | [열기](https://www.learn-nextjs-lab.space/architecture) |

각 문서 끝에는 단일 선택·복수 선택 **연습 문제**가 있습니다. 문서에서 배운 내용으로 문제를 푼 뒤 접힌 정답과 해설을 펼쳐 확인할 수 있습니다. 일부 문서에는 **학습 확인** 체크리스트도 제공합니다.

### 2. 직접 실행하고 코드를 확인하는 실습 데모

챕터별 실습 예제를 직접 클릭하며 문서에서 배운 기능의 동작을 확인할 수 있습니다. 예제의 [소스 코드](./nextjs-app/)도 오픈소스로 제공하므로 실행 결과와 구현을 함께 살펴볼 수 있습니다.

`layout.tsx`·`template.tsx`, 라우트 그룹, `<Link>`, Server Action, `use cache` 등을 실제 Next.js 앱으로 구현했습니다. 브라우저 개발자 도구에서는 RSC 페이로드와 요청도 확인할 수 있습니다.

제목, URL, 관련 문서명으로 검색하거나 카테고리로 필터링해 원하는 예제를 찾을 수 있습니다.

다만 등록된 예제 전부가 공개되어 있지는 않습니다. 아직 준비 중인 예제는 목록에 상태로 표시되며, 정확한 공개 현황과 기준은 [운영 가이드](./nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md)에서 확인할 수 있습니다.

### 3. 애니메이션 시각화

Streaming SSR, Selective Hydration, ISR, Cache Components의 동작 흐름을 캔버스 애니메이션으로 살펴볼 수 있습니다.

### 4. 학습 기록

**학습 기록** 버튼을 눌러 공부한 문서와 예제를 완료로 체크할 수 있습니다. 기록은 로그인 없이 브라우저의 로컬 저장소에 보관되며, 같은 브라우저로 다시 방문하면 완료한 항목을 확인하며 학습을 이어갈 수 있습니다.

## 실습 예제 구성

pnpm workspace로 문서, 사이트, 실습 앱을 한 저장소에서 관리합니다. 일반 예제와 Cache Components 예제가 각각의 설정으로 실행되도록 문서 사이트와 두 실습 앱을 분리했습니다.

```text
nextjs-docs/                     # 한글 학습 문서
nextjs-app/
├── apps/
│   ├── shell/                   # 문서 사이트와 예제 뷰어
│   ├── demo-baseline/           # 라우팅, 폼, Server Action 등 일반 예제
│   └── demo-cache-components/   # Cache Components를 사용하는 예제
└── packages/
    ├── demos/                  # 예제 등록 정보와 관련 문서 연결
    ├── demo-kit/               # 실습 앱의 공통 가이드와 검증 UI
    └── ...
```

일반 예제는 `demo-baseline`, `cacheComponents: true` 설정이 필요한 캐싱 예제는 `demo-cache-components`에서 실행합니다. 각 예제는 해당 앱의 `src/app/zone/baseline/` 또는 `src/app/zone/cache/` 아래에 주제별 App Router 경로로 구성되어 있습니다.

예를 들어 Server Action 기본 예제는 [server-actions/basic](./nextjs-app/apps/demo-baseline/src/app/zone/baseline/server-actions/basic/), `use cache` 기본 예제는 [caching/basic](./nextjs-app/apps/demo-cache-components/src/app/zone/cache/caching/basic/)에서 확인할 수 있습니다. `page.tsx`를 시작으로 필요한 컴포넌트와 서버 로직을 함께 살펴볼 수 있습니다.

[demos.yaml](./nextjs-app/packages/demos/demos.yaml)에서 예제의 URL, 관련 문서, 실행 앱과 공개 상태를 관리합니다. 사이트의 예제 뷰어는 실습 앱을 iframe으로 보여주며, 요청은 문서 사이트를 거쳐 실습 앱으로 연결됩니다. 자세한 구조는 [아키텍처 문서](./nextjs-app/ARCHITECTURE.md)를 참고해 주세요.

## 기타

- 기준 버전: Next.js 16.3.2, React 19.2.8
- 원문: [Next.js App Router Documentation](https://nextjs.org/docs/app)
- 오타나 잘못된 설명을 발견하면 사이트 하단의 **피드백 보내기** 버튼이나 [GitHub 이슈](https://github.com/Junyong34/nextjs-ko-study-lab/issues)로 알려 주세요.
- 콘텐츠와 코드 모두 [MIT 라이선스](./LICENSE)입니다.

<sub>번역 오류를 고치거나 새 예제를 추가하고 싶다면 PR로 보내 주세요. 문서는 <code>nextjs-docs/</code>, 사이트 코드는 <code>nextjs-app/</code>에 있고, 예제를 추가할 때는 <a href="./nextjs-app/docs/05-zone-onboarding-checklist.md">체크리스트</a>를 먼저 확인해 주세요.</sub>
