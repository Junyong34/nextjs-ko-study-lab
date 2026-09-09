# reactMaxHeadersLength

- 공식 문서: [reactMaxHeadersLength](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactMaxHeadersLength)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `prerendering` 중 React가 응답에 추가할 수 있는 헤더를 생성하는 이유를 이해한다.
- `reactMaxHeadersLength`의 기본값 `6000`과 사용자 지정 값을 구분한다.
- 브라우저와 서버 사이의 `proxy`가 긴 헤더를 자를 수 있을 때 제한을 낮추는 판단 기준을 익힌다.

## 핵심 개념 및 설명

`prerendering` 중 React는 응답에 추가할 수 있는 헤더를 생성할 수 있다. 브라우저가 폰트, 스크립트, 스타일시트 같은 리소스를 미리 로드하게 해 성능을 높이는 데 사용할 수 있다.

`reactMaxHeadersLength`의 기본값은 `6000`이다. `next.config.js`에서 이 옵션을 설정해 값을 덮어쓸 수 있다.

```js filename="next.config.js"
module.exports = {
  reactMaxHeadersLength: 1000,
}
```

> **알아두면 좋은 점**: 이 옵션은 App Router에서만 사용할 수 있다.

브라우저와 서버 사이에 있는 `proxy`의 종류에 따라 헤더가 잘릴 수 있다. 긴 헤더를 지원하지 않는 reverse proxy를 사용한다면 헤더가 잘리지 않도록 더 낮은 값을 설정한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `reactMaxHeadersLength: 1000`과 기본값을 각각 적용해 프로덕션 응답의 헤더를 브라우저 네트워크 패널에서 비교한다.
- 폰트, 스크립트, 스타일시트의 사전 로드와 관련된 헤더가 응답에 포함되는지 확인한다.
- 긴 헤더를 지원하지 않는 reverse proxy 환경을 구성할 수 있다면 제한을 낮췄을 때 헤더가 잘리지 않는지 관찰한다.

## 연습 문제

1. `reactMaxHeadersLength`의 기본값은 무엇인가?
   - A. `100`
   - B. `1000`
   - C. `6000`
   - D. `10000`

<details><summary>정답 보기</summary>

정답: **C**  
해설: `reactMaxHeadersLength`의 기본값은 `6000`이며 설정으로 덮어쓸 수 있다.
</details>

2. 긴 헤더를 지원하지 않는 reverse proxy를 사용할 때의 설정으로 옳은 것은?
   - A. 헤더가 잘리지 않도록 `reactMaxHeadersLength` 값을 더 낮춘다.
   - B. `reactMaxHeadersLength`를 무조건 `0`으로 설정한다.
   - C. Pages Router에서만 옵션을 활성화한다.
   - D. 모든 preload 헤더를 애플리케이션 코드에서 삭제한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: reverse proxy가 긴 헤더를 지원하지 않으면 더 낮은 값을 설정해 헤더가 잘리지 않도록 한다.
</details>

## 챕터 요약

- React는 `prerendering` 중 브라우저가 리소스를 미리 로드하는 데 사용할 헤더를 생성할 수 있다.
- `reactMaxHeadersLength`의 기본값은 `6000`이며 `next.config.js`에서 덮어쓸 수 있다.
- 이 옵션은 App Router에서만 사용할 수 있다.
- 브라우저와 서버 사이의 `proxy`가 긴 헤더를 지원하지 않으면 더 낮은 값을 설정한다.
