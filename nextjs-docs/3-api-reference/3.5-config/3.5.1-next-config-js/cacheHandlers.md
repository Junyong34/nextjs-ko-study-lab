# cacheHandlers

- 공식 문서: [cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- cacheHandlers로 use cache와 use cache: remote의 cache 저장소 구현을 사용자 지정하는 방법을 익힌다.
- default, remote, 그리고 이름을 따로 붙인 handler의 역할과 use cache: private가 cache handler를 사용하지 않는 이유를 이해한다.
- get(), set(), refreshTags(), getExpiration(), updateTags() API와 CacheEntry 구조를 구현 관점에서 파악한다.
- ReadableStream 처리, soft tags, 여러 Next.js 인스턴스 사이의 tag 동기화, 오류 처리 원칙을 학습한다.

## 핵심 개념 및 설명

cacheHandlers 설정은 [use cache](../../3.4-directives/use-cache.md)와 [use cache: remote](../../3.4-directives/use-cache-remote.md)에 사용할 사용자 지정 cache 저장소 구현을 정의한다. handler를 지정하면 cache된 컴포넌트와 함수를 외부 서비스에 저장하고, cache 동작도 원하는 방식으로 사용자 지정한다. [use cache: private](../../3.4-directives/use-cache-private.md)는 설정 대상이 아니다.

### 사용자 지정 cache handler를 사용할 시점 (When to use custom cache handlers)

**대부분의 애플리케이션은 사용자 지정 cache handler가 필요하지 않다.** 일반적인 사용 사례에서는 기본 메모리 cache가 잘 동작한다.

사용자 지정 cache handler는 여러 인스턴스 사이에서 cache를 공유하거나 cache 저장 위치를 바꿔야 하는 고급 시나리오에 사용한다. 예를 들어 외부 저장소인 key-value store에 연결하는 custom remote handler를 설정해 두면, 같은 애플리케이션에서 use cache는 메모리 cache로 처리하고 use cache: remote는 외부 저장소로 보내는 식으로 서로 다른 cache 전략을 나눠 쓴다.

**여러 인스턴스 사이에서 cache 공유**

기본 메모리 cache는 각 Next.js 프로세스에 격리된다. 여러 서버나 컨테이너를 실행하면 인스턴스마다 cache가 따로 생기고 서로 공유되지 않으며, 재시작하면 그대로 사라진다.

사용자 지정 handler를 사용하면 모든 Next.js 인스턴스가 함께 접근하는 공유 저장소 시스템에 연결된다. Redis, Memcached, DynamoDB가 여기에 해당한다.

**저장소 타입 변경**

기본 메모리 방식과 다른 방법으로 cache를 저장해야 할 때도 있다. 그럴 때는 디스크, 데이터베이스, 외부 cache 서비스에 저장하도록 custom handler를 구현한다. 재시작 후에도 유지하거나 메모리 사용량을 줄이거나 기존 인프라와 통합하려는 경우에 활용한다.

### 사용법 (Usage)

사용자 지정 cache handler는 두 단계로 설정한다.

1. 별도 파일에 cache handler를 정의한다. 구현 세부 사항은 아래 [예제](#examples)에서 확인한다.
2. Next config 파일에서 해당 파일 경로를 참조한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheHandlers: {
    default: require.resolve('./cache-handlers/default-handler.js'),
    remote: require.resolve('./cache-handlers/remote-handler.js'),
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  cacheHandlers: {
    default: require.resolve('./cache-handlers/default-handler.js'),
    remote: require.resolve('./cache-handlers/remote-handler.js'),
  },
}
```

#### Handler 타입 (Handler types)

- **default**: use cache 지시어가 사용한다.
- **remote**: use cache: remote 지시어가 사용한다.

cacheHandlers를 설정하지 않으면 Next.js는 default와 remote 모두에 메모리 LRU(Least Recently Used) cache를 사용한다. 실제 동작은 [기본 구현](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/default.ts)에서 확인한다.

여기에 이름을 따로 지정한 handler를 더 정의해도 된다. 예를 들어 sessions와 analytics를 정의한 뒤 use cache: <name>으로 참조한다.

use cache: private는 cache handler를 사용하지 않으며 사용자 지정할 수 없다.

### API Reference

cache handler는 [CacheHandler](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/types.ts) 인터페이스의 다음 메서드를 구현해야 한다.

#### get()

지정한 cache key의 cache entry를 가져온다.

```ts
get(cacheKey: string, softTags: string[]): Promise<CacheEntry | undefined>
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| cacheKey | string | cache entry의 고유한 key다. |
| softTags | string[] | route 경로에서 파생된 암시적 tag다. 사용 방법은 [Soft Tags](#soft-tags)를 참고한다. |

찾은 경우 CacheEntry 객체를 반환하고, 찾지 못했거나 만료된 경우 undefined를 반환한다.

get 메서드는 저장소에서 cache entry를 가져온 뒤 revalidate 시간을 기준으로 만료 여부를 확인해야 하는데, 누락되었거나 만료된 entry라면 undefined를 반환한다.

```js
const cacheHandler = {
  async get(cacheKey, softTags) {
    const entry = cache.get(cacheKey)
    if (!entry) return undefined

    // 만료되었는지 확인한다
    const now = Date.now()
    if (now > entry.timestamp + entry.revalidate * 1000) {
      return undefined
    }

    return entry
  },
}
```

#### set()

지정한 cache key에 cache entry를 저장한다.

```ts
set(cacheKey: string, pendingEntry: Promise<CacheEntry>): Promise<void>
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| cacheKey | string | entry를 저장할 고유한 key다. |
| pendingEntry | Promise<CacheEntry> | cache entry로 resolve되는 promise다. |

handler는 entry를 처리하기 전에 pendingEntry를 await해야 한다. 이 메서드가 호출되는 시점에도 entry는 아직 생성 중일 수 있고, 값의 stream이 여전히 기록되는 중일 수 있기 때문이다.

반환값은 Promise<void>다.

set 메서드에서 실제 저장은 pendingEntry promise가 resolve된 뒤에 일어난다. resolve된 값을 받아 cache 시스템에 entry로 저장한다.

```js
const cacheHandler = {
  async set(cacheKey, pendingEntry) {
    // entry가 준비될 때까지 기다린다
    const entry = await pendingEntry

    // cache 시스템에 저장한다
    cache.set(cacheKey, entry)
  },
}
```

#### refreshTags()

새 요청을 시작하기 전에 주기적으로 호출해 외부 tag 서비스와 동기화한다.

```ts
refreshTags(): Promise<void>
```

여러 인스턴스나 서비스 사이에서 cache 무효화를 조정할 때 유용하다. 메모리 cache라면 아무 작업도 하지 않는 빈 메서드로 두어도 되고, 반환값은 Promise<void>다.

분산 cache에서는 요청을 처리하기 전에 외부 서비스나 데이터베이스의 tag 상태를 동기화하는 용도로 쓴다.

```js
const cacheHandler = {
  async refreshTags() {
    // 메모리 cache에서는 처리할 작업이 없다
    // 분산 cache에서는 외부 서비스의 tag 상태를 동기화한다
  },
}
```

#### getExpiration()

tag 집합의 최대 revalidation timestamp를 가져온다.

```ts
getExpiration(tags: string[]): Promise<number>
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| tags | string[] | 만료를 확인할 tag 배열이다. |

반환값은 세 가지다.

- 어느 tag도 revalidate된 적이 없으면 0
- 가장 최근 revalidation을 나타내는 밀리초 단위 timestamp
- get 메서드에서 soft tag를 확인해야 한다는 뜻의 Infinity

tag revalidation timestamp를 추적하지 않는 handler라면 그냥 0을 반환한다. 추적한다면 전달된 tag 전체를 훑어 가장 최근 revalidation timestamp를 찾고, soft tag 처리를 get 메서드에 맡길 생각이면 Infinity를 반환한다.

```js
const cacheHandler = {
  async getExpiration(tags) {
    // tag revalidation을 추적하지 않으면 0을 반환한다
    return 0

    // 가장 최근 revalidation timestamp를 반환하는 경우
    // return Math.max(...tags.map(tag => tagTimestamps.get(tag) || 0));
  },
}
```

#### updateTags()

tag가 revalidate되거나 만료될 때 호출한다.

```ts
updateTags(tags: string[], durations?: { expire?: number }): Promise<void>
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| tags | string[] | 갱신할 tag 배열이다. |
| durations | { expire?: number } | 초 단위의 선택적 만료 기간이다. |

handler는 무효화된 tag를 표시하도록 내부 상태를 갱신해야 하며, 반환값은 Promise<void>다.

tag가 revalidate되면 그 tag가 하나라도 붙어 있는 cache entry를 모두 무효화해야 한다. cache를 순회하면서 전달된 목록과 tag가 겹치는 entry를 삭제하면 된다.

```js
const cacheHandler = {
  async updateTags(tags, durations) {
    // 일치하는 tag를 가진 모든 cache entry를 무효화한다
    for (const [key, entry] of cache.entries()) {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  },
}
```

### CacheEntry 타입 (CacheEntry Type)

CacheEntry 객체는 여섯 개의 속성으로 이뤄진다.

```ts
interface CacheEntry {
  value: ReadableStream<Uint8Array>
  tags: string[]
  stale: number
  timestamp: number
  expire: number
  revalidate: number
}
```

| 속성 | 타입 | 설명 |
|---|---|---|
| value | ReadableStream<Uint8Array> | stream 형태의 cache 데이터다. |
| tags | string[] | soft tags를 제외한 cache tag다. |
| stale | number | 클라이언트에서 stale 상태로 취급하는 초 단위 기간이다. |
| timestamp | number | entry가 생성된 시점이다. 밀리초 단위 timestamp로 기록한다. |
| expire | number | entry를 사용할 수 있는 최대 기간이다. 초 단위로 지정한다. |
| revalidate | number | entry를 revalidate하기까지의 기간이다. 초 단위로 지정한다. |

> **알아두면 좋은 점**:
>
> - value는 [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)이다. stream 데이터를 읽고 저장해야 한다면 [tee()](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee)를 사용한다.
> - stream에 일부 데이터가 기록된 뒤 오류가 발생하면 partial cache를 유지할지 버릴지 handler가 결정해야 한다.

### 예제 (Examples)

#### 기본 메모리 cache handler (Basic in-memory cache handler)

Map 하나를 저장소로 쓰는 최소 구현이다. 핵심 개념을 보여 주는 예제이고, LRU eviction과 오류 처리, tag 관리는 production 수준의 구현에서 따로 필요하니 [기본 cache handler](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/default.ts)를 참고한다.

```js filename="cache-handlers/memory-handler.js"
const cache = new Map()
const pendingSets = new Map()

module.exports = {
  async get(cacheKey, softTags) {
    // 대기 중인 set 작업이 완료될 때까지 기다린다
    const pendingPromise = pendingSets.get(cacheKey)
    if (pendingPromise) {
      await pendingPromise
    }

    const entry = cache.get(cacheKey)
    if (!entry) {
      return undefined
    }

    // entry가 만료되었는지 확인한다
    const now = Date.now()
    if (now > entry.timestamp + entry.revalidate * 1000) {
      return undefined
    }

    return entry
  },

  async set(cacheKey, pendingEntry) {
    // 이 set 작업을 추적할 promise를 만든다
    let resolvePending
    const pendingPromise = new Promise((resolve) => {
      resolvePending = resolve
    })
    pendingSets.set(cacheKey, pendingPromise)

    try {
      // entry가 준비될 때까지 기다린다
      const entry = await pendingEntry

      // cache에 entry를 저장한다
      cache.set(cacheKey, entry)
    } finally {
      resolvePending()
      pendingSets.delete(cacheKey)
    }
  },

  async refreshTags() {
    // 메모리 cache에서는 아무 작업도 하지 않는다
  },

  async getExpiration(tags) {
    // 어떤 tag도 revalidate되지 않았다는 뜻으로 0을 반환한다
    return 0
  },

  async updateTags(tags, durations) {
    // tag 기반 무효화를 구현한다
    for (const [key, entry] of cache.entries()) {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  },
}
```

#### 외부 저장소 패턴 (External storage pattern)

Redis나 데이터베이스처럼 내구성 있는 저장소를 쓰려면 cache entry를 직렬화해야 한다. Redis에 얹는 가장 간단한 형태는 이렇다.

```js filename="cache-handlers/redis-handler.js"
const { createClient } = require('redis')

const client = createClient({ url: process.env.REDIS_URL })
client.connect()

module.exports = {
  async get(cacheKey, softTags) {
    // Redis에서 가져온다
    const stored = await client.get(cacheKey)
    if (!stored) return undefined

    // entry를 역직렬화한다
    const data = JSON.parse(stored)

    // 저장된 데이터에서 ReadableStream을 재구성한다
    return {
      value: new ReadableStream({
        start(controller) {
          controller.enqueue(Buffer.from(data.value, 'base64'))
          controller.close()
        },
      }),
      tags: data.tags,
      stale: data.stale,
      timestamp: data.timestamp,
      expire: data.expire,
      revalidate: data.revalidate,
    }
  },

  async set(cacheKey, pendingEntry) {
    const entry = await pendingEntry

    // 데이터를 얻기 위해 stream을 읽는다
    const reader = entry.value.getReader()
    const chunks = []

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }

    // chunk를 합쳐 Redis 저장용으로 직렬화한다
    const data = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))

    await client.set(
      cacheKey,
      JSON.stringify({
        value: data.toString('base64'),
        tags: entry.tags,
        stale: entry.stale,
        timestamp: entry.timestamp,
        expire: entry.expire,
        revalidate: entry.revalidate,
      }),
      { EX: entry.expire } // Redis TTL로 자동 만료되게 한다
    )
  },

  async refreshTags() {
    // 기본 Redis 구현에서는 아무 작업도 하지 않는다
    // 필요하면 외부 tag 서비스와 동기화할 수 있다
  },

  async getExpiration(tags) {
    // tag revalidation을 추적하지 않으면 0을 반환한다
    // 추적한다면 Redis에서 tag 만료 timestamp를 조회할 수 있다
    return 0
  },

  async updateTags(tags, durations) {
    // 필요하면 tag 기반 무효화를 구현한다
    // 일치하는 tag를 가진 key를 순회하며 삭제할 수 있다
  },
}
```

### 분산 tag 조정 (Distributed Tag Coordination)

여러 Next.js 인스턴스를 실행할 때는 인스턴스 사이에서 tag 무효화를 조정해야 한다. 기본 메모리 handler는 tag를 로컬에서만 추적하므로 한 인스턴스에서 revalidateTag()를 호출해도 다른 인스턴스에는 영향을 주지 않는다.

인스턴스 사이의 tag 조정은 세 메서드가 나눠 맡는다.

1. **updateTags()**는 revalidateTag()가 호출될 때 실행된다. handler는 무효화 timestamp를 공유 저장소에 기록한다.
2. **refreshTags()**는 각 요청 전에 호출된다. handler는 공유 저장소에서 최근 무효화 이벤트를 읽고 로컬 tag 상태를 갱신한다.
3. **getExpiration()**은 전달된 모든 tag 중 가장 최근 revalidation timestamp를 반환한다. 기본 구현은 Math.max(...timestamps, 0)을 반환한다.

Redis로 이 조정을 구현한 예제다.

```js filename="cache-handlers/distributed-tags.js"
const { createClient } = require('redis')

const client = createClient({ url: process.env.REDIS_URL })
client.connect()

// refreshTags로 동기화하는 로컬 tag timestamp cache
const localTagTimestamps = new Map()

module.exports = {
  // ... get() 및 set() 메서드 ...

  async refreshTags() {
    // Redis에서 tag 무효화 timestamp를 동기화한다
    // 전용 set으로 tag key를 추적하면 keyspace를 스캔하지 않아도 된다
    const tagKeys = await client.sMembers('revalidated-tags')
    if (tagKeys.length > 0) {
      const values = await client.mGet(tagKeys.map((k) => `tag:${k}`))
      for (let i = 0; i < tagKeys.length; i++) {
        localTagTimestamps.set(tagKeys[i], Number(values[i]))
      }
    }
  },

  async getExpiration(tags) {
    const timestamps = tags.map((tag) => localTagTimestamps.get(tag) || 0)
    return Math.max(...timestamps, 0)
  },

  async updateTags(tags, durations) {
    const now = Date.now()
    const pipeline = client.multi()
    for (const tag of tags) {
      pipeline.set(`tag:${tag}`, String(now))
      pipeline.sAdd('revalidated-tags', tag)
      localTagTimestamps.set(tag, now)
    }
    await pipeline.exec()
  },
}
```

tag 구조와 soft tags, 여러 인스턴스 고려 사항은 [How Revalidation Works](../../../2-guides/how-revalidation-works.md)에서 자세히 확인한다.

### Soft Tags

Soft tags는 Next.js가 route 경로를 기준으로 자동으로 만드는 암시적 tag다. 경로의 각 segment에는 layout tag가 붙고, leaf route 자체에도 tag가 붙는다. 예를 들어 /blog/hello route는 /layout, /blog/layout, /blog/hello/layout, /blog/hello에 대한 soft tag를 만드는데, 이렇게 만들어진 tag에는 내부적으로 _N_T_ 접두사가 붙는다.

Soft tags를 사용하면 [revalidatePath()](../../3.3-functions/revalidatePath.md)가 같은 tag 기반 cache 시스템을 통해 동작한다. revalidatePath('/blog/hello')를 호출하면 해당 경로의 soft tag와 연결된 모든 cache entry를 무효화한다.

cache handler API에서는 soft tag가 get() 메서드의 softTags 매개변수로 전달된다. handler는 getExpiration()을 쓰거나 timestamp를 직접 비교해서, cache entry의 timestamp보다 나중에 무효화된 soft tag가 있는지 확인해야 한다. 그런 soft tag가 있으면 해당 entry는 stale 상태로 처리한다.

### stream 처리 (Handling Streams)

CacheEntry.value는 [ReadableStream<Uint8Array>](https://developer.mozilla.org/docs/Web/API/ReadableStream)이다. entry를 외부에 저장하는 cache handler를 구현할 때는 세 가지를 함께 살핀다.

- **tee() 사용**: stream을 저장하면서 반환해야 한다면 tee()를 사용한다. 한 branch는 저장소로 보내고 다른 branch는 호출자에게 반환한다.
- **메모리 영향**: 큰 페이지는 큰 cache entry를 만든다. S3와 유사한 저장소 backend에서는 전체 entry를 메모리에 버퍼링하지 않고 저장소로 직접 stream하는 방식을 고려한다.
- **부분 기록**: rendering 중 stream이 중간에 오류를 일으킬 수 있다. partial entry를 유지할지 버릴지 handler가 결정한다. partial entry는 불완전한 페이지를 만들 수 있으므로 버리는 편이 안전하다.

### 오류 처리 (Error Handling)

cache 작업은 방어적으로 구현해야 한다.

- **set() 실패**: 응답 stream이 이미 흐르는 뒤에 set()이 비동기로 호출되므로 응답은 사용자에게 계속 제공된다. cache entry는 남지 않고, 다음 요청이 새로 rendering한다.
- **get() 실패**: handler는 내부 오류를 잡고 undefined, 즉 cache miss 신호를 반환해야 한다. framework는 get()을 try/catch로 감싸지 않으므로 get()에서 처리하지 않은 예외는 rendering 오류로 전파된다.
- **부분 기록**: cache entry가 일부만 기록된 뒤 읽히면 동작은 정의되지 않는다. partial entry를 제공하지 않도록 atomic write나 write-then-rename 패턴을 사용한다.

### 플랫폼 지원 (Platform Support)

| 배포 옵션 | 지원 여부 |
|---|---|
| [Node.js server](../../../1-getting-started/deploying.md#nodejs-server) | Yes |
| [Docker container](../../../1-getting-started/deploying.md#docker) | Yes |
| [Static export](../../../1-getting-started/deploying.md#static-export) | No |
| [Adapters](../../../1-getting-started/deploying.md#adapters) | Platform-specific |

### 버전 변경 이력 (Version History)

| 버전 | 변경 사항 |
|---|---|
| v16.0.0 | cacheHandlers를 도입했다. |

### 관련 문서 (Related)

- [use cache](../../3.4-directives/use-cache.md)
- [use cache: remote](../../3.4-directives/use-cache-remote.md)
- [use cache: private](../../3.4-directives/use-cache-private.md)
- [cacheLife](./cacheLife.md)

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- Map 기반 cache handler를 연결한 route와 외부 Redis 기반 handler를 연결한 route를 준비한다.
- 브라우저에서 같은 route를 반복 요청해 첫 요청의 cache miss와 이후 요청의 cache hit를 화면에 표시하고, handler 로그에서 get()과 set() 호출을 확인한다.
- 두 개의 Next.js 인스턴스가 같은 Redis를 사용하도록 구성한 뒤 한 인스턴스에서 tag를 무효화하고 다른 인스턴스의 refreshTags() 이후 결과가 갱신되는지 확인한다.
- stream을 저장할 때 partial entry를 버리는 오류 처리도 의도적으로 발생시켜 브라우저에 불완전한 페이지가 제공되지 않는지 관찰한다.

## 연습 문제

1. cacheHandlers를 설정하지 않았을 때 Next.js의 기본 동작으로 올바른 것은 무엇인가?
   - A. default와 remote 모두에 메모리 LRU cache를 사용한다.
   - B. 모든 cache를 정적 파일로만 저장한다.
   - C. use cache: private만 활성화한다.
   - D. cache 기능을 자동으로 비활성화한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: cacheHandlers를 설정하지 않으면 Next.js는 default와 remote에 메모리 LRU cache를 사용한다.
</details>

2. cache handler의 set() 메서드가 pendingEntry를 await해야 하는 이유는 무엇인가?
   - A. cache key를 문자열로 바꾸기 위해서
   - B. entry가 set() 호출 시점에도 생성 중일 수 있기 때문에
   - C. 브라우저의 hydration을 시작하기 위해서
   - D. route 경로를 계산하기 위해서

<details><summary>정답 보기</summary>

정답: **B**  
해설: pendingEntry는 cache entry로 resolve되는 promise이며, 값의 stream이 아직 기록되는 중일 수 있으므로 저장 전에 await해야 한다.
</details>

3. 여러 Next.js 인스턴스 사이에서 tag 무효화를 동기화할 때 필요한 메서드의 역할로 올바른 것은 무엇인가?
   - A. updateTags()가 공유 저장소에 무효화 timestamp를 기록하고 refreshTags()가 요청 전에 이를 읽는다.
   - B. getExpiration()이 모든 cache entry를 삭제하고 updateTags()가 브라우저를 새로고침한다.
   - C. refreshTags()가 매 요청 뒤에 route를 다시 빌드한다.
   - D. set()이 다른 인스턴스의 메모리 cache를 직접 수정한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: updateTags()는 무효화 상태를 공유 저장소에 기록하고 refreshTags()는 요청 전에 최근 상태를 읽으며, getExpiration()은 tag의 최근 revalidation timestamp를 반환한다.
</details>

## 챕터 요약

- cacheHandlers는 use cache와 use cache: remote의 저장 방식을 사용자 지정하며, use cache: private에는 적용되지 않는다.
- 기본 설정에서는 default와 remote에 메모리 LRU cache를 사용하고, 필요하면 이름을 붙인 handler를 더 등록한다.
- get(), set(), refreshTags(), getExpiration(), updateTags()가 CacheHandler의 핵심 API다.
- CacheEntry.value는 ReadableStream이므로 stream을 한 번만 소비하고 필요하면 tee()로 분기한다.
- soft tags와 공유 저장소를 활용하면 revalidatePath()와 여러 인스턴스의 tag 무효화를 함께 조정한다.
