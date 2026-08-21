# useParams

- 공식 문서: [useParams](https://nextjs.org/docs/app/api-reference/functions/use-params)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Client Component](../../1-getting-started/server-and-client-components.md)에서 현재 URL의 [다이나믹 라우트](../3.1-file-conventions/dynamic-routes.md) 매개변수를 읽는 `useParams` 훅의 사용법을 익힌다.
- 단일 다이나믹 세그먼트, 다중 세그먼트, Catch-all 세그먼트(`[...slug]`)에 따른 반환 타입(`string` 또는 `string[]`) 차이를 이해한다.
- TypeScript 제네릭을 사용하여 `useParams` 반환값의 타입을 안전하게 지정하는 방법을 습득한다.
- `cacheComponents` 활성화 시 `generateStaticParams` 적용 여부에 따른 `Suspense` 경계 요구 조건을 설명한다.

## 핵심 개념 및 설명

`useParams`는 현재 URL에 의해 채워진 라우트의 [다이나믹 세그먼트](../3.1-file-conventions/dynamic-routes.md) 매개변수를 읽을 수 있게 해주는 **Client Component** 전용 훅이다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams<{ tag: string; item: string }>()

  // 라우트 -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return (
    <div>
      <p>태그: {params.tag}</p>
      <p>아이템: {params.item}</p>
    </div>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams()

  // 라우트 -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return (
    <div>
      <p>태그: {params.tag}</p>
      <p>아이템: {params.item}</p>
    </div>
  )
}
```

### 매개변수 (Parameters)

```tsx filename="app/example-client-component.js"
const params = useParams()
```

`useParams`는 인자를 받지 않는다. TypeScript 환경에서는 제네릭을 전달하여 반환 객체의 형태를 명시할 수 있다.

### 반환값 (Returns)

현재 활성화된 다이나믹 세그먼트 매개변수들이 담긴 객체를 반환한다.

- 객체의 각 프로퍼티는 현재 활성화된 다이나믹 세그먼트 이름이다.
- 프로퍼티 값은 해당 세그먼트에 채워진 값이며, 세그먼트 종류에 따라 `string` 또는 `string[]` 타입이 된다.
- 라우트에 다이나믹 매개변수가 없는 경우 빈 객체(`{}`)를 반환한다.
- Pages Router에서 사용될 경우 초기 렌더링 시 `null`을 반환하고, 라우터가 준비되면 위 규칙에 따라 객체로 업데이트된다.

| 라우트 정의 | 실제 URL | `useParams()` 반환값 |
|---|---|---|
| `app/shop/page.js` | `/shop` | `{}` |
| `app/shop/[slug]/page.js` | `/shop/1` | `{ slug: '1' }` |
| `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/page.js` | `/shop/1/2` | `{ slug: ['1', '2'] }` |
| `app/shop/[[...slug]]/page.js` | `/shop` | `{}` |

### 동작 방식 (Behavior)

#### Cache Components 및 `Suspense` 경계

[`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화되어 있을 때, `useParams`는 prerender 중에 params를 확정할 수 있는지 여부에 따라 [`Suspense`](https://react.dev/reference/react/Suspense) 경계를 요구할 수 있다.

- **정적 라우트 및 [`generateStaticParams`](./generate-static-params.md)가 적용된 라우트**: 빌드 시점에 모든 다이나믹 param 값이 결정되어 있으므로, `useParams`는 서버에서 즉시 확정되며 `Suspense` 경계가 필요하지 않다.
- **`generateStaticParams`에 포함되지 않은 다이나믹 라우트**: 요청 시점에만 값을 알 수 있으므로, `useParams`는 prerender 도중 suspend된다. 따라서 prerender 시 fallback UI를 제공할 수 있도록 컴포넌트를 `Suspense` 경계로 감싸야 한다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.3.0` | `useParams` 도입 |

## 예제 및 데모 설계

- `/products/[category]/[productId]` 라우트 하위 Client Component에서 `useParams`를 호출하여 현재 카테고리와 상품 ID를 화면에 렌더링하는 시나리오를 구성한다.
- Catch-all 라우트(`[...slug]`)에서 `params.slug`가 배열로 들어오는 구조를 순회 렌더링하는 데모를 설계한다.
- 다이나믹 파라미터가 없는 정적 페이지에서 `useParams()`를 호출했을 때 빈 객체(`{}`)가 반환되는지 확인한다.

## 연습 문제

1. 라우트가 `app/blog/[...slug]/page.tsx`이고 현재 브라우저 URL이 `/blog/2026/tech/nextjs`일 때 `useParams()`의 반환값은?
   - A. `{ slug: '2026/tech/nextjs' }`
   - B. `{ slug: ['2026', 'tech', 'nextjs'] }`
   - C. `['2026', 'tech', 'nextjs']`
   - D. `{ '0': '2026', '1': 'tech', '2': 'nextjs' }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Catch-all 세그먼트(`[...slug]`)의 경우 매개변수 값이 슬래시를 기준으로 나뉜 문자열 배열(`string[]`)로 반환된다.
</details>

2. 다이나믹 파라미터가 정의되지 않은 정적 라우트(`app/about/page.tsx`)에서 `useParams()`를 호출하면 반환되는 값은?
   - A. `null`
   - B. `undefined`
   - C. `{}` (빈 객체)
   - D. 에러 발생

<details><summary>정답 보기</summary>

정답: **C**  
해설: 다이나믹 파라미터가 없는 라우트에서는 빈 객체(`{}`)를 반환한다.
</details>

## 챕터 요약

- `useParams`는 Client Component에서 URL의 다이나믹 세그먼트 값을 객체 형태로 읽어오는 훅이다.
- 단일 다이나믹 세그먼트는 `string`, Catch-all 세그먼트는 `string[]` 타입의 값을 가진다.
- 다이나믹 세그먼트가 없는 라우트에서는 빈 객체(`{}`)를 반환한다.
- TypeScript 제네릭을 통해 파라미터 키와 값의 타입을 엄격하게 정의할 수 있다.
- `cacheComponents` 환경에서 빌드 시점에 결정되지 않는 fallback 파라미터를 읽을 때는 상위에 `Suspense` 경계가 필요하다.
