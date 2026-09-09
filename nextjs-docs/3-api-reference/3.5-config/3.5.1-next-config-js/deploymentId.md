# deploymentId

- 공식 문서: [deploymentId](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- deploymentId가 배포 식별자와 version skew 보호, rolling deployment 중 cache busting에 사용하는 값임을 이해한다.
- next.config.js 설정과 NEXT_DEPLOYMENT_ID 환경 변수의 우선순위를 익힌다.
- 정적 자산 URL, client-side navigation 헤더, html 요소, use cache cache key에 deploymentId가 반영되는 방식을 파악한다.
- rolling deployment와 여러 서버 인스턴스 환경에서 일관된 deploymentId를 설정하는 이유를 설명할 수 있다.

## 핵심 개념 및 설명

deploymentId 옵션은 배포를 식별하는 값을 설정한다. 이 식별자는 version skew를 방지하고 rolling deployment 중 cache busting을 수행하는 데 사용한다.

```js filename="next.config.js"
module.exports = {
  deploymentId: 'my-deployment-id',
}
```

NEXT_DEPLOYMENT_ID 환경 변수로도 deployment ID를 설정할 수 있다.

```bash
NEXT_DEPLOYMENT_ID=my-deployment-id next build
```

> **알아두면 좋은 점**:
>
> - 두 값을 모두 설정하면 next.config.js의 deploymentId 값이 NEXT_DEPLOYMENT_ID 환경 변수보다 우선한다.

### 동작 방식 (How it works)

deploymentId를 설정하면 Next.js는 다음과 같이 동작한다.

1. 정적 자산 URL(JavaScript, CSS, images)에 ?dpl=<deploymentId>를 덧붙인다.
2. client-side navigation 요청에 x-deployment-id 헤더를 추가한다.
3. navigation 응답에 x-nextjs-deployment-id 헤더를 추가한다.
4. html 요소에 data-dpl-id 속성을 주입한다.
5. [use cache의 cache key](../../3.4-directives/use-cache.md#cache-keys)에 deploymentId를 포함해 deployment ID가 바뀌면 cache entry를 무효화한다.

클라이언트가 응답 헤더에서 자신의 deployment ID와 서버의 deployment ID가 다르다고 감지하면 client-side navigation 대신 hard navigation, 즉 전체 페이지 새로고침을 실행한다. 이 동작 덕분에 사용자는 일관된 배포 버전의 자산과 Server Function을 받는다.

> **알아두면 좋은 점**:
>
> - Next.js는 들어오는 요청의 ?dpl= 쿼리 파라미터를 읽지 않는다. 이 쿼리 파라미터는 cache busting용이며 라우팅용이 아니다. 버전을 인식하는 라우팅이 필요하면 호스팅 제공자 또는 CDN 문서에서 배포 기반 라우팅 구현 방법을 확인한다.

### 사용 사례 (Use cases)

#### Rolling deployment (Rolling deployments)

rolling deployment 중에는 일부 서버 인스턴스가 새 버전을 실행하고 다른 인스턴스는 아직 이전 버전을 실행할 수 있다. deployment ID가 없으면 사용자가 이전 자산과 새 자산을 섞어 받아 오류가 발생할 수 있다.

배포마다 일관된 deploymentId를 설정하면 다음을 보장한다.

- 클라이언트는 일치하는 배포 버전의 자산을 요청한다.
- 불일치가 발생하면 올바른 자산을 받기 위해 전체 페이지를 다시 로드한다.
- 배포 경계를 넘어 Server Function이 올바르게 동작한다.

#### 여러 서버 환경 (Multi-server environments)

Next.js 애플리케이션을 load balancer 뒤에서 여러 인스턴스로 실행할 때는 같은 배포에 속한 모든 인스턴스에 같은 deploymentId를 사용한다.

```js filename="next.config.js"
module.exports = {
  deploymentId: process.env.DEPLOYMENT_VERSION || process.env.GIT_SHA,
}
```

배포마다 다른 값을 사용하는 것만으로 version skew를 피하려면 요청도 배포별로 라우팅해야 한다. Next.js는 ?dpl=을 기준으로 라우팅하지 않으므로 이 라우팅은 호스트 또는 CDN이 담당한다. 이 라우팅이 없으면 rollout 중 클라이언트가 다른 배포의 인스턴스에 도달해 client-side navigation을 수행하지 못하고 다시 로드한다.

### 버전 변경 이력 (Version History)

| 버전 | 변경 사항 |
|---|---|
| v16.2.0 | Pages Router가 build ID가 아니라 응답 헤더로 version skew를 감지하며, deploymentId를 설정하면 build ID가 일정하게 유지된다. |
| v14.1.4 | deploymentId를 최상위 config 옵션으로 안정화했다. |
| v13.4.10 | experimental.deploymentId를 도입했다. |

### 관련 문서 (Related)

- [Self-Hosting - Version Skew](../../../2-guides/self-hosting.md#version-skew)
- [generateBuildId](./generateBuildId.md)

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 배포 버전 값 두 개를 번갈아 설정한 뒤 정적 자산 URL의 ?dpl=<deploymentId>, html의 data-dpl-id, client-side navigation 요청 헤더를 브라우저 개발자 도구에서 확인한다.
- 서버와 클라이언트의 deployment ID를 다르게 만든 테스트 환경에서 링크를 클릭해 client-side navigation 대신 전체 페이지 새로고침이 발생하는지 관찰한다.
- load balancer 하나 뒤에 여러 인스턴스를 둔 경우 동일한 deploymentId를 읽도록 설정하고 응답 헤더와 자산 URL이 일치하는지 비교한다.

## 연습 문제

1. next.config.js와 NEXT_DEPLOYMENT_ID를 모두 설정했을 때 우선하는 값은 무엇인가?
   - A. NEXT_DEPLOYMENT_ID 환경 변수
   - B. next.config.js의 deploymentId
   - C. 두 값을 합친 문자열
   - D. 빌드가 실패한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 두 값을 모두 설정하면 next.config.js의 deploymentId가 NEXT_DEPLOYMENT_ID보다 우선한다.
</details>

2. 다음 중 deploymentId가 직접 하는 동작이 아닌 것은 무엇인가?
   - A. 정적 자산 URL에 ?dpl=<deploymentId>를 추가한다.
   - B. client-side navigation 요청과 응답에 deployment ID 헤더를 추가한다.
   - C. 들어오는 요청의 ?dpl= 쿼리 파라미터를 사용해 배포별 라우팅을 수행한다.
   - D. use cache cache key에 deploymentId를 포함한다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: ?dpl=은 cache busting용이며, Next.js는 이 쿼리 파라미터를 읽어 라우팅하지 않는다.
</details>

3. rolling deployment에서 같은 배포에 속한 여러 서버 인스턴스에 필요한 설정은 무엇인가?
   - A. 각 인스턴스에 서로 다른 deploymentId를 설정한다.
   - B. 모든 인스턴스에 같은 deploymentId를 설정한다.
   - C. deploymentId를 설정하지 않는다.
   - D. deploymentId 대신 compress를 설정한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 같은 배포의 모든 인스턴스가 같은 deploymentId를 사용해야 클라이언트가 배포 버전 불일치를 감지하고 일관된 자산과 Server Function을 받을 수 있다.
</details>

## 챕터 요약

- deploymentId는 배포 식별자이며 version skew 보호와 rolling deployment 중 cache busting에 사용한다.
- next.config.js의 deploymentId가 NEXT_DEPLOYMENT_ID 환경 변수보다 우선한다.
- 정적 자산 URL에는 ?dpl=<deploymentId>가 추가되고 navigation에는 관련 요청·응답 헤더가 추가된다.
- deploymentId는 html의 data-dpl-id와 use cache cache key에도 반영된다.
- Next.js는 ?dpl=을 라우팅에 사용하지 않으므로 배포별 라우팅은 호스트 또는 CDN이 담당해야 한다.
