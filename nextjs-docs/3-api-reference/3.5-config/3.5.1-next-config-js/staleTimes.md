# staleTimes

- 공식 문서: [staleTimes](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `staleTimes`가 Client Cache에서 페이지 세그먼트를 캐시하는 시간을 정하는 방식을 이해한다.
- `dynamic`과 `static`이 적용되는 페이지와 `prefetch` 조건, 기본값을 구분한다.
- `staleTimes`가 Loading boundaries, partial rendering, 뒤로 가기 및 앞으로 가기 캐싱에 미치는 범위를 설명한다.

## 핵심 개념 및 설명

`staleTimes`는 [Client Cache](../../../4-glossary/README.md#client-cache)에서 페이지 세그먼트를 캐시하는 실험적 기능이다.

> **experimental**: 이 기능은 현재 실험적이며 변경될 수 있다. 프로덕션 사용은 권장하지 않는다. 테스트해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 의견을 남길 수 있다.

다음처럼 `experimental.staleTimes`에 사용자 지정 `revalidation` 시간을 초 단위로 지정한다.

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

module.exports = nextConfig
```

`static`과 `dynamic` 속성은 [링크 `prefetch`](../../3.2-components/link.md#prefetch) 종류별로 적용되는 기간을 초 단위로 지정한다.

- `dynamic`: 페이지가 정적으로 생성되지 않았고 완전히 prefetch되지 않은 경우에 사용한다. `prefetch={true}`를 사용하는 경우가 그 예다.
  - 기본값: 0초, 캐시하지 않는다.
- `static`: 정적으로 생성된 페이지에 사용한다. `Link`의 `prefetch` prop을 `true`로 설정했을 때나 [`router.prefetch`](../../3.3-functions/use-router.md)를 호출했을 때에도 사용한다.
  - 기본값: 5분

> **알아두면 좋은 점**:
>
> - [Loading boundaries](../../3.1-file-conventions/loading.md)는 이 설정에서 정한 `static` 기간 동안 재사용할 수 있다고 본다.
> - 이 설정은 [partial rendering](../../../1-getting-started/linking-and-navigating.md#client-side-transitions)에 영향을 주지 않는다. **즉, 공유 레이아웃은 내비게이션마다 자동으로 다시 fetch되지 않고 변경되는 페이지 세그먼트만 다시 fetch된다.**
> - [뒤로 가기 및 앞으로 가기 캐싱](../../../4-glossary/README.md#client-cache)은 레이아웃 이동을 방지하고 브라우저 스크롤 위치를 잃지 않게 해 주는데, 이 설정은 그 동작을 바꾸지 않는다.

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `dynamic` `staleTimes` 기본값이 30초에서 0초로 변경됐다. |
| `v14.2.0` | experimental `staleTimes`가 추가됐다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `dynamic: 0`, `static: 180`을 설정하고 정적 페이지와 다이나믹 페이지의 `Link` prefetch 결과가 캐시되는 시간을 비교한다.
- Loading boundaries가 `static` 기간 동안 재사용되는지 내비게이션과 네트워크 로그로 확인한다.
- 페이지 세그먼트만 다시 fetch되는지, 뒤로 가기와 앞으로 가기에서 브라우저 스크롤 위치가 유지되는지 함께 확인한다.

## 연습 문제

1. `staleTimes.dynamic`의 기본값은 무엇인가?
   - A. 0초
   - B. 30초
   - C. 5분
   - D. 1시간

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: `dynamic`의 기본값은 0초라서 캐시하지 않는다.
</details>

2. `staleTimes.static`이 적용되는 경우는 무엇인가?
   - A. 정적 페이지나 `prefetch={true}`를 사용하는 링크
   - B. `cache: 'no-store'` fetch
   - C. 전체 페이지 새로고침
   - D. 모든 Server Function 호출

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: `static`은 정적으로 생성된 페이지, `prefetch={true}`인 링크, `router.prefetch` 호출에 적용된다.
</details>

3. `staleTimes` 설정에 대한 설명으로 올바른 것은 무엇인가?
   - A. 공유 레이아웃을 내비게이션마다 자동으로 다시 fetch한다.
   - B. 뒤로 가기와 앞으로 가기 캐싱 동작을 끈다.
   - C. partial rendering의 동작을 바꾼다.
   - D. 공유 레이아웃의 자동 재요청 여부와 뒤로 가기 및 앞으로 가기 캐싱 동작을 바꾸지 않는다.

<details><summary>정답 보기</summary>

정답: **D**<br>
해설: 이 설정은 partial rendering과 뒤로 가기 및 앞으로 가기 캐싱 동작을 바꾸지 않으며, 내비게이션에서 변경되는 페이지 세그먼트만 다시 fetch한다.
</details>

## 챕터 요약

- `staleTimes`는 Client Cache에서 페이지 세그먼트를 캐시하는 실험적 설정이다.
- `dynamic`의 기본값은 0초이고 `static`의 기본값은 5분이다.
- `static`은 정적 페이지, `prefetch={true}` 링크, `router.prefetch` 호출에 적용한다.
- Loading boundaries는 설정한 `static` 기간 동안 재사용할 수 있다고 본다.
- 이 설정은 partial rendering과 뒤로 가기 및 앞으로 가기 캐싱 동작을 바꾸지 않는다.
