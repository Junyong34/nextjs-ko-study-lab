# Implementing PPR in an Adapter

- 공식 문서: [Implementing PPR in an Adapter](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 어댑터가 `onBuildComplete`에서 PPR fallback shell과 postponed state를 받아 저장하는 방법을 이해한다.
- 요청 시점에 캐시된 shell과 재개(resume) 스트림을 하나의 응답으로 이어 붙이는 흐름을 이해한다.
- `requestMeta.onCacheEntryV2`로 캐시 항목을 갱신하는 계약을 파악한다.

## 핵심 개념 및 설명

부분적으로 prerender된(partially prerendered) app 경로의 경우, `onBuildComplete`가 PPR을 시딩(seed)하고 재개(resume)하는 데 필요한 데이터를 전달한다.

- `outputs.prerenders[].fallback.filePath`: 생성된 fallback shell(예: HTML) 파일의 경로
- `outputs.prerenders[].fallback.postponedState`: 렌더링을 재개할 때 사용하는 직렬화된 postponed state

### 1. 빌드 시점에 shell과 postponed state를 시딩한다

빌드가 끝나면 각 prerender 항목의 fallback shell 파일을 읽어 플랫폼 캐시에 저장한다. 이때 postponed state와 초기 헤더·상태·revalidation 정보도 함께 저장해야 요청 시점에 재개할 수 있다.

```ts filename="my-adapter.ts"
import { readFile } from 'node:fs/promises'

async function seedPprEntries(outputs: AdapterOutputs) {
  for (const prerender of outputs.prerenders) {
    const fallback = prerender.fallback
    if (!fallback?.filePath || !fallback.postponedState) continue

    const shell = await readFile(fallback.filePath, 'utf8')
    await platformCache.set(prerender.pathname, {
      shell,
      postponedState: fallback.postponedState,
      initialHeaders: fallback.initialHeaders,
      initialStatus: fallback.initialStatus,
      initialRevalidate: fallback.initialRevalidate,
      initialExpiration: fallback.initialExpiration,
    })
  }
}
```

### 2. 런타임 흐름: 캐시된 shell을 제공하고 백그라운드에서 재개한다

요청 시점에는 다음 두 스트림을 이어 붙인 **하나의 응답**을 스트리밍할 수 있다.

1. 캐시된 HTML shell 스트림
2. 재개된(resumed) 렌더 스트림 — postponed state와 함께 `handler`를 호출한 뒤 생성된다

```text
Client
  | GET /ppr-route
  v
Adapter Router
  |
  |-- read cached shell + postponedState ---> Platform Cache
  |<------------- cache hit -----------------|
  |
  |-- create responseStream = concat(shellStream, resumedStream)
  |
  |-- start piping shellStream ------------> Client (첫 바이트)
  |
  |-- invoke handler(req, res, { requestMeta: { postponed } })
  |   -------------------------------------> Entrypoint (handler)
  |   <------------------------------------- resumed chunks/cache entry
  |
  |-- append resumed chunks to resumedStream
  |
  '-- client receives one HTTP response:
      [shell bytes........][resumed bytes........]
```

클라이언트는 shell 바이트와 재개된 바이트가 이어진 **하나의 HTTP 응답**만 받는다. shell은 먼저 도착해 첫 바이트를 빠르게 보여주고, 나머지는 handler 호출이 끝나는 대로 이어서 전달된다.

### 3. `requestMeta.onCacheEntryV2`로 캐시를 갱신한다

`requestMeta.onCacheEntryV2`는 응답 캐시 항목이 조회되거나 생성될 때 호출된다. 이 콜백을 사용해 갱신된 shell·postponed 데이터를 영구 저장한다.

> **알아두면 좋은 점**:
>
> - `requestMeta.onCacheEntry`도 여전히 동작하지만 지원 중단(deprecated)되었다.
> - `requestMeta.onCacheEntryV2`를 사용하는 편이 낫다.
> - 어댑터에 내부 `onCacheCallback` 추상화가 있다면 `requestMeta.onCacheEntryV2`에 연결한다.

```ts filename="my-adapter.ts"
await handler(req, res, {
  waitUntil,
  requestMeta: {
    postponed: cachedPprEntry?.postponedState,
    onCacheEntryV2: async (cacheEntry, meta) => {
      if (cacheEntry.value?.kind === 'APP_PAGE') {
        const html =
          cacheEntry.value.html &&
          typeof cacheEntry.value.html.toUnchunkedString === 'function'
            ? cacheEntry.value.html.toUnchunkedString()
            : null

        await platformCache.set(meta.url || req.url || '/', {
          shell: html,
          postponedState: cacheEntry.value.postponed,
          headers: cacheEntry.value.headers,
          status: cacheEntry.value.status,
          cacheControl: cacheEntry.cacheControl,
        })
      }

      // 어댑터가 이미 응답을 직접 작성했을 때만 true를 반환한다.
      return false
    },
  },
})
```

```text filename="my-adapter.ts"
Entrypoint (handler)
  | onCacheEntryV2(cacheEntry, { url })
  v
requestMeta.onCacheEntryV2 callback
  |
  |-- if APP_PAGE ---> persist html + postponedState + headers ---> Platform Cache
  |
  '-- return false: Next.js의 정상 응답 흐름을 계속 진행한다
      return true:  어댑터가 이미 응답을 처리했음(short-circuit)을 의미한다
```

`onCacheEntryV2`는 `false`를 반환하면 Next.js가 응답 흐름을 계속 이어가고, `true`를 반환하면 어댑터가 이미 응답을 직접 작성했다는 뜻으로 처리를 중단(short-circuit)한다.

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서 어댑터 데모 앱을 만들 때, PPR 경로 하나에 대해 `seedPprEntries`로 shell을 캐시에 저장하고 요청 시 shell + resumed 스트림이 하나의 응답으로 이어지는지 확인하는 데모를 설계한다.
- `onCacheEntryV2` 콜백에서 `APP_PAGE` 캐시 항목이 갱신되는 로그를 남겨, revalidation 이후 캐시가 최신 상태로 유지되는지 검증하는 시나리오를 포함한다.

## 연습 문제

1. `outputs.prerenders[].fallback`에서 렌더링을 재개(resume)할 때 필요한 값은?
   - A. `filePath`
   - B. `postponedState`
   - C. `initialRevalidate`

<details><summary>정답 보기</summary>

정답: B. `postponedState`는 재개 렌더링에 사용되는 직렬화된 상태이다. `filePath`는 fallback shell 파일 경로, `initialRevalidate`는 초기 revalidation 값으로 별도 정보다.
</details>

2. `requestMeta.onCacheEntryV2` 콜백이 `true`를 반환하면 어떤 의미인가?
   - A. 캐시 저장에 실패했다.
   - B. 어댑터가 이미 응답을 직접 작성했으므로 Next.js는 처리를 중단한다.
   - C. postponed state가 존재하지 않는다.

<details><summary>정답 보기</summary>

정답: B. `true`를 반환하면 어댑터가 응답을 이미 처리했다는 뜻으로 short-circuit된다. `false`를 반환해야 Next.js의 정상 응답 흐름이 이어진다.
</details>

## 챕터 요약

- 어댑터는 빌드 시점에 `outputs.prerenders[].fallback`의 `filePath`와 `postponedState`를 읽어 플랫폼 캐시에 시딩한다.
- 요청 시점에는 캐시된 shell 스트림과 재개된 렌더 스트림을 이어 붙여 하나의 HTTP 응답으로 전달한다.
- `requestMeta.onCacheEntryV2`는 응답 캐시 항목이 조회·생성될 때 호출되며, 갱신된 shell·postponed 데이터를 영구 저장하는 데 사용한다.
- `onCacheEntry`는 지원 중단되었으므로 `onCacheEntryV2`를 사용하는 편이 낫다.
- 콜백은 어댑터가 응답을 직접 처리했을 때만 `true`를 반환해야 한다.
