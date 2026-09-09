# cacheLife

- 공식 문서: [cacheLife](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `cacheLife` 옵션으로 사용자 지정 cache profile을 정의하는 방법을 익힌다.
- `cacheComponents: true`와 `cacheLife` 함수가 사용자 지정 profile을 적용하는 방식이 어떤 관계인지 이해한다.
- `stale`, `revalidate`, `expire` 값이 각각 클라이언트 캐시, 서버 캐시 갱신, 다이나믹 전환에 미치는 영향을 구분한다.
- 기본 제공 profile을 같은 이름으로 재정의할 때, 어떤 profile 이름을 쓸 수 있고 어떤 제약이 있는지 확인한다.

## 핵심 개념 및 설명

`cacheLife` 옵션은 컴포넌트나 함수 안에서 사용하는 [`cacheLife`](../../3.3-functions/cacheLife.md) 함수와 [`use cache` 지시어](../../3.4-directives/use-cache.md)의 범위에서 사용자 지정 cache profile을 정의한다.

### 사용법 (Usage)

profile을 정의하려면 [`cacheComponents`](./cacheComponents.md) 플래그를 활성화하고 `next.config.js` 파일의 `cacheLife` 객체에 profile을 추가한다. 다음 예시에서는 `blog` profile을 정의한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    blog: {
      stale: 3600, // 1시간
      revalidate: 900, // 15분
      expire: 86400, // 1일
    },
  },
}

export default nextConfig
```

이제 컴포넌트나 함수에서 다음과 같이 사용자 지정 `blog` 설정을 사용한다.

```tsx filename="app/actions.ts" highlight={4,5}
import { cacheLife } from 'next/cache'

export async function getCachedData() {
  'use cache'
  cacheLife('blog')
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

`default`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `max` 중 하나와 같은 이름으로 profile을 정의하면 기본 제공 profile도 재정의할 수 있다. 기본 cache profile 재정의 방법은 [cacheLife 함수 문서의 Overriding the default cache profiles](../../3.3-functions/cacheLife.md#overriding-the-default-cache-profiles)에서 확인한다.

### 참조 (Reference)

설정 객체의 속성은 다음 형식을 따른다.

| 속성 | 값 | 설명 | 필수 여부 |
|---|---|---|---|
| `stale` | `number` | 서버에 확인하지 않고 클라이언트가 값을 cache하는 기간이다. | 선택 |
| `revalidate` | `number` | 서버에서 cache를 갱신하는 주기다. 갱신하는 동안 오래된 값을 제공할 수 있다. | 선택 |
| `expire` | `number` | 값이 오래된 상태로 유지될 수 있는 최대 기간이다. 이 기간이 지나면 다이나믹 렌더링으로 전환한다. | 선택 - `revalidate`보다 길어야 한다 |

### 관련 문서 (Related)

- [`use cache`](../../3.4-directives/use-cache.md)
- [`cacheHandlers`](./cacheHandlers.md)
- [`cacheLife` 함수](../../3.3-functions/cacheLife.md)

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `cacheComponents: true`와 `blog` profile을 적용한 페이지를 만든다.
- 첫 요청과 `revalidate` 기간 안의 반복 요청에서 반환 데이터의 시각이나 서버 로그를 비교해 cache hit를 관찰한다.
- `stale`, `revalidate`, `expire` 값을 짧게 설정한 별도 profile을 추가해 클라이언트 cache 유지, 서버 갱신, 다이나믹 전환 시점을 순서대로 확인한다.

## 연습 문제

1. `cacheLife` 사용자 지정 profile을 사용하려면 어떤 설정이 필요한가?
   - A. `cacheComponents: true`를 활성화하고 `cacheLife` 객체에 profile을 정의한다.
   - B. `experimental.cacheLife: false`를 설정한다.
   - C. `compress: false`를 설정한다.
   - D. `deploymentId`를 지정한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: 사용자 지정 profile은 `cacheComponents: true`를 활성화한 뒤 `cacheLife` 객체에 정의하고, 코드에서 `cacheLife('profile-name')`으로 적용한다.
</details>

2. `cacheLife` 설정의 `expire`에 대한 설명으로 올바른 것은 무엇인가?
   - A. 클라이언트가 서버에 확인하지 않고 값을 cache하는 기간이다.
   - B. 서버에서 cache를 갱신하는 주기다.
   - C. 값이 오래된 상태로 유지될 수 있는 최대 기간이며 `revalidate`보다 길어야 한다.
   - D. cache profile의 이름이다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: `expire`는 값이 오래된 상태로 유지될 수 있는 최대 기간이고, 설정할 때 `revalidate`보다 길어야 한다.
</details>

3. 다음 중 기본 제공 cache profile을 재정의할 때 사용할 수 없는 이름은 무엇인가?
   - A. `seconds`
   - B. `weeks`
   - C. `blog`
   - D. `max`

<details><summary>정답 보기</summary>

정답: **C**  
해설: 기본 제공 profile 이름은 `default`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`다. `blog`는 사용자 지정 profile 예시다.
</details>

## 챕터 요약

- `cacheLife`는 `cacheLife` 함수와 `use cache` 지시어에 적용할 사용자 지정 cache profile을 정의한다.
- 사용자 지정 profile을 쓰려면 `cacheComponents: true`를 활성화해야 한다.
- `stale`은 클라이언트 cache 기간, `revalidate`는 서버 갱신 주기, `expire`는 오래된 값의 최대 유지 기간을 지정한다.
- `expire`는 `revalidate`보다 길어야 하며 기간이 지나면 다이나믹 렌더링으로 전환한다.
- 기본 profile과 같은 이름을 쓰면 해당 기본 profile을 재정의할 수 있다.
