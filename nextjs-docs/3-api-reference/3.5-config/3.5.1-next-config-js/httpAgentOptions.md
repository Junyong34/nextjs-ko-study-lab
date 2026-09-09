# httpAgentOptions

- 공식 문서: [httpAgentOptions](https://nextjs.org/docs/app/api-reference/config/next-config-js/httpAgentOptions)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Node.js 18 이전 버전에서 Next.js가 `fetch()`와 HTTP Keep-Alive를 어떻게 설정하는지 이해한다.
- `httpAgentOptions`로 서버 측 `fetch()` 호출의 HTTP Keep-Alive를 끄는 방법을 익힌다.
- 이 옵션이 적용되는 실행 환경과 설정 위치를 설명할 수 있다.

## 핵심 개념 및 설명

Node.js 18 이전 버전에서 Next.js는 `fetch()`를 [undici](https://nextjs.org/docs/architecture/supported-browsers#polyfills)로 자동으로 polyfill하고, [HTTP Keep-Alive](https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive)를 기본적으로 활성화한다. HTTP Keep-Alive는 서버와의 연결을 유지하므로 여러 요청이 같은 연결을 다시 사용할 수 있다.

서버 측 모든 `fetch()` 호출에서 HTTP Keep-Alive를 비활성화하려면 `next.config.js`에 `httpAgentOptions`를 추가한다.

```js
module.exports = {
  httpAgentOptions: {
    keepAlive: false,
  },
}
```

이 설정에서 `keepAlive: false`는 서버 측 `fetch()` 요청이 사용하는 HTTP 연결 유지 동작을 끈다. 설정 파일은 `next.config.js`에 둔다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 서버에서 `fetch()` 요청을 여러 번 보내고 Node.js의 연결 상태와 요청 로그를 비교하는 실습을 설계할 수 있다. 다만 HTTP Keep-Alive 설정 차이는 브라우저 화면만으로 안정적으로 확인하기 어려워 브라우저 데모로는 판정하지 않는다.

## 연습 문제

1. Node.js 18 이전 버전에서 Next.js가 기본으로 활성화하는 동작은 무엇인가?
   - A. 클라이언트의 모든 쿠키를 삭제하는 동작
   - B. `fetch()`의 `undici` polyfill과 HTTP Keep-Alive
   - C. 모든 요청을 Edge Runtime으로 전환하는 동작
   - D. `fetch()`를 비활성화하는 동작

<details><summary>정답 보기</summary>

정답: **B**  
해설: 원문은 Node.js 18 이전 버전에서 Next.js가 `fetch()`를 `undici`로 polyfill하고 HTTP Keep-Alive를 기본적으로 활성화한다고 설명한다.
</details>

2. 서버 측의 모든 `fetch()` 호출에서 HTTP Keep-Alive를 비활성화하려면 어떻게 설정해야 하는가?
   - A. `httpAgentOptions: { keepAlive: true }`
   - B. `httpAgentOptions: { keepAlive: false }`
   - C. `httpAgentOptions: { disable: true }`
   - D. `fetchOptions: { keepAlive: false }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next.config.js`의 `httpAgentOptions.keepAlive`에 `false`를 지정한다.
</details>

## 챕터 요약

- Node.js 18 이전 버전에서 Next.js는 `fetch()`를 `undici`로 polyfill한다.
- Next.js는 HTTP Keep-Alive를 기본적으로 활성화한다.
- 서버 측 모든 `fetch()` 호출의 HTTP Keep-Alive를 끄려면 `httpAgentOptions.keepAlive`를 `false`로 설정한다.
- 설정은 `next.config.js`의 `httpAgentOptions` 객체에 작성한다.
