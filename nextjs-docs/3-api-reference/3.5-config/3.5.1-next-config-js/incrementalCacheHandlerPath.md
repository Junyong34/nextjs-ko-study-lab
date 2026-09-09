# cacheHandler

- 공식 문서: [cacheHandler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `cacheHandler`가 Next.js의 서버 캐시 저장 위치와 공유 범위를 어떻게 바꾸는지 이해한다.
- `get()`, `set()`, `revalidateTag()`, `resetRequestCache()` 메서드의 매개변수와 반환값을 파악한다.
- 이미지 최적화 캐싱, 배포 환경별 지원 범위, 버전별 변경 사항을 설명할 수 있다.

## 핵심 개념 및 설명

Next.js 캐시를 영구 저장소에 보존하거나 여러 컨테이너 또는 Next.js 애플리케이션 인스턴스가 캐시를 공유하려면 캐시 위치를 설정할 수 있다. 이럴 때 사용자 정의 캐시 핸들러를 사용한다.

> **알아두면 좋은 점**: Next.js는 `cacheHandler` 단수 설정을 ISR을 저장하고 revalidate하는 작업, Route Handler 응답, 최적화된 이미지 저장과 같은 서버 캐시 작업에 사용한다. `'use cache'` 지시어에는 사용하지 않는다. `'use cache'` 지시어에는 [`cacheHandlers`](./cacheHandlers.md) 복수 설정을 사용한다. [`cacheMaxMemorySize`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize)는 두 설정과 별개이며 각각의 인메모리 캐시 크기를 정한다.

```js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // 기본 인메모리 캐싱을 비활성화한다
}
```

[사용자 정의 캐시 핸들러 예제](../../../2-guides/self-hosting.md#configuring-caching)에서 구현 방법을 확인할 수 있다.

## API Reference (API 레퍼런스)

캐시 핸들러는 `get`, `set`, `revalidateTag`, `resetRequestCache` 메서드를 구현할 수 있다.

### `get()`

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| key | string | 캐시된 값의 키다. |
| ctx | object | 캐시 항목 종류를 포함한 컨텍스트다. |

`ctx` 매개변수의 `kind` 속성은 가져오는 캐시 항목의 종류를 나타낸다. 가능한 값은 `'APP_PAGE'`, `'APP_ROUTE'`, `'PAGES'`, `'FETCH'`, `'IMAGE'`다.

캐시된 값을 반환한다. 값을 찾지 못하면 `null`을 반환한다.

### `set()`

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| key | string | 데이터를 저장할 키다. |
| data | Data or null | 캐시할 데이터다. |
| ctx | { tags: [] } | 제공된 캐시 태그다. |

`data` 객체의 `kind` 속성은 캐시 항목의 종류를 나타낸다. 이미지 최적화에서는 `kind`가 `'IMAGE'`가 되고, 데이터에 `buffer`, `etag`, `extension`, `revalidate`와 같은 속성이 포함된다.

`set()`은 `Promise<void>`를 반환한다.

### `revalidateTag()`

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| tag | string or string[] | revalidate할 캐시 태그다. |

`revalidateTag()`는 `Promise<void>`를 반환한다. 자세한 내용은 [데이터를 revalidate하는 방법](../../../2-guides/incremental-static-regeneration.md)과 [`revalidateTag()`](../../3.3-functions/revalidateTag.md) 함수 문서를 참고한다.

### `resetRequestCache()`

이 메서드는 단일 요청에서 사용하는 임시 인메모리 캐시를 다음 요청을 처리하기 전에 초기화한다.

`resetRequestCache()`는 `void`를 반환한다.

> **알아두면 좋은 점**:
>
> - `revalidatePath`는 캐시 태그 위에 놓인 편의 계층이다. `revalidatePath`를 호출하면 `revalidateTag` 함수가 호출되고, 캐시 키에 경로를 태그로 지정할지는 캐시 핸들러가 결정한다.

## Image Optimization Caching (이미지 최적화 캐싱)

`next/image`에서 최적화한 이미지를 캐싱할 때도 `cacheHandler`를 사용할 수 있다. `next.config.js`에서 `images.customCacheHandler`를 `true`로 설정해 이 기능을 활성화한다.

```js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  images: {
    customCacheHandler: true,
  },
}
```

> **알아두면 좋은 점**: 이 opt-in 플래그는 다음 메이저 버전에서 기본 동작이 된다. 지금 설정하면 이미지 최적화 캐시 항목을 처리할 수 있도록 캐시 핸들러를 미리 준비할 수 있다.

`kind` 속성으로 캐시 항목의 종류를 구분하고, 필요하면 이미지를 다른 항목과 별도로 처리할 수 있다. 예를 들어 항목 제거 정책을 다르게 적용하거나 이미지를 다른 위치에 저장할 수 있다.

이미지 캐시 항목을 처리할 때 `kind`는 `'IMAGE'`이고 데이터에는 `buffer`, `etag`, `extension`, `revalidate` 속성이 포함된다.

## Platform Support (플랫폼 지원)

| 배포 옵션 | 지원 여부 |
| --- | --- |
| Node.js server | Yes |
| Docker container | Yes |
| Static export | No |
| Adapters | Platform-specific |

Next.js를 자체 호스팅할 때 [ISR을 설정하는 방법](../../../2-guides/self-hosting.md#caching-and-isr)을 참고한다.

## Version History (버전 기록)

| 버전 | 변경 사항 |
| --- | --- |
| v16.2.0 | 이미지 최적화 캐싱에 `cacheHandler`를 지원한다. |
| v14.1.0 | `cacheHandler`로 이름을 바꾸고 안정화했다. |
| v13.4.0 | `revalidateTag`를 위한 `incrementalCacheHandlerPath` 지원을 추가했다. |
| v13.4.0 | standalone 출력을 위한 `incrementalCacheHandlerPath` 지원을 추가했다. |
| v12.2.0 | 실험적인 `incrementalCacheHandlerPath`를 추가했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 사용자 정의 캐시 핸들러의 `get()`, `set()`, `revalidateTag()` 호출을 서버 로그와 외부 저장소에서 확인하고, 브라우저에서 캐시된 페이지와 최적화된 이미지 응답의 변화를 관찰한다.
- `images.customCacheHandler: true`를 켠 뒤 같은 이미지를 다시 요청해 캐시 핸들러가 `'IMAGE'` 항목을 저장하는 흐름을 확인한다.

## 연습 문제

1. `cacheHandler`에 대한 설명으로 옳은 것을 모두 고른다.
   - A. ISR, Route Handler 응답, 최적화된 이미지와 같은 서버 캐시 작업에 사용한다.
   - B. `'use cache'` 지시어 전용 캐시를 설정한다.
   - C. 여러 Next.js 인스턴스가 캐시를 공유하도록 영구 저장소를 연결할 수 있다.
   - D. `cacheMaxMemorySize`와 항상 같은 설정이다.

<details><summary>정답 보기</summary>

정답: **A, C**  
해설: 단수형 `cacheHandler`는 서버 캐시 작업에 사용하고, `'use cache'` 지시어에는 복수형 `cacheHandlers`를 사용한다. `cacheMaxMemorySize`도 별도 설정이다.
</details>

2. `get()` 메서드의 `ctx.kind`에 해당할 수 있는 값을 모두 고른다.
   - A. `'APP_PAGE'`
   - B. `'FETCH'`
   - C. `'IMAGE'`
   - D. `'CLIENT_COMPONENT'`

<details><summary>정답 보기</summary>

정답: **A, B, C**  
해설: 원문에 제시된 가능한 값은 `'APP_PAGE'`, `'APP_ROUTE'`, `'PAGES'`, `'FETCH'`, `'IMAGE'`다.
</details>

3. `cacheHandler`의 배포 지원에 대한 설명으로 옳은 것은?
   - A. Node.js server와 Docker container를 지원한다.
   - B. Static export를 지원한다.
   - C. Adapters는 모든 플랫폼에서 같은 방식으로 지원한다.
   - D. Static export는 지원하지 않는다.

<details><summary>정답 보기</summary>

정답: **A, D**  
해설: Node.js server와 Docker container는 지원하지만 Static export는 지원하지 않는다. Adapters 지원은 플랫폼에 따라 다르다.
</details>

## 챕터 요약

- `cacheHandler`는 서버 캐시를 영구 저장소에 보존하거나 여러 애플리케이션 인스턴스가 공유하도록 설정한다.
- `get()`, `set()`, `revalidateTag()`, `resetRequestCache()` 메서드로 캐시 핸들러의 동작을 구현한다.
- `cacheHandler`는 `'use cache'` 지시어가 사용하는 `cacheHandlers`, 그리고 `cacheMaxMemorySize`와는 별개 설정이다.
- `images.customCacheHandler: true`를 설정하면 `next/image` 최적화 이미지 캐시 항목도 처리할 수 있다.
- Node.js server와 Docker container에서는 지원하지만 Static export에서는 지원하지 않으며, Adapters 지원은 플랫폼에 따라 다르다.
