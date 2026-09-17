# compress

- 공식 문서: [compress](https://nextjs.org/docs/app/api-reference/config/next-config-js/compress)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js가 next start 또는 custom server에서 gzip 압축을 기본으로 적용하는 조건을 이해한다.
- Accept-Encoding과 Content-Encoding 응답 헤더로 압축 지원과 실제로 적용된 알고리즘을 확인하는 방법을 익힌다.
- compress: false를 사용하는 경우와 서버의 다른 압축 설정으로 전환하는 경우를 구분한다.

## 핵심 개념 및 설명

기본적으로 Next.js는 next start 또는 custom server를 사용할 때 렌더링된 콘텐츠와 정적 파일을 gzip으로 압축한다. 애플리케이션에 압축 설정이 없을 때를 위한 최적화다. custom server에서 이미 압축을 설정했다면 Next.js는 압축을 추가하지 않는다.

응답의 [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) 헤더에서 브라우저가 허용하는 압축 알고리즘을 확인할 수 있다. [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) 헤더에서는 현재 응답에 실제로 사용한 알고리즘을 확인한다.

### 압축 비활성화 (Disabling compression)

압축을 비활성화하려면 compress 설정 옵션을 false로 지정한다.

```js filename="next.config.js"
module.exports = {
  compress: false,
}
```

서버에 별도의 압축 설정이 없다면 압축을 비활성화하는 것은 권장하지 않는다. 압축은 대역폭 사용량을 줄이고 애플리케이션 성능을 높이기 때문이다. 예를 들어 nginx를 사용하면서 brotli로 전환하려는 경우에는 compress를 false로 설정해 nginx가 압축을 처리하게 한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- next start로 프로덕션 서버를 실행한 뒤 브라우저 개발자 도구의 Network 탭에서 HTML 또는 정적 파일 요청을 선택한다.
- 요청의 Accept-Encoding과 응답의 Content-Encoding을 비교해 브라우저가 허용한 방식과 Next.js가 실제로 사용한 방식을 확인한다.
- compress: false를 설정한 빌드와 기본 설정을 비교해 응답 헤더와 크기의 차이를 관찰한다.

## 연습 문제

1. Next.js의 기본 압축 동작에 대한 설명으로 올바른 것은 무엇인가?
   - A. next dev에서만 gzip을 적용한다.
   - B. next start 또는 custom server에서 렌더링된 콘텐츠와 정적 파일을 기본적으로 gzip으로 압축한다.
   - C. custom server가 압축을 설정해도 Next.js가 항상 한 번 더 압축한다.
   - D. 브라우저의 Accept-Encoding 헤더와 무관하게 항상 brotli를 사용한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js는 next start 또는 custom server에서 기본적으로 gzip을 사용하며, custom server에 이미 압축이 설정되어 있으면 압축을 추가하지 않는다.
</details>

2. compress를 false로 설정하는 사례로 공식 문서에 맞는 것은 무엇인가?
   - A. 서버에서 압축을 전혀 사용하지 않을 때
   - B. nginx 같은 서버가 brotli 압축을 처리하도록 전환할 때
   - C. 브라우저가 HTML을 요청하지 못하게 할 때
   - D. 정적 파일을 모두 삭제할 때

<details><summary>정답 보기</summary>

정답: **B**  
해설: 서버에 별도의 압축 설정이 있을 때만 compress: false를 고려하며, nginx가 brotli를 처리하도록 전환하는 사례가 해당한다.
</details>

## 챕터 요약

- Next.js는 next start 또는 custom server에서 렌더링된 콘텐츠와 정적 파일을 기본적으로 gzip으로 압축한다.
- custom server가 이미 압축을 설정했다면 Next.js는 압축을 추가하지 않는다.
- Accept-Encoding은 브라우저가 허용하는 방식이고 Content-Encoding은 현재 응답에 적용된 방식이다.
- compress: false는 nginx처럼 별도의 서버가 압축을 맡을 때 사용한다.
- 별도 압축 설정이 없다면 압축을 비활성화하지 않는 편이 좋다.
