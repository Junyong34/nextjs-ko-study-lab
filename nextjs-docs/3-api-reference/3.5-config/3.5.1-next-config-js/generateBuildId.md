# generateBuildId

- 공식 문서: [generateBuildId](https://nextjs.org/docs/app/api-reference/config/next-config-js/generateBuildId)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `next build`가 생성하는 build id가 애플리케이션 버전을 식별하는 방식을 이해한다.
- 여러 컨테이너에서 같은 빌드를 사용해야 할 때 `generateBuildId`로 일관된 build id를 반환하는 방법을 익힌다.
- `deploymentId`를 설정하면 `generateBuildId`가 적용되지 않는 조건을 구분한다.

## 핵심 개념 및 설명

Next.js는 `next build` 중에 애플리케이션이 제공하는 버전을 식별할 ID를 생성한다. 같은 빌드를 여러 컨테이너에서 사용해 시작할 수 있다.

환경의 각 단계마다 애플리케이션을 다시 빌드한다면 컨테이너 사이에서 사용할 build id를 일관되게 생성해야 한다. `next.config.js`에서 `generateBuildId`를 사용해 build id를 반환한다.

```js filename="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // 무엇이든 사용할 수 있으며 여기서는 최신 git hash를 사용한다
    return process.env.GIT_HASH
  },
}
```

> **알아두면 좋은 점**: [`deploymentId`](./deploymentId.md)를 설정하면 Next.js는 일정한 build id를 사용하므로 `generateBuildId`는 적용되지 않는다. [Version skew](../../../2-guides/self-hosting.md#version-skew)는 deployment ID를 기준으로 감지한다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (빌드 식별자와 컨테이너 운영을 다루므로 브라우저 화면만으로 확인하기 어렵다)
- 빌드 환경에서 `GIT_HASH`를 주입하고 `next build`를 실행해 빌드마다 일관된 build id를 반환하는 구성을 실험한다.
- 여러 컨테이너가 같은 `GIT_HASH`를 사용하도록 구성한 뒤 각 컨테이너가 같은 빌드 산출물을 쓰는지 빌드 로그와 산출물에서 확인한다.

## 연습 문제

1. 여러 컨테이너에서 `generateBuildId`를 사용하는 주된 이유는 무엇인가?
   - A. 각 컨테이너가 서로 다른 정적 자산을 생성하게 하려고
   - B. 환경의 각 단계에서 다시 빌드하더라도 컨테이너 사이에 일관된 build id를 사용하려고
   - C. 브라우저의 User-Agent를 변경하려고
   - D. HTML 페이지의 `ETag`를 끄려고

<details><summary>정답 보기</summary>

정답: **B**  
해설: 환경 단계마다 다시 빌드할 때에도 컨테이너 사이에서 일관된 build id를 사용해야 같은 애플리케이션 버전을 식별할 수 있다.
</details>

2. `deploymentId`를 설정하면 `generateBuildId`는 어떻게 동작하는가?
   - A. 반환값을 두 번 호출해 build id를 합친다.
   - B. `generateBuildId`가 반환한 값을 항상 우선한다.
   - C. 일정한 build id를 사용하며 `generateBuildId`는 적용되지 않는다.
   - D. `deploymentId` 설정이 무시되고 자동 생성된 build id만 사용한다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: `deploymentId`가 설정되면 Next.js는 일정한 build id를 사용하고 version skew를 deployment ID로 감지하므로 `generateBuildId`는 적용되지 않는다.
</details>

## 챕터 요약

- Next.js는 `next build` 중에 애플리케이션 버전을 식별할 build id를 생성한다.
- `generateBuildId`는 여러 컨테이너에서 사용할 일관된 build id를 반환하도록 설정한다.
- 각 환경 단계에서 다시 빌드한다면 컨테이너 사이에 같은 build id를 공유해야 한다.
- `deploymentId`를 설정하면 일정한 build id를 사용하므로 `generateBuildId`는 적용되지 않는다.
