---
status: accepted
date: 2026-08-19
---

# UI 기반은 shadcn/ui로 하고, 문서 프레임워크는 쓰지 않는다

셸은 264편의 학습 문서와 예제 색인·독립 열람을 그려야 한다 ([06. 화면 구성과 UI 설계](../06-ui-and-screen-design.md)). 이런 사이트를 만드는 가장 빠른 길은 문서 프레임워크(Nextra 등)를 얹는 것이지만, **이 저장소는 이미 문서 파이프라인의 모든 축을 스스로 정해뒀다** — 순수 md 단일 원본, 번호 접두사를 뗀 URL 규칙, 카테고리 `README.md`가 소유하는 학습 순서, `/demo`·`/zone`·`/demo-static` 예약 세그먼트. 프레임워크를 얹는 것은 그 축들을 프레임워크의 축으로 교체하는 일이다.

그래서 **라우팅·콘텐츠·레이아웃은 직접 소유하고, UI 컴포넌트만 shadcn/ui에서 가져온다.**

shadcn/ui는 의존성이 아니라 **소스를 저장소로 복사**하는 레지스트리다. 이것이 [01. 3-4](../01-project-setup.md)에서 이미 택한 **Internal Package 패턴**(별도 번들링 없이 TS 소스를 그대로 export)과 정확히 같은 모델이고, shadcn의 공식 monorepo 가이드가 규정하는 `@workspace/ui` 패키지 + `imports`/`exports` 맵 + `components.json` alias 구조가 `@study/ui`에 1:1로 대응한다. Tailwind v4(`@import "tailwindcss"`, `@theme inline`, oklch 토큰)도 [ADR 0002](./0002-pnpm-turborepo-catalog-pinning.md)로 고정한 스택 그대로다.

## Considered Options

- **Nextra (기각)**: Nextra 4는 App Router 전용이고 완성도가 높지만 네 지점에서 이 저장소의 확정 사항과 정면으로 부딪힌다.

  | Nextra의 요구 | 부딪히는 결정 |
  |---|---|
  | `content/` 디렉토리 + **MDX** | `nextjs-docs/`는 순수 md이고 **단일 원본, 사본 금지**([`AGENTS.md`](../../AGENTS.md)). 복사나 심볼릭 링크가 필요해진다 |
  | `_meta.js`로 순서·제목 관리 | 순서의 원본은 카테고리 `README.md`의 `## 학습 순서`([03. 4-5](../03-composition-architecture.md)) → 원본이 둘이 된다 |
  | `[[...mdxPath]]`가 라우팅 소유 | 번호 접두사 제거 규칙과 예약 세그먼트([03. 3-1](../03-composition-architecture.md)). 폴더명 `1-getting-started`가 그대로 URL이 된다 |
  | `nextra-theme-docs`의 `<Layout>`이 root layout 소유 | 화면 골격 5종 — 랜딩 풀폭, 예제 색인, 독립 열람 chrome |
  | `withNextra()`가 `next.config` 래핑 | 셸이 `rewrites`와 `outputFileTracingRoot`를 직접 소유해야 한다([03. 3-3](../03-composition-architecture.md)) |

  얻는 것(문서 UI 완성품)보다 잃는 것(문서 파이프라인의 소유권)이 크다. 다만 `nextra-docs-template`은 **디자인 참고**로 유효하다.

- **21st.dev (기본 채택 안 함)**: 라이브러리가 아니라 **여러 저자의 커뮤니티 카탈로그**다. 버전도 업그레이드 개념도 없고("there is no version of us to upgrade" — 공식 FAQ), 무료 이용에 일일 복사 제한이 있다. 무엇보다 가져온 코드는 이 저장소의 코드가 되는데, **Next.js를 가르치는 저장소에서 출처가 불분명한 컴포넌트는 설명할 수 없다.** 랜딩 같은 마케팅 블록의 시각적 아이디어를 볼 때만 참고하고 코드는 직접 쓴다.

- **Radix UI만 직접 사용 (기각)**: shadcn이 감싸고 있는 것이 결국 Radix이므로 한 겹을 걷어낼 수 있다. 하지만 그 한 겹이 Tailwind 토큰 매핑·variant 규약·접근성 조립이고, 그걸 264편짜리 문서 사이트 하나 만들자고 처음부터 다시 쓰는 것은 비용이 크다. shadcn을 쓰면 그 코드가 저장소에 들어오므로 **필요하면 언제든 그 한 겹만 걷어낼 수 있다** — 되돌리기 비용이 낮은 쪽을 택한다.

- **MUI / Chakra / Mantine 등 패키지형 라이브러리 (기각)**: 설치가 가장 간단하지만 **peer dependency로 React·Next 버전에 묶인다.** 이 저장소의 핵심 활동은 기준 버전 추종이고([`nextjs-docs/AGENTS.md`](../../../nextjs-docs/AGENTS.md)의 버전 절), Next가 올라갈 때 UI 라이브러리가 못 따라오면 저장소 전체가 막힌다. 소스를 복사해두면 그 위험이 0이다.

## Consequences

- **`@study/ui`는 셸 전용이 된다.** shadcn 컴포넌트, 헤더, 좌측 트리, 우측 목차, 카드가 여기 모인다. 데모 앱이 이걸 의존하면 `transpilePackages`를 통해 헤더·검색 팔레트까지 데모 앱 빌드에 끌려 들어오므로, 데모 공통 UI는 **`@study/demo-kit`**으로 분리한다 ([05. A-2](../05-open-questions.md) 해결, [06. 7-4](../06-ui-and-screen-design.md)).
- **데모 앱에는 shadcn을 넣지 않는다.** 데모 코드는 학습자가 읽을 코드라 군더더기가 없어야 한다.
- **Tailwind `@source` 함정의 파급이 커진다.** [01. 3-4](../01-project-setup.md)가 경고한 상대 경로가 어긋나면 빌드는 성공하고 화면도 뜨는데 클래스만 조용히 누락되는데, 이제 UI 전부가 거기 있으므로 헤더·트리·카드가 통째로 스타일 없이 그려진다.
- **shadcn 컴포넌트는 업스트림 업데이트를 자동으로 받지 못한다.** 복사한 시점의 코드가 그대로 남는다. 접근성 버그 수정 같은 것을 놓칠 수 있으므로, 기준 버전을 올릴 때 `done` 데모와 함께 재검토 대상에 넣는다.
- **디자인 토큰 이름을 새로 만들지 않는다.** shadcn의 Tailwind v4 규약(`@theme inline` + oklch)을 그대로 쓴다. 이름을 바꾸면 컴포넌트를 추가할 때마다 매핑을 손봐야 한다.
- 코드 하이라이팅(`shiki`), md 변환(`remark`/`rehype`), 테마(`next-themes`)는 shadcn 밖이므로 따로 고른다 ([06. 7-3](../06-ui-and-screen-design.md)).
