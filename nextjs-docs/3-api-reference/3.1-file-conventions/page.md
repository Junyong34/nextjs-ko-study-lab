# page.js

- 공식 문서: [page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `page.js`가 라우트를 공개하고 고유 UI를 정의하는 규칙을 이해한다.
- Promise인 `params`와 `searchParams`의 타입과 렌더링 영향을 구분한다.
- `PageProps`와 Server/Client Component에서의 접근법을 적용한다.

## 핵심 개념 및 설명

### 페이지 규칙

`page.js|jsx|tsx`는 라우트에 고유한 UI를 default export한다. 페이지는 라우트 서브트리의 leaf이며, 세그먼트를 공개 URL로 접근 가능하게 만들려면 필요하다. 기본값은 Server Component이고 필요하면 Client Component로 만들 수 있다.

```tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>Blog Post: {slug}</h1>
}
```

### `params`와 `searchParams`

두 prop 모두 Promise이므로 Server Component에서는 `await`, Client Component 페이지에서는 React `use`로 읽는다. `params`는 루트부터 페이지까지의 다이나믹 세그먼트를 담는다. `searchParams`는 `string | string[] | undefined` 값을 가진 일반 객체이며 `URLSearchParams` 인스턴스가 아니다.

`searchParams`는 미리 알 수 없는 Request-time API다. 사용하면 페이지가 요청 시점 다이나믹 렌더링으로 전환된다. Cache Components를 사용할 때는 컴포넌트 트리에서 이 값을 읽는 위치가 prerender 가능한 static shell의 범위를 결정한다.

### Page Props Helper와 예제

`PageProps<'/shop/[slug]'>`는 route literal에서 엄격한 `params` key와 `searchParams` 타입을 생성한다. 타입은 `next dev`, `next build`, `next typegen` 이후 전역으로 제공되어 import할 필요가 없다. `params`로 콘텐츠를 선택하고 `searchParams`로 filtering·pagination·sorting을 구현할 수 있다.

> **알아두면 좋은 점**: Next.js 14 이전에는 두 prop이 동기식이었다. Next.js 15에서는 호환을 위해 동기 접근도 가능하지만 앞으로 deprecated될 예정이다.

## 예제 및 데모 설계

- Phase 2에서 `/products/[slug]?sort=asc` 페이지를 만들고 `params`와 `searchParams` 결과를 나란히 표시한다.
- `searchParams` 접근 위치를 Suspense 안팎으로 옮겨 static shell 범위를 비교한다.
- Client Component 페이지에서 `use(params)`를 사용하는 예제를 추가한다.

## 연습 문제

1. 라우트 세그먼트를 공개적으로 접근 가능하게 만드는 파일은?
   - A. `layout.js`
   - B. `page.js`
   - C. `template.js`

<details><summary>정답 보기</summary>

정답: B. 세그먼트에는 공개 UI를 위한 페이지 파일이 필요하다.
</details>

2. `searchParams`에 대한 설명으로 맞는 것은?
   - A. `URLSearchParams` 인스턴스다.
   - B. 빌드 때 항상 결정된다.
   - C. Promise로 전달되는 Request-time API다.

<details><summary>정답 보기</summary>

정답: C. 요청마다 달라질 수 있어 다이나믹 렌더링에 영향을 준다.
</details>

## 챕터 요약

- `page.js`는 라우트의 고유 UI와 공개 접근 지점을 정의한다.
- 페이지는 같은 세그먼트 컴포넌트 계층의 가장 안쪽에 있다.
- `params`와 `searchParams`는 Promise다.
- `searchParams` 사용은 요청 시점 렌더링에 영향을 준다.
- `PageProps`는 route literal에서 전역 타입을 생성한다.
