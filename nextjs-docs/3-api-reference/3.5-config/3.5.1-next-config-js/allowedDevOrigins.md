# allowedDevOrigins

- 공식 문서: [allowedDevOrigins](https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 개발 중 dev-only asset과 endpoint에 대한 cross-origin 요청 제한을 이해한다.
- `allowedDevOrigins`에 추가 Origin을 지정하는 방법과 hostname 매칭 규칙을 익힌다.
- `*`와 `**` wildcard의 차이, `Origin` header가 없는 요청의 처리 방식을 설명할 수 있다.

## 핵심 개념 및 설명

Next.js는 개발 중 dev-only asset과 endpoint로 들어오는 cross-origin 요청을 기본적으로 차단한다. 승인하지 않은 접근을 막기 위한 기본 동작이다.

개발 서버를 초기화할 때 사용한 hostname 외의 Origin에서 오는 요청을 허용하려면 `allowedDevOrigins`를 설정한다. 이 hostname의 기본값은 `localhost`다.

### 기본 설정

`allowedDevOrigins`에는 개발 모드에서 dev server에 요청할 수 있는 origin을 추가로 적는다. 예를 들어 `localhost`만 허용하는 대신 `local-origin.dev`도 사용하려면 다음과 같이 설정한다.

```js filename="next.config.js"
module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}
```

요청의 `Origin` header에서 비교하는 값은 [`hostname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname) 하나뿐이다. `http://local-origin.dev:3000/dashboard?tab=1`이라면 `local-origin.dev`가 매칭된다. scheme, port, path, query string은 무시한다. 따라서 설정 항목에도 `https://`와 port를 넣지 않는다.

no-cors cross-site 요청은 `Origin` header를 보내지 않는다. 예를 들어 script tag가 dev asset을 로드할 때는 `Referer` hostname으로 매칭한다.

### Wildcard 매칭

두 가지 wildcard를 사용할 수 있다.

- `*`는 hostname의 label을 정확히 하나 대신한다.
- `**`는 하나 이상의 label을 대신한다.

그래서 앞의 예제에 bare hostname과 subdomain용 항목을 모두 적었다.

| Entry | Matches | Does not match |
| --- | --- | --- |
| local-origin.dev | local-origin.dev | team.local-origin.dev |
| *.local-origin.dev | team.local-origin.dev | local-origin.dev, team.eu.local-origin.dev |
| **.local-origin.dev | team.local-origin.dev, team.eu.local-origin.dev | local-origin.dev |

부분 replacement는 지원하지 않으니 `team-*.local-origin.dev` 대신 `*.local-origin.dev`처럼 작성한다. `**`는 pattern의 시작 위치에서만 사용할 수 있다.

### 기본으로 허용되는 hostname과 추가 설정

dev server는 `localhost`와 그 subdomain, server를 시작할 때 사용한 hostname을 이미 허용한다. 그 밖의 hostname은 entry를 추가해야 한다. 원격 개발에 사용하는 tunnel이 한 예다.

```js filename="next.config.js"
module.exports = {
  allowedDevOrigins: ['*.tunnel.example.com'],
}
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 개발 서버를 실행하고 `allowedDevOrigins`에 등록한 hostname과 등록하지 않은 hostname에서 dev asset 요청을 보낸다.
- 브라우저의 네트워크 패널에서 허용된 요청과 차단된 요청을 비교하고 `Origin` header가 없을 때 `Referer` hostname을 사용하는 흐름을 확인한다.
- `local-origin.dev`, `*.local-origin.dev`, `**.local-origin.dev`를 각각 적용해 표의 세 매칭 결과를 재현한다.

## 연습 문제

1. `http://local-origin.dev:3000/dashboard?tab=1` 요청에서 `allowedDevOrigins`와 비교하는 값은 무엇인가?
   - A. `http://local-origin.dev:3000/dashboard?tab=1`
   - B. `local-origin.dev`
   - C. `local-origin.dev:3000`
   - D. `/dashboard?tab=1`

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `Origin` header에서 hostname만 비교하며 scheme, port, path, query string은 무시한다.
</details>

2. `**.local-origin.dev`에 대한 설명으로 올바른 것은 무엇인가?
   - A. `local-origin.dev`만 매칭한다.
   - B. `team.local-origin.dev`와 `team.eu.local-origin.dev`를 매칭하지만 `local-origin.dev`는 매칭하지 않는다.
   - C. `team-foo.local-origin.dev`처럼 hostname 일부를 대체한다.
   - D. pattern의 어느 위치에서나 사용할 수 있다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `**`는 하나 이상의 hostname label을 대신하며 pattern의 시작 위치에서만 사용할 수 있다.
</details>

## 챕터 요약

- Next.js는 개발 중 dev-only asset과 endpoint에 대한 cross-origin 요청을 기본적으로 차단한다.
- `allowedDevOrigins`에는 scheme과 port를 제외한 hostname pattern을 적는다.
- `Origin` header가 있으면 hostname을 비교하고 no-cors 요청처럼 header가 없으면 `Referer` hostname을 사용한다.
- `*`는 정확히 하나의 label을, `**`는 하나 이상의 label을 대신하며 부분 replacement는 지원하지 않는다.
- `localhost`, 그 subdomain, server를 시작할 때 사용한 hostname은 기본 허용되고 그 밖의 hostname은 직접 추가해야 한다.
