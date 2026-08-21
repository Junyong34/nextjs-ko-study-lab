# prefetch

- 공식 문서: [prefetch](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment 단위 Partial Prefetching 채택과 강제 비활성화를 구분한다.
- `<Link prefetch>`와 destination segment 설정의 우선관계를 이해한다.

## 핵심 개념 및 설명

`prefetch` 라우트 세그먼트 구성은 클라이언트 측 탐색 중에 세그먼트를 미리 가져오는 방법을 제어한다. 기본적으로 프레임워크는 앱의 [`partialPrefetching`](../../3.5-config/3.5.1-next-config-js/partialPrefetching.md) 설정을 기반으로 전략을 관리한다. 세그먼트별로 재정의하려면 이 내보내기를 아래 값 중 하나로 설정한다.

> **알아두면 좋은 점**:
>
> - `prefetch` 내보내기는 [`cacheComponents`](../../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화된 경우에만 작동한다.
> - 세그먼트가 Client Component인 경우 `prefetch`를 사용할 수 없다.
> - 설정해야 할 의미 있는 값은 `'partial'`,`'force-disabled'`이다.`'auto'`는 기본값이며 내보내기를 생략하는 것과 동일하다.`prefetch = 'auto'`를 명시적으로 작성하지 않는다.

```tsx filename="layout.tsx | page.tsx" switcher
export const prefetch = 'partial'

export default function Page() {
  return <div>...</div>
}
```

```jsx filename="layout.js | page.js" switcher
export const prefetch = 'partial'

export default function Page() {
  return <div>...</div>
}
```

<a id="options"></a>
### 옵션

<a id="partial"></a>
#### `'partial'`

전역 [`partialPrefetching`](../../3.5-config/3.5.1-next-config-js/partialPrefetching.md) 플래그를 활성화하지 않고 세그먼트를 [부분 prefetching](../../../2-guides/adopting-partial-prefetching.md)으로 선택한다.`prefetch = 'partial'`가 있는 세그먼트를 가리키는 `<Link>`는 레거시 전체 prefetch 대신 경로별 [App Shell](../../../4-glossary/README.md#app-shell)을 로드한다. 링크가 아닌 대상에 설정한다.

[`<Link prefetch={true}>`](../../3.2-components/link.md#prefetch)를 사용하여 더 넓은 prefetch를 선택하는 링크의 경우 Next.js는 링크별 prefetching을 사용한다. 서버는 URL 데이터(`params`,`searchParams` 및 전체 URL)를 확인하는 새로운 응답을 렌더링한다. 모든 콘텐츠가 정적으로 렌더링 가능한 페이지에서 Next.js는 정적 캐시에서 prefetch를 제공한다. 페이지가 비정적 데이터에 액세스하는 경우 런타임 시 prefetch된다.

전체 앱에 대해 `partialPrefetching`를 한 번에 활성화할 수 없는 경우 점진적 채택에 이 기능을 사용한다. 범위 내의 모든 경로에 `prefetch = 'partial'`가 있으면 전역 플래그를 활성화하고 경로별 내보내기를 제거한다.

> **알아두면 좋은 점**: Next.js가 세그먼트에 대해 링크별 prefetch를 수행하면 모든 다운스트림 세그먼트가 동일한 요청에 포함된다.`'force-disabled'`로 구성된 트리의 더 깊은 세그먼트는 여전히 응답의 일부로 prefetch된다.

```tsx filename="page.tsx"
export const prefetch = 'partial'
```

<a id="force-disabled"></a>
#### `'force-disabled'`

이 세그먼트를 미리 가져오지 않는다. 클라이언트는 탐색 전에 세그먼트 데이터를 요청하지 않는다. prefetch가 낭비되는 세그먼트(예: 거의 방문하지 않는 인증 뒤의 페이지)에 이 기능을 사용한다.

> **알아두면 좋은 점**: `'force-disabled'`는 Next.js가 경로에 대한 메타데이터를 미리 가져오는 것을 방지하지 않는다. 그러나 이 세그먼트와 모든 더 깊은 세그먼트에 대한 실제 세그먼트 데이터는 prefetch에서 생략된다.

<a id="relationship-with-the-prop"></a>
### `<Link prefetch>` prop과의 관계

prefetch는 의도(이 대상을 prefetch해야 하는지, 얼마나 열심히 하는지)를 표현하는 `<Link>`로 시작하고 비용 상한선(여기를 가리키는 링크에 대해 미리 수행해도 되는 작업의 양)을 설정하는 세그먼트에서 끝난다.

대상은 어떤 링크를 대상으로 하는지 알 수 없으므로 세그먼트 구성은 `<Link prefetch={true}>`가 가져오는 내용을 제한한다.

- [`'partial'`](#partial): 기본 링크용 App Shell;`<Link prefetch={true}>`는 URL 데이터(`params`,`searchParams` 및 전체 URL)와 그 뒤에 캐시된 콘텐츠를 추가로 확인한다.
- [`'force-disabled'`](#force-disabled): 세그먼트 데이터를 완전히 건너뜁니다.

`<Link prefetch={false}>`는 대상 구성 방식에 관계없이 링크 수준에서 prefetch를 건너뜁니다.

> **알아두면 좋은 점**: 모든 콘텐츠가 정적으로 렌더링 가능한 페이지에서 Next.js는 정적 캐시(또는 CDN)에서 prefetch를 제공한다. 페이지가 쿠키나 헤더와 같은 비정적 데이터에 액세스하는 경우 런타임 시 페이지 보기당 서버 CPU 비용이 드는 새로운 서버 렌더링으로 prefetch된다.

<a id="typescript"></a>
### TypeScript

```tsx filename="layout.tsx"
type Prefetch = 'auto' | 'partial' | 'force-disabled'

export const prefetch: Prefetch = 'partial'
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ---------------------------------------------------- |
| `v16.x.x` | `prefetch` 내보내기 도입됨(Cache Components에만 해당) |

## 예제 및 데모 설계

- Phase 2에서 `'auto'`, `'partial'`, `'force-disabled'` route의 network 요청과 App Shell을 비교한다.
- `<Link prefetch={true}>`가 하위 segment에 미치는 영향을 확인한다.

## 연습 문제

1. Partial Prefetching을 route별로 점진 채택하는 값은?
   - A. `'partial'`
   - B. `'auto'`
   - C. `'runtime'`

<details><summary>정답 보기</summary>

정답: A. destination segment에서 App Shell prefetch를 선택한다.
</details>

## 챕터 요약

- `prefetch`는 destination segment의 전략을 제어한다.
- Cache Components가 필요하다.
- `'partial'`은 App Shell 기반 점진 채택용이다.
- `'force-disabled'`는 segment prefetch를 끈다.
- per-link 전체 prefetch가 하위 설정보다 넓게 포함할 수 있다.
