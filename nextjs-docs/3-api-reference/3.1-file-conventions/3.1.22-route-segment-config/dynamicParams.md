# dynamicParams

- 공식 문서: [dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `generateStaticParams`가 반환하지 않은 다이나믹 path의 동작을 결정한다.
- Cache Components에서 사용할 수 없다는 제한을 이해한다.

## 핵심 개념 및 설명

`dynamicParams` 옵션을 사용하면 [generateStaticParams](../../3.3-functions/generate-static-params.md)로 생성되지 않은 다이나믹 세그먼트를 방문할 때 발생하는 상황을 제어할 수 있다.

```tsx filename="layout.tsx | page.tsx" switcher
export const dynamicParams = true // 사실 | 거짓
```

```js filename="layout.js | page.js | route.js" switcher
export const dynamicParams = true // 사실 | 거짓
```

- **`true`**(기본값):`generateStaticParams`에 포함되지 않은 다이나믹 라우트 세그먼트는 요청 시 생성된다.
- **`false`**:`generateStaticParams`에 포함되지 않은 다이나믹 라우트 세그먼트는 404를 반환한다.

> **알아두면 좋은 점**:
>
> - 이 옵션은 `pages` 디렉터리에 있는 `getStaticPaths`의 `fallback: true | false | blocking` 옵션을 대체한다.
> - [Cache Components](../../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화된 경우에는 `dynamicParams`를 사용할 수 없다.

## 예제 및 데모 설계

- Phase 2에서 `generateStaticParams`에 없는 slug를 요청하고 true/false 결과를 비교한다.

## 연습 문제

1. `dynamicParams = false`에서 목록에 없는 slug의 결과는?
   - A. 404
   - B. 요청 시 생성
   - C. redirect

<details><summary>정답 보기</summary>

정답: A. 미리 생성하지 않은 다이나믹 path를 허용하지 않는다.
</details>

## 챕터 요약

- `dynamicParams`는 미생성 params의 처리 방식을 정한다.
- 기본값 true는 요청 시점 생성을 허용한다.
- false는 404를 반환한다.
- Cache Components에서는 지원하지 않는다.
