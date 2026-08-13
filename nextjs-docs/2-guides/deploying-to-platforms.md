# Deploying to Platforms

- 공식 문서: [Deploying to Platforms](https://nextjs.org/docs/app/guides/deploying-to-platforms)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js 플랫폼의 최소 실행 조건과 기능별 인프라 요구 사항을 설명한다.
- 기능 충실도(functional fidelity)와 성능 충실도(performance fidelity)를 구분한다.
- Deployment Adapter API와 캐시 인터페이스의 역할을 이해하고 배포 대상을 평가한다.

## 핵심 개념 및 설명

[Next.js의 렌더링 철학](./rendering-philosophy.md)은 정적 콘텐츠와 다이나믹 콘텐츠를 라우트 단위의 양자택일이 아니라 컴포넌트 수준의 스펙트럼으로 다룬다. 따라서 사용하는 기능에 따라 호스팅 플랫폼에 필요한 능력이 달라진다.

### 최소 요구 사항

모든 Next.js 기능을 올바르게 실행하는 최소 조건은 Node.js 서버 하나다. 단일 `next start` 프로세스는 Server Components, ISR, PPR, Cache Components, Server Actions, Proxy, `after()`를 처리한다.

스트리밍이 없으면 응답이 완성될 때까지 버퍼링되지만 기능 자체는 동작한다. 다만 Server Components와 PPR의 점진적 전송 이점은 잃는다. CDN, edge compute, 공유 캐시는 주로 성능과 다중 인스턴스의 일관성을 개선한다. [Image Optimization](../3-api-reference/3.2-components/image.md)에는 `sharp` 패키지가 추가로 필요하다.

### 기능 충실도와 성능 충실도

- **기능 충실도**: 모든 Next.js 기능이 올바르게 동작하는지 나타낸다. [adapter 테스트 스위트](../3-api-reference/3.7-adapters/testing-adapters.md) 통과 여부로 판정할 수 있는 이진 조건이다.
- **성능 충실도**: 기능이 최적의 성능 특성을 내는 정도다. PPR의 static shell을 CDN 지연 시간으로 제공하거나 ISR 무효화를 인스턴스 전체에 빠르게 전파하는 수준처럼 플랫폼 구조에 따라 달라지는 스펙트럼이다.

기능 충실도를 만족하면 완전한 배포 대상이다. 성능 충실도는 플랫폼이 추가 인프라로 차별화하는 영역이다.

### 기능 지원 매트릭스

`Edge Stitching`은 정확성 요구 사항이 아니라 성능 최적화다. 아래 기능은 단일 origin 서버에서도 모두 올바르게 동작한다.

| 기능 | 스트리밍 | 공유 캐시 | Edge Stitching | 비고 |
| --- | --- | --- | --- | --- |
| Server Components | 필요 | 불필요 | 불필요 | 기본 스트리밍 지원 |
| ISR(시간 기반) | 불필요 | 권장 | 불필요 | 공유하지 않아도 인스턴스별로 동작 |
| ISR(요청 기반) | 불필요 | 권장 | 불필요 | 다중 인스턴스에서는 [태그 전파](./how-revalidation-works.md)에 공유 캐시 활용 |
| Partial Prerendering | 필요 | 권장 | 선택 | [PPR Platform Guide](./ppr-platform-guide.md) 참고 |
| Cache Components(`use cache`) | 필요 | 권장 | 불필요 | 공유 캐시가 인스턴스 간 일관성을 개선 |
| Proxy / Middleware | 불필요 | 불필요 | 불필요 | edge 또는 origin에서 실행 |
| Server Actions | 필요 | 불필요 | 불필요 | 스트리밍 응답을 포함한 POST 요청 |
| `after()` | 불필요 | 불필요 | 불필요 | 정상 종료 지원 필요 |

스트리밍을 지원하려면 chunked transfer encoding 또는 HTTP/2 streaming을 통과시키고 응답 전체를 버퍼링하지 않아야 한다. 다중 인스턴스에서 공유 캐시를 쓰지 않아도 각 인스턴스의 기능은 동작하지만, revalidation 이벤트가 다른 인스턴스로 전파되지 않는다. ISR과 서버 응답 캐시는 [`cacheHandler`](../3-api-reference/3.5-config/3.5.1-next-config-js/incrementalCacheHandlerPath.md), `'use cache'` 항목은 [`cacheHandlers`](../3-api-reference/3.5-config/3.5.1-next-config-js/cacheHandlers.md)로 백엔드를 구성한다.

### CDN 인프라 호환성

아래 표는 각 CDN이 제공하는 구축 재료를 나타내며, 완성된 Next.js 통합을 의미하지 않는다.

| CDN | Edge compute | Key-Value / Tags | Blob storage | PPR resume |
| --- | --- | --- | --- | --- |
| Cloudflare | Workers | KV | R2 | Worker에서 가능 |
| Akamai | EdgeWorkers | EdgeKV | Object Storage | Worker에서 가능 |
| Amazon CloudFront | Lambda@Edge | KeyValueStore | S3 | Lambda에서 가능 |
| Fastly | Compute | KV Store | Object Storage | WASM에서 가능 |
| Azure | Functions | Managed Redis | Blob Storage | 서버에서 가능 |
| Google Cloud | Cloud Run | 다양한 KV | Cloud Storage | 서버에서 가능 |

대부분의 community adapter는 아직 CDN별 primitive를 깊게 사용하기보다 Next.js를 Node.js 서버나 Docker 컨테이너로 배포한다.

### Adapters

[Deployment Adapter API](../3-api-reference/3.5-config/3.5.1-next-config-js/adapterPath.md)를 사용하면 플랫폼이 표준 Next.js 빌드 결과를 자체 인프라에 맞게 변환할 수 있다. adapter는 빌드 시점에 실행된다. 공개 API이므로 특별한 접근 권한 없이 구현할 수 있다.

플랫폼 통합 범위는 adapter API와 캐시 인터페이스로 나뉜다. 단일 Node.js 서버를 운영하는 구체적인 항목은 [Self-Hosting](./self-hosting.md)에서 이어서 다룬다.

- adapter: 빌드 결과와 배포 산출물을 변환한다.
- `cacheHandler`: ISR, Route Handler, 패치된 `fetch`, `unstable_cache`, Image Optimization 같은 서버 캐시 경로를 처리한다.
- `cacheHandlers`: `'use cache'` 지시어의 백엔드를 구성한다.

#### 검증된 adapter

검증된 adapter는 다음 두 조건을 만족한다.

1. 소스가 공개되어 Next.js 팀과 커뮤니티가 구현을 검사하고 기여할 수 있다.
2. 전체 [Next.js 호환성 테스트 스위트](../3-api-reference/3.7-adapters/testing-adapters.md)를 실행할 수 있어 기능별 상태와 차이를 확인할 수 있다.

검증된 adapter는 [Next.js GitHub 조직](https://github.com/nextjs)에서 호스팅되고 공식 지원 대상에 등재되며 각 플랫폼 팀이 유지보수한다. Vercel도 다른 adapter와 같은 공개 API를 사용한다. Next.js 팀은 주요 릴리스 전 조율된 테스트, RFC와 release candidate 단계의 조기 접근, adapter 계약 변경에 대한 직접 지원을 제공한다. 플랫폼 제작자는 [Next.js Ecosystem Working Group](https://nextjs.org/ecosystem-working-group)에 참여할 수 있다.

> **알아두면 좋은 점**: 비공개 adapter도 같은 공개 API와 테스트 스위트로 만들 수 있다. 그러나 Next.js 팀이 구현을 검사할 수 없으므로 검증된 adapter 목록에는 포함되지 않는다.

### 인프라 요구 사항의 배경

컴포넌트 수준의 정적·다이나믹 경계는 애플리케이션에 유연성을 주는 대신 플랫폼에 더 넓은 인프라 능력을 요구한다. 스트리밍, 캐시 조정, PPR resume 같은 요구는 이 렌더링 모델이 제공하는 세밀한 동작에서 비롯된다.

## 예제 및 데모 설계

- Phase 2에서 단일 `next start`, 다중 인스턴스, CDN 앞단 구성의 기능·성능 차이를 표로 시각화한다.
- 스트리밍 프록시와 버퍼링 프록시에서 동일한 Server Component 응답의 첫 바이트와 완료 시간을 비교한다.
- 공유 캐시를 끈 두 인스턴스에서 revalidation 불일치를 재현하고 공유 캐시 적용 후 변화를 확인한다.
- adapter 테스트 결과를 기능 충실도, PPR shell 지연 시간을 성능 충실도 지표로 분리한다.

## 연습 문제

1. 모든 Next.js 기능을 올바르게 실행하기 위한 최소 조건은?

   - A. CDN과 edge KV
   - B. Node.js 서버
   - C. PPR Edge Stitching

   <details><summary>정답 보기</summary>

   정답: B. 단일 `next start` 프로세스만으로 모든 기능을 올바르게 실행할 수 있다.

   </details>

2. `Edge Stitching`에 관한 설명으로 맞는 것은?

   - A. 모든 기능의 정확성을 위한 필수 조건이다.
   - B. PPR의 성능 충실도를 높이는 선택적 최적화다.
   - C. Image Optimization에서만 필요하다.

   <details><summary>정답 보기</summary>

   정답: B. 단일 origin에서도 PPR은 동작하며 Edge Stitching은 static shell 지연 시간을 줄이는 최적화다.

   </details>

3. `'use cache'` 항목의 외부 캐시 백엔드를 구성하는 인터페이스는?

   - A. `cacheHandler`
   - B. `cacheHandlers`
   - C. `adapterPath`만 사용한다.

   <details><summary>정답 보기</summary>

   정답: B. 복수형 `cacheHandlers`가 `'use cache'` 지시어의 백엔드를 담당한다.

   </details>

## 챕터 요약

- Node.js 서버 하나가 Next.js 전체 기능의 최소 실행 조건이다.
- 기능 충실도는 정확성, 성능 충실도는 최적 성능 수준을 뜻한다.
- 스트리밍과 공유 캐시는 기능별로 요구 수준이 다르다.
- CDN primitive는 구축 재료이며 완성된 통합을 보장하지 않는다.
- adapter API와 두 캐시 인터페이스가 플랫폼 통합의 핵심 표면이다.
