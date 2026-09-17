# expireTime

- 공식 문서: [expireTime](https://nextjs.org/docs/app/api-reference/config/next-config-js/expireTime)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `expireTime`이 ISR이 적용된 페이지의 `Cache-Control` 헤더에 어떤 만료 시간을 지정하는지 이해한다.
- `revalidate` 기간과 `stale-while-revalidate` 값을 함께 해석한다.
- CDN이 오래된 응답을 제공할 수 있는 시간을 `expireTime`으로 조정하는 방법을 익힌다.

## 핵심 개념 및 설명

`expireTime`은 ISR이 적용된 페이지에서 CDN이 사용할 `Cache-Control` 헤더의 `stale-while-revalidate` 만료 시간을 지정하는 옵션이다.

`next.config.js`에 `expireTime`을 초 단위로 설정한다.

```js filename="next.config.js"
module.exports = {
  // 초 단위로 나타낸 1시간
  expireTime: 3600,
}
```

Next.js는 `Cache-Control` 헤더를 보낼 때 해당 경로의 `revalidate` 기간을 기준으로 `expireTime`을 계산한다.

예를 들어 어떤 경로의 `revalidate`가 15분이고 `expireTime`이 1시간이면 생성되는 헤더는 다음과 같다.

```text
Cache-Control: s-maxage=900, stale-while-revalidate=2700
```

이 설정에서는 설정한 `expireTime`보다 15분 짧은 시간 동안 응답을 `stale` 상태로 유지할 수 있다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (브라우저 DevTools의 Network 탭에서 응답 헤더를 확인할 수 있다)
- `expireTime: 3600`을 설정하고 `revalidate`가 15분인 ISR 페이지를 둔 애플리케이션을 실행한다.
- 브라우저에서 해당 페이지를 요청하고 응답의 `Cache-Control` 헤더가 `s-maxage=900, stale-while-revalidate=2700`으로 계산되는지 확인한다.

## 연습 문제

1. `expireTime`의 역할로 올바른 것은 무엇인가?
   - A. `next build`가 생성하는 빌드 ID의 형식을 바꾼다.
   - B. ISR 페이지의 `Cache-Control` 헤더에서 CDN이 사용할 `stale-while-revalidate` 만료 시간을 지정한다.
   - C. 브라우저가 요청하는 모든 정적 자산의 URL에 접두사를 붙인다.
   - D. 모든 HTML 페이지의 `ETag` 생성을 끈다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `expireTime`은 ISR이 적용된 페이지의 `Cache-Control` 헤더에 지정할 `stale-while-revalidate` 만료 시간을 계산하는 데 사용한다.
</details>

2. 한 경로의 `revalidate`가 15분이고 `expireTime`이 1시간일 때 생성되는 `Cache-Control` 헤더는 무엇인가?
   - A. `s-maxage=3600, stale-while-revalidate=900`
   - B. `s-maxage=900, stale-while-revalidate=2700`
   - C. `s-maxage=2700, stale-while-revalidate=900`
   - D. `s-maxage=900, stale-while-revalidate=3600`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 15분은 900초이고 1시간에서 15분을 뺀 45분은 2700초이므로 헤더 값은 `s-maxage=900, stale-while-revalidate=2700`이다.
</details>

## 챕터 요약

- `expireTime`은 ISR 페이지의 `Cache-Control` 헤더에 사용할 `stale-while-revalidate` 만료 시간을 지정한다.
- 값은 초 단위로 설정하며 예시로 `3600`은 1시간을 뜻한다.
- Next.js는 경로별 `revalidate` 기간을 기준으로 헤더 값을 계산한다.
- `revalidate`가 15분이고 `expireTime`이 1시간이면 `s-maxage=900, stale-while-revalidate=2700`이 된다.
