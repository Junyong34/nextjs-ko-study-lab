# Self-Hosting

- 공식 문서: [Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `next start` 기반 자체 호스팅에서 proxy, 이미지, 환경 변수, 캐시를 구성한다.
- 다중 인스턴스의 build ID, 암호화 키, deployment ID, 공유 캐시 요구 사항을 설명한다.
- 스트리밍, CDN, cache tag 조정, 정상 종료를 운영 체크리스트로 만든다.

## 핵심 개념 및 설명

Next.js를 자체 호스팅하면 인프라에 맞춰 각 기능의 실행 위치와 저장소를 직접 선택할 수 있다. 단일 `next start` 인스턴스는 기본 기능을 처리하지만, 여러 인스턴스와 CDN을 사용하면 일관성과 스트리밍을 위한 구성이 추가로 필요하다.

> **영상**: 공식 문서에서 [45분 분량의 Next.js 자체 호스팅 영상](https://www.youtube.com/watch?v=sIVL4JMqRfc)을 함께 제공한다.

### Reverse proxy

Next.js 서버를 인터넷에 직접 노출하기보다 nginx 같은 reverse proxy를 앞에 두는 것을 권장한다. malformed request, 느린 연결 공격, payload 크기 제한, rate limiting 같은 방어를 proxy가 담당하면 Next.js 서버는 렌더링에 자원을 집중할 수 있다.

### Image Optimization

`next start`에서는 `next/image`가 별도 설정 없이 동작한다. 이미지 최적화를 별도 서비스에 맡기려면 custom image loader를 구성한다. [static export](./static-exports.md)에서도 custom loader를 사용할 수 있다. 이미지는 빌드 시점이 아니라 런타임에 최적화된다.

> **알아두면 좋은 점**:
>
> - glibc 기반 Linux에서는 과도한 메모리 사용을 막기 위해 `sharp` 메모리 allocator 설정이 필요할 수 있다.
> - 최적화 이미지 캐시 TTL을 조정할 수 있다.
> - 별도 최적화 시스템을 사용한다면 `next/image`의 다른 이점은 유지하면서 Image Optimization만 끌 수 있다.

### Proxy

Proxy는 `next start`에서 별도 설정 없이 동작하지만 들어오는 요청에 접근해야 하므로 static export에서는 지원하지 않는다. 모든 Node.js API가 필요한 로직은 Server Component 레이아웃으로 옮겨 headers를 확인하고 redirect하는 방식을 검토한다. `next.config.js`의 header·cookie·query 조건부 redirect와 rewrite도 사용할 수 있다. 이 방식으로 해결되지 않으면 custom server를 고려한다.

### 환경 변수

기본적으로 환경 변수는 서버에서만 사용할 수 있다. 브라우저에 공개하려면 `NEXT_PUBLIC_` 접두사를 붙여야 하며, 이 값은 `next build` 중 JavaScript 번들에 인라인된다.

서버의 다이나믹 렌더링 중에는 런타임 환경 변수를 안전하게 읽을 수 있다.

```tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  const value = process.env.MY_VALUE
  return <p>{value}</p>
}
```

이 패턴을 사용하면 하나의 Docker image를 여러 환경으로 승격하면서 런타임 값만 다르게 줄 수 있다.

> **알아두면 좋은 점**: 서버 시작 시 실행할 코드는 [instrumentation의 `register` 함수](./instrumentation.md)에 둘 수 있다.

### 캐싱과 ISR

Next.js는 응답, 생성된 정적 페이지, 빌드 출력, 이미지·폰트·스크립트 같은 자산을 캐시한다. 페이지 캐싱과 ISR은 같은 Next.js 서버 캐시를 사용하며 기본 저장 위치는 각 인스턴스의 로컬 파일 시스템이다.

영속 로컬 디스크가 있는 단일 `next start`에서는 자동으로 동작한다. 다중 인스턴스, ephemeral compute, CDN 또는 reverse proxy를 사용하면 캐시 위치와 인스턴스 간 조정을 설계해야 한다.

#### 자동 캐싱

- 파일명에 SHA hash가 있는 불변 자산에는 `public, max-age=31536000, immutable`이 설정되며 재정의할 수 없다.
- ISR은 `s-maxage`와 `stale-while-revalidate`를 사용한다. CDN이 이 directive와 cache key 변형을 올바르게 처리해야 한다.
- 다이나믹 렌더링 페이지와 Draft Mode는 사용자별 데이터가 공유 캐시에 들어가지 않도록 `private, no-cache, no-store, max-age=0, must-revalidate`를 사용한다.

#### 정적 자산

JavaScript와 CSS를 별도 도메인이나 CDN에서 제공하려면 `assetPrefix`를 설정한다. 도메인을 분리하면 DNS와 TLS 연결 시간이 추가된다는 trade-off가 있다.

#### 캐시 구성

기본 생성 캐시는 메모리(기본 50MB)와 디스크에 저장된다. ephemeral compute에서는 짧게 유지되고 Kubernetes의 각 pod는 서로 다른 캐시를 갖는다. custom `cacheHandler`와 외부 저장소를 사용하고 기본 메모리 캐시를 끄면 인스턴스 간 결과를 공유할 수 있다.

```js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0,
}
```

프로덕션 handler는 durable storage, eviction policy, 오류 처리, 분산 tag 조정을 구현해야 한다. [ISR](./incremental-static-regeneration.md) 같은 서버 캐시에는 `cacheHandler`, `'use cache'` 백엔드에는 `cacheHandlers`를 사용한다.

> **알아두면 좋은 점**: `revalidatePath`는 내부적으로 해당 페이지의 특별한 기본 tag에 `revalidateTag`를 호출하는 편의 계층이다.

### 빌드 캐시와 build ID

Next.js는 `next build` 중 배포 버전을 식별하는 ID를 만든다. 여러 컨테이너는 같은 빌드 산출물과 build ID로 시작해야 한다. 환경 단계마다 다시 빌드한다면 `generateBuildId`로 일관된 값을 제공한다.

```js
module.exports = {
  generateBuildId: async () => process.env.GIT_HASH,
}
```

### 다중 서버 배포

#### Server Functions 암호화 키

Next.js는 Server Function closure 값을 클라이언트로 보내기 전에 암호화한다. 기본 키는 빌드마다 새로 생성된다. 모든 인스턴스가 같은 키를 사용하지 않으면 한 인스턴스가 만든 값을 다른 인스턴스가 복호화하지 못해 `Failed to find Server Action` 오류가 날 수 있다.

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`에 16, 24, 32 byte의 유효한 AES key를 base64로 인코딩해 설정한다. Next.js의 기본 생성 크기는 32 byte다. 키는 빌드 출력에 포함되어 런타임에 사용된다.

#### Deployment ID와 공유 캐시

rolling deployment의 version skew를 감지하려면 `deploymentId`를 설정한다. `'use cache: remote'`와 외부 저장소 기반 custom cache handler를 사용하면 여러 인스턴스가 캐시를 공유할 수 있다.

### Version skew

여러 버전이 동시에 서비스되면 오래된 클라이언트가 사라진 JavaScript/CSS를 요청하거나, 이전 Server Function ID를 호출하거나, 새 서버와 호환되지 않는 prefetch 데이터를 사용할 수 있다.

```js
module.exports = {
  deploymentId: process.env.DEPLOYMENT_VERSION,
}
```

deployment ID를 설정하면 정적 자산에 `?dpl=<deploymentId>`, 클라이언트 내비게이션 요청에 `x-deployment-id`가 붙는다. 서버가 불일치를 발견하면 클라이언트 전환 대신 hard navigation으로 전체 페이지를 다시 불러와 일관된 버전의 자산을 받게 한다.

> **알아두면 좋은 점**: 전체 reload가 일어나면 URL state와 local storage는 남지만 `useState` 같은 컴포넌트 상태는 사라질 수 있다.

### 스트리밍과 Suspense

App Router는 자체 호스팅에서도 스트리밍 응답을 지원한다. nginx 같은 proxy가 버퍼링하지 않도록 구성해야 한다.

```js
module.exports = {
  async headers() {
    return [{
      source: '/:path*{/}?',
      headers: [{ key: 'X-Accel-Buffering', value: 'no' }],
    }]
  },
}
```

load balancer는 chunked transfer encoding 또는 HTTP/2 streaming을 지원해야 하고, 중간의 모든 reverse proxy도 chunk를 버퍼링하지 않아야 한다. PPR에서 스트리밍이 막히면 static shell과 다이나믹 콘텐츠가 전체 렌더 완료 뒤 함께 전달되어 TTFB 이점을 잃는다.

### 다중 인스턴스 캐시 조정

한 인스턴스의 `revalidateTag()`는 기본적으로 그 인스턴스 캐시만 무효화한다. 다른 인스턴스는 무효화를 알기 전까지 오래된 데이터를 보낼 수 있다. custom cache handler에 `refreshTags()`를 구현해 요청 전마다 Redis 같은 공유 저장소의 tag 상태를 동기화한다.

### Cache Components와 CDN

Cache Components는 CDN 전용 기능이 아니며 `next start`와 Docker에서도 동작한다. CDN 앞단에서는 다이나믹 API를 읽은 페이지가 `Cache-Control: private`, 완전히 prerender된 페이지가 `Cache-Control: public`을 사용한다. CDN은 cache key 변형까지 올바르게 처리해야 한다.

### `after()`와 정상 종료

`after()`는 `next start`에서 완전히 지원된다. 서버를 중지할 때 `SIGINT` 또는 `SIGTERM`을 보내고 기다리면 진행 중인 요청과 대기 중인 `after()` callback을 마친다. 플랫폼에는 백그라운드 작업이 완료되도록 조정 가능한 drain 시간(권장 10~30초)을 둔다.

## 예제 및 데모 설계

- Phase 2에서 reverse proxy 뒤의 단일 인스턴스와 두 인스턴스 구성을 비교한다.
- 서로 다른 암호화 키·deployment ID·로컬 캐시로 오류와 stale 데이터를 재현한다.
- proxy 버퍼링을 켜고 끄며 Suspense와 PPR 응답의 TTFB를 측정한다.
- `SIGTERM` 후 진행 중 요청과 `after()`가 drain 시간 안에 완료되는지 로그로 확인한다.

## 연습 문제

1. 여러 인스턴스가 반드시 공유해야 Server Function 복호화 오류를 막을 수 있는 것은?

   - A. `assetPrefix`
   - B. `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
   - C. `NEXT_PUBLIC_` 환경 변수

   <details><summary>정답 보기</summary>

   정답: B. 모든 인스턴스가 같은 빌드 암호화 키를 사용해야 한다.

   </details>

2. 한 인스턴스의 cache tag 무효화를 다른 인스턴스에 알리는 custom handler 메서드는?

   - A. `refreshTags()`
   - B. `generateBuildId()`
   - C. `headers()`

   <details><summary>정답 보기</summary>

   정답: A. 요청 전에 공유 저장소의 tag 상태를 동기화한다.

   </details>

3. 스트리밍을 위해 proxy에서 피해야 하는 동작은?

   - A. 응답 전체 버퍼링
   - B. HTTP/2 streaming
   - C. chunked transfer encoding

   <details><summary>정답 보기</summary>

   정답: A. 전체를 버퍼링하면 점진적 전송과 PPR의 TTFB 이점을 잃는다.

   </details>

## 챕터 요약

- 자체 호스팅에서는 reverse proxy가 보안과 연결 제어를 맡도록 권장한다.
- 단일 인스턴스의 로컬 캐시는 자동으로 동작하지만 다중 인스턴스에는 공유 저장소와 tag 조정이 필요하다.
- 같은 build ID, Server Function 암호화 키, deployment ID로 배포 버전을 일관되게 유지한다.
- 모든 중간 계층이 응답을 버퍼링하지 않아야 스트리밍과 PPR 성능을 얻는다.
- `SIGTERM`/`SIGINT`와 drain 시간으로 요청과 `after()` callback을 안전하게 마친다.
