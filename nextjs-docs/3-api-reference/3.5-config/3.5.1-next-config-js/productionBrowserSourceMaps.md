# productionBrowserSourceMaps

- 공식 문서: [productionBrowserSourceMaps](https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 개발 빌드와 프로덕션 빌드에서 Source Maps의 기본 동작을 구분한다.
- `productionBrowserSourceMaps`로 프로덕션 브라우저 Source Maps를 선택적으로 활성화하는 방법을 익힌다.
- Source Maps 활성화가 `next build` 시간과 메모리 사용량에 미치는 영향을 파악한다.

## 핵심 개념 및 설명

개발 환경에서는 Source Maps가 기본적으로 활성화된다. 프로덕션 빌드에서는 클라이언트에 소스가 노출되지 않도록 기본적으로 비활성화된다. 설정 플래그로 명시적으로 활성화하면 프로덕션 빌드에서도 브라우저 Source Maps를 생성할 수 있다.

### 설정

```js filename="next.config.js"
module.exports = {
  productionBrowserSourceMaps: true,
}
```

`productionBrowserSourceMaps`를 활성화하면 Source Maps가 JavaScript 파일과 같은 디렉토리에 출력된다. Next.js는 요청이 들어올 때 이 파일을 자동으로 제공한다.

Source Maps를 추가하면 비용이 생길 수 있다.

- `next build` 시간이 늘어날 수 있다.
- `next build` 중 메모리 사용량이 증가한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `productionBrowserSourceMaps: true`를 설정하고 프로덕션 빌드를 실행한 뒤 브라우저 개발자 도구의 Sources 패널에서 원본 파일 매핑을 확인한다.
- `true`를 제거한 빌드와 비교해 JavaScript 파일과 같은 디렉토리에 Source Maps가 생성되는지, 브라우저가 요청에 응답하는지 관찰한다.
- 두 빌드의 `next build` 시간과 메모리 사용량을 함께 기록해 설정 비용을 비교한다.

## 연습 문제

1. `productionBrowserSourceMaps`의 기본 동작으로 옳은 것은?
   - A. 개발 환경과 프로덕션 환경 모두 항상 비활성화된다.
   - B. 개발 환경에서는 기본 활성화되고, 프로덕션 빌드에서는 기본 비활성화된다.
   - C. 프로덕션 빌드에서만 기본 활성화된다.
   - D. 브라우저가 요청할 때마다 설정과 관계없이 생성된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 개발 중에는 Source Maps가 기본 활성화되지만, 프로덕션 빌드에서는 소스 노출을 막기 위해 기본 비활성화된다.
</details>

2. `productionBrowserSourceMaps: true`를 설정했을 때의 설명으로 옳은 것은?
   - A. Source Maps가 JavaScript 파일과 같은 디렉토리에 출력되고 Next.js가 요청에 응답한다.
   - B. 모든 JavaScript 파일이 서버에서 제거된다.
   - C. `next build` 시간이 항상 줄어든다.
   - D. Source Maps가 브라우저에 절대 제공되지 않는다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: 설정을 활성화하면 Source Maps가 JavaScript 파일과 같은 디렉토리에 출력되고 Next.js가 요청에 따라 제공한다.
</details>

## 챕터 요약

- 개발 환경의 Source Maps는 기본적으로 활성화된다.
- 프로덕션 빌드의 Source Maps는 소스 노출을 막기 위해 기본적으로 비활성화된다.
- `productionBrowserSourceMaps: true`로 프로덕션 브라우저 Source Maps 생성을 선택할 수 있다.
- 생성된 Source Maps는 JavaScript 파일과 같은 디렉토리에 출력되고 Next.js가 자동으로 제공한다.
- Source Maps를 추가하면 `next build` 시간과 메모리 사용량이 늘어날 수 있다.
