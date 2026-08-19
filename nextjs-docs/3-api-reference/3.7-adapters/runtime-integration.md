# Runtime Integration

- 공식 문서: [Runtime Integration](https://nextjs.org/docs/app/api-reference/adapters/runtime-integration)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 어댑터(빌드 타임)와 캐시 인터페이스(런타임)가 각각 어떤 책임을 맡는지 구분한다.
- `ctx.waitUntil`과 `requestMeta.onCacheEntryV2`로 요청 컨텍스트를 다루는 방법을 이해한다.
- PPR 체인 헤더가 어댑터 기반 배포에서 어떤 역할을 하는지 파악한다.

## 핵심 개념 및 설명

Deployment Adapter API는 **빌드 타임** 인터페이스다. 무엇이 빌드되었는지, 요청을 어떻게 라우팅할지를 플랫폼에 알려준다. 반면 **런타임** 동작(요청 처리, 스트리밍, 캐싱)은 Next.js 서버 자체와 캐시 인터페이스인 [`cacheHandler`](../3.5-config/3.5.1-next-config-js/incrementalCacheHandlerPath.md), [`cacheHandlers`](../3.5-config/3.5.1-next-config-js/cacheHandlers.md)가 처리한다.

어댑터와 캐시 인터페이스는 함께 전체 플랫폼 통합 표면을 구성한다.

- **어댑터(빌드 타임)**: 빌드 출력을 처리하고, 라우팅을 구성하며, 플랫폼별 인프라를 설정한다.
- **캐시 인터페이스(런타임)**: `cacheHandler`는 인스턴스 간 ISR/서버 캐시 저장과 revalidation을 관리하고, `cacheHandlers`는 `'use cache'` 지시어의 백엔드와 태그 조정을 구성한다.

### 핸들러 Context

entrypoint를 호출할 때 어댑터는 Next.js 핸들러에 `ctx` 객체를 전달한다. 주요 필드는 다음과 같다.

- **`ctx.waitUntil`**: Promise를 인자로 받는 함수다. 응답이 전송된 뒤에도 서버리스 함수를 계속 살려두는 데 사용하며, 캐시 revalidation 같은 백그라운드 작업을 완료할 수 있게 해준다.
- **`requestMeta.onCacheEntryV2`** (`addRequestMeta`로 설정): 캐시 항목이 생성되거나 조회될 때 실행되는 콜백이다. PPR뿐 아니라 모든 캐시 작업을 관찰하고, 캐시 갱신 내용을 플랫폼의 저장소 백엔드로 전파하는 데 사용한다. 이 콜백은 요청을 처리한 인스턴스에서 실행된다. 여러 인스턴스로 배포하는 경우 어댑터가 갱신 내용을 공유 저장소로 전파해야 한다. 조정 패턴은 [How Revalidation Works](../../2-guides/how-revalidation-works.md)를 참고한다.

### PPR 체인 헤더

[prerenders 출력 타입](./output-types.md#prerenders-outputsprerenders)에서 `pprChain.headers`는 [재개 프로토콜](./implementing-ppr-in-an-adapter.md)에 필요한 헤더를 담고 있다. 구체적으로는 `{ 'next-resume': '1' }`을 포함한다.

어댑터가 캐시된 정적 shell을 가진 PPR 활성화 route를 감지했을 때는 다음 절차를 따른다.

1. Next.js 핸들러로 보내는 내부 요청에 `pprChain.headers`를 설정한다.
2. `postponedState`를 요청 본문으로 담아 **POST** 요청으로 전송한다.
3. 핸들러는 지연된 Suspense boundary만 렌더링하고 결과를 스트리밍한다.

> **알아두면 좋은 점**: 표준 `next start`에서는 서버가 shell과 다이나믹 렌더링을 한 번의 과정으로 자동 처리한다. 재개 프로토콜은 shell을 따로 서빙하려는 어댑터 기반 배포나 CDN-to-origin 아키텍처에 유용하다. 전체 구현 맥락은 [PPR Platform Guide](../../2-guides/ppr-platform-guide.md)를 참고한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 구현 예정). `ctx.waitUntil`, `requestMeta.onCacheEntryV2`는 실제 배포 플랫폼과 통합된 어댑터가 있어야 동작을 확인할 수 있으므로, Phase 2에서 커스텀 어댑터 데모를 만들 때 함께 다룬다.
- 구현 예정 시나리오: `onCacheEntryV2` 콜백을 등록해 캐시 항목이 생성·조회될 때마다 로그를 남기고, PPR 활성화 route에 대해 `pprChain.headers`가 붙은 POST 요청이 어떻게 처리되는지 확인한다.

## 연습 문제

1. Deployment Adapter API와 캐시 인터페이스의 책임을 올바르게 짝지은 것은?
   - A. 어댑터는 런타임 요청 처리, 캐시 인터페이스는 빌드 타임 라우팅 구성
   - B. 어댑터는 빌드 타임 출력 처리·라우팅 구성, 캐시 인터페이스는 런타임 캐시 저장·revalidation
   - C. 어댑터와 캐시 인터페이스는 동일한 시점에 동일한 책임을 진다

<details><summary>정답 보기</summary>

정답: B. Deployment Adapter API는 빌드 타임 인터페이스이고, `cacheHandler`/`cacheHandlers` 같은 캐시 인터페이스가 런타임 캐싱과 revalidation을 담당한다.
</details>

2. PPR 활성화 route의 재개 프로토콜을 처리할 때 어댑터가 해야 할 일이 아닌 것은?
   - A. 내부 요청에 `pprChain.headers`를 설정한다.
   - B. `postponedState`를 본문으로 담아 POST 요청을 보낸다.
   - C. shell과 다이나믹 렌더링을 어댑터 쪽에서 직접 병합해 완성된 HTML로 응답한다.

<details><summary>정답 보기</summary>

정답: C. shell과 다이나믹 렌더링을 병합하는 것은 Next.js 핸들러의 역할이다. 어댑터는 헤더 설정과 POST 요청 전달만 담당하고, 핸들러가 지연된 Suspense boundary를 렌더링해 스트리밍한다.
</details>

## 챕터 요약

- Deployment Adapter API는 빌드 타임 인터페이스이며, 런타임 동작은 Next.js 서버와 캐시 인터페이스가 담당한다.
- `cacheHandler`는 ISR/서버 캐시 저장·revalidation을, `cacheHandlers`는 `'use cache'` 백엔드와 태그 조정을 담당한다.
- `ctx.waitUntil`로 응답 전송 후에도 백그라운드 작업(캐시 revalidation 등)을 이어갈 수 있다.
- `requestMeta.onCacheEntryV2`는 모든 캐시 작업을 관찰하는 콜백이며, 다중 인스턴스 배포에서는 어댑터가 갱신을 공유 저장소로 전파해야 한다.
- PPR 체인 헤더(`pprChain.headers`)와 POST 요청을 이용한 재개 프로토콜은 shell을 별도로 서빙하는 어댑터 기반 배포에 유용하다.
