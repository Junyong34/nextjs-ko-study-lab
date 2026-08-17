# Accessibility

- 공식 문서: [Accessibility](https://nextjs.org/docs/architecture/accessibility)
- 상위 메뉴: [Architecture](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js가 기본적으로 제공하는 접근성(accessibility) 기능이 무엇인지 이해한다.
- 서버 렌더링 내비게이션과 클라이언트 사이드 전환(client-side transition) 각각에서 라우트 전환이 스크린 리더에 어떻게 전달되는지 설명한다.
- Next.js route announcer가 어떤 순서로 페이지 이름을 판단하는지 파악하고, 이를 기준으로 페이지 제목을 설계할 수 있다.
- `eslint-plugin-jsx-a11y`가 기본 ESLint 설정에 포함되어 어떤 문제를 잡아내는지 안다.
- 실무에서 참고할 접근성 체크리스트·가이드라인 자료를 확인한다.

## 핵심 개념 및 설명

### Next.js와 접근성

Next.js 팀은 Next.js를 모든 개발자(그리고 그 최종 사용자)에게 접근 가능하게 만드는 것을 목표로 한다. 접근성 기능을 기본값으로 추가함으로써 웹을 모두에게 더 포용적으로 만들고자 한다.

### 라우트 전환 알림(Route Announcements)

`<a href>` 태그를 사용하는 것처럼 서버에서 렌더링된 페이지 사이를 전환할 때는, 페이지가 로드되는 시점에 스크린 리더 등 보조 기술(assistive technology)이 페이지 제목을 읽어준다. 이 덕분에 사용자는 페이지가 바뀌었다는 사실을 인지할 수 있다.

Next.js는 이런 전통적인 페이지 내비게이션 외에도 성능 향상을 위해 `next/link`를 사용하는 클라이언트 사이드 전환을 지원한다. 문제는 클라이언트 사이드 전환은 브라우저의 전체 페이지 로드를 거치지 않기 때문에, 보조 기술이 이 전환을 자동으로 인지하지 못한다는 점이다. Next.js는 이 간극을 메우기 위해 기본적으로 route announcer를 포함한다.

route announcer는 알려줄 페이지 이름을 다음 순서로 찾는다.

1. `document.title`
2. `<h1>` 엘리먼트
3. URL pathname

즉 `document.title`이 설정돼 있으면 그 값을 우선 사용하고, 없으면 페이지의 `<h1>`을 찾고, 그마저 없으면 URL 경로를 그대로 읽어준다. 가장 접근성 높은 사용자 경험을 위해서는 애플리케이션의 각 페이지가 고유하고 설명적인(descriptive) 제목을 갖도록 해야 한다.

### 린팅(Linting)

Next.js는 별도 설정 없이 [통합된 ESLint 환경](../3-api-reference/3.5-config/eslint.md)을 제공하며, 여기에는 Next.js 전용 커스텀 규칙도 포함된다. 기본적으로 Next.js는 `eslint-plugin-jsx-a11y`를 포함해 접근성 문제를 조기에 잡아낸다. 이 플러그인이 경고하는 대표적인 규칙은 다음과 같다.

- `aria-props`
- `aria-proptypes`
- `aria-unsupported-elements`
- `role-has-required-aria-props`
- `role-supports-aria-props`

예를 들어 이 플러그인은 `img` 태그에 alt 텍스트를 추가했는지, `aria-*` 속성을 올바르게 사용했는지, `role` 속성을 올바르게 사용했는지 등을 확인하는 데 도움을 준다.

### 접근성 자료(Accessibility Resources)

원문은 다음 참고 자료를 제시한다.

- [WebAIM WCAG checklist](https://webaim.org/standards/wcag/checklist)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [The A11y Project](https://www.a11yproject.com/)
- 전경(foreground)과 배경(background) 엘리먼트 사이의 [색상 대비 비율(color contrast ratios)](https://developer.mozilla.org/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast)을 확인한다.
- 애니메이션 작업 시 [`prefers-reduced-motion`](https://web.dev/prefers-reduced-motion/)을 사용한다.

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서는 `next/link`로 클라이언트 사이드 전환을 하는 페이지와 `<a href>`로 서버 내비게이션을 하는 페이지를 나란히 만들어, 스크린 리더(또는 브라우저 접근성 트리)에서 route announcer가 실제로 페이지 제목을 읽어주는지 비교하는 데모를 설계한다.
- `document.title`만 있는 경우, `<h1>`만 있는 경우, 둘 다 없는 경우(URL pathname으로 폴백) 세 가지 시나리오를 구성해 route announcer의 우선순위 판단 로직을 시각적으로 확인하는 데모를 포함한다.
- `eslint-plugin-jsx-a11y`가 활성화된 상태에서 alt 텍스트 누락, 잘못된 `aria-*` 속성 같은 위반 코드를 작성했을 때 ESLint가 어떤 경고를 띄우는지 보여주는 데모를 포함한다.

## 연습 문제

1. Next.js의 route announcer가 알림에 사용할 페이지 이름을 찾는 순서로 옳은 것은?
   - A. URL pathname → `<h1>` 엘리먼트 → `document.title`
   - B. `document.title` → `<h1>` 엘리먼트 → URL pathname
   - C. `<h1>` 엘리먼트 → `document.title` → URL pathname

<details><summary>정답 보기</summary>

정답: B. route announcer는 먼저 `document.title`을 확인하고, 없으면 `<h1>` 엘리먼트를, 그마저 없으면 URL pathname을 사용한다.
</details>

2. 다음 중 Next.js가 접근성을 위해 기본으로 제공하는 것을 모두 고르면? (복수 선택)
   - A. 클라이언트 사이드 전환을 보조 기술에 알려주는 route announcer
   - B. `eslint-plugin-jsx-a11y`가 포함된 통합 ESLint 설정
   - C. 색상 대비 비율을 자동으로 검사해 빌드를 실패시키는 기능

<details><summary>정답 보기</summary>

정답: A, B. Next.js는 route announcer와 `eslint-plugin-jsx-a11y`가 포함된 ESLint 설정을 기본 제공한다. 색상 대비 검사는 원문에서 "확인해야 할 참고 자료"로만 안내될 뿐, Next.js가 빌드 과정에서 자동으로 수행하는 기능이 아니다.
</details>

3. `eslint-plugin-jsx-a11y`가 잡아내는 문제로 원문에 예시로 언급된 것은?
   - A. `img` 태그의 alt 텍스트 누락
   - B. 사용하지 않는 CSS 클래스
   - C. `role` 속성의 잘못된 사용

<details><summary>정답 보기</summary>

정답: A, C. 원문은 이 플러그인이 `img` 태그의 alt 텍스트, 올바른 `aria-*` 속성, 올바른 `role` 속성 사용을 돕는다고 설명한다. 사용하지 않는 CSS 클래스는 접근성 린팅과 관련이 없다.
</details>

## 챕터 요약

- Next.js는 접근성을 기본값으로 제공하는 것을 목표로 하며, 대표적으로 route announcer와 통합 ESLint 접근성 규칙을 포함한다.
- 서버 렌더링 내비게이션은 브라우저가 자동으로 페이지 제목을 읽어주지만, `next/link`를 사용하는 클라이언트 사이드 전환은 이를 보완하기 위해 Next.js가 자체 route announcer를 제공한다.
- route announcer는 `document.title` → `<h1>` → URL pathname 순서로 페이지 이름을 판단하므로, 각 페이지에 고유하고 설명적인 제목을 붙이는 것이 중요하다.
- 기본 ESLint 설정에 포함된 `eslint-plugin-jsx-a11y`는 `aria-props`, `role-has-required-aria-props` 등의 규칙으로 접근성 문제를 조기에 잡아낸다.
- WCAG 체크리스트, 색상 대비 비율, `prefers-reduced-motion` 같은 자료와 API를 참고해 접근성을 추가로 보강할 수 있다.
