# generateEtags

- 공식 문서: [generateEtags](https://nextjs.org/docs/app/api-reference/config/next-config-js/generateEtags)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js가 기본적으로 모든 페이지에 `etags`를 생성하는 동작을 이해한다.
- 캐시 전략에 따라 HTML 페이지의 `etag` 생성을 비활성화하는 설정을 익힌다.
- `generateEtags: false`를 설정했을 때 응답 헤더에서 확인할 변화를 파악한다.

## 핵심 개념 및 설명

Next.js는 기본적으로 모든 페이지에 [`etags`](https://en.wikipedia.org/wiki/HTTP_ETag)를 생성한다. 캐시 전략에 따라 HTML 페이지의 etag 생성을 끄고 싶을 때가 있다.

`next.config.js`에서 `generateEtags`를 `false`로 설정하면 etag 생성이 비활성화된다.

```js filename="next.config.js"
module.exports = {
  generateEtags: false,
}
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (브라우저 DevTools의 Network 탭에서 `ETag` 응답 헤더를 비교할 수 있다)
- 기본 설정으로 페이지를 요청해 응답의 `ETag` 헤더가 생성되는지 확인한다.
- `generateEtags: false`를 적용하고 다시 요청해 HTML 응답의 `ETag` 헤더가 사라지는지 비교한다.

## 연습 문제

1. `generateEtags`의 기본 동작으로 올바른 것은 무엇인가?
   - A. 모든 페이지에 `ETag`를 생성한다.
   - B. 개발 환경에서만 `ETag`를 생성한다.
   - C. `ETag`를 생성하지 않고 모든 응답을 `no-store`로 만든다.
   - D. `next build`의 build id를 `ETag`로 대체한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: Next.js는 기본적으로 모든 페이지에 `etags`를 생성한다.
</details>

2. HTML 페이지의 etag 생성을 끄는 설정은 무엇인가?
   - A. `generateEtags: true`
   - B. `generateEtags: false`
   - C. `etag: 'off'`
   - D. `cacheControl: false`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next.config.js`에서 `generateEtags: false`를 설정하면 etag 생성을 비활성화할 수 있다.
</details>

## 챕터 요약

- Next.js는 기본적으로 모든 페이지에 `etags`를 생성한다.
- HTML 페이지의 etag 생성 여부는 애플리케이션의 캐시 전략에 따라 조정할 수 있다.
- `generateEtags: false`를 `next.config.js`에 설정하면 etag 생성이 꺼진다.
- 브라우저의 Network 탭에서 응답의 `ETag` 헤더를 확인해 동작을 비교할 수 있다.
