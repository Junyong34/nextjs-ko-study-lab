# default.js

- 공식 문서: [default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Parallel Routes에서 `default.js`가 필요한 hard navigation 상황을 설명한다.
- named slot과 암시적 `children` slot의 fallback 계약을 이해한다.

## 핵심 개념 및 설명

`default.js` 파일은 Next.js가 전체 페이지 로드 후 [슬롯](parallel-routes.md#slots) 활성 상태를 복구할 수 없을 때 [병렬 라우트](parallel-routes.md) 내에서 폴백을 렌더링하는 데 사용된다.

[소프트 탐색](../../1-getting-started/linking-and-navigating.md#client-side-transitions) 동안 Next.js는 각 슬롯의 활성 _state_(하위 페이지)를 추적한다. 그러나 하드 탐색(전체 페이지 로드)의 경우 Next.js는 활성 상태를 복구할 수 없다. 이 경우 현재 URL과 일치하지 않는 하위 페이지에 대해 `default.js` 파일이 렌더링될 수 있다.

다음 폴더 구조를 고려한다.`@team` 슬롯에는 `settings` 페이지가 있지만 `@analytics`에는 없다.

![병렬 라우트 일치하지 않는 경로](./assets/default-01.webp)

`/settings`로 이동할 때 `@team` 슬롯은 `@analytics` 슬롯에 대해 현재 활성 페이지를 유지하면서 `settings` 페이지를 렌더링한다.

새로 고침 시 Next.js는 `@analytics`에 대한 `default.js`를 렌더링한다.`default.js`가 존재하지 않으면 명명된 슬롯(`@team`,`@analytics` 등)에 대해 오류가 반환되고 계속하려면 `default.js`를 정의해야 한다. 이러한 상황에서 404를 반환하는 이전 동작을 유지하려면 다음을 포함하는 `default.js`를 만들 수 있다.

```tsx filename="app/@team/default.js"
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

또한 `children`는 암시적 슬롯이므로 Next.js가 상위 페이지의 활성 상태를 복구할 수 없는 경우 `children`에 대한 대체를 렌더링하기 위해 `default.js` 파일도 생성해야 한다.`children` 슬롯에 대해 `default.js`를 생성하지 않으면 경로에 대해 404 페이지가 반환된다.

<a id="reference"></a>
### 참조

<a id="params-optional"></a>
#### `params`(옵션)

루트 세그먼트부터 슬롯의 하위 페이지까지 [다이나믹 라우트 매개변수](dynamic-routes.md)를 포함하는 객체로 확인되는 Promise이다. 예를 들어:

```tsx filename="app/[artist]/@sidebar/default.js" switcher
export default async function Default({
  params,
}: {
  params: Promise<{ artist: string }>
}) {
  const { artist } = await params
}
```

```jsx filename="app/[artist]/@sidebar/default.js" switcher
export default async function Default({ params }) {
  const { artist } = await params
}
```

| 예 | URL | `params` |
| ------------------------------------------ | ------------ | -------------------------------------------- |
| `app/[artist]/@sidebar/default.js` | `/zack` | `Promise<{ artist: 'zack' }>` |
| `app/[artist]/[album]/@sidebar/default.js` | `/zack/next` | `Promise<{ artist: 'zack', album: 'next' }>` |

- `params` prop은 Promise이기 때문이다. 값에 접근하려면 `async/await` 또는 React의 [`use`](https://react.dev/reference/react/use) 함수를 사용해야 한다.
  - 버전 14 이하에서는 `params`가 동기식 prop이었다. 이전 버전과의 호환성을 돕기 위해 Next.js 15에서는 여전히 동기적으로 액세스할 수 있지만 이 동작은 앞으로 더 이상 사용되지 않는다.

## 예제 및 데모 설계

- Phase 2에서 `@team`과 `@analytics` slot을 만들고 `/settings` 이동 후 새로고침 결과를 비교한다.
- 한 slot의 `default.tsx`를 제거해 오류 또는 404 fallback을 관찰한다.

## 연습 문제

1. `default.js`가 주로 필요한 시점은?
   - A. soft navigation에서 항상
   - B. hard navigation 뒤 slot 상태를 복구할 수 없을 때
   - C. 빌드 설정을 읽을 때

<details><summary>정답 보기</summary>

정답: B. URL과 맞지 않는 slot의 fallback을 제공한다.
</details>

## 챕터 요약

- `default.js`는 Parallel Routes의 복구 불가능한 slot fallback이다.
- soft navigation은 활성 slot 상태를 유지한다.
- hard navigation은 URL과 맞지 않는 slot 상태를 복구하지 못한다.
- `children`도 암시적 slot이다.
- `params`는 Promise로 전달될 수 있다.
