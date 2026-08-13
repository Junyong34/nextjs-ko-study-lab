# prefetch

- 공식 문서: [prefetch](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment 단위 Partial Prefetching 채택과 강제 비활성화를 구분한다.
- `<Link prefetch>`와 destination segment 설정의 우선관계를 이해한다.

## 핵심 개념 및 설명

`prefetch`는 client-side navigation 때 segment가 prefetch되는 방식을 override한다. `cacheComponents`가 필요하고 Client Component segment에서는 사용할 수 없다. 의미 있는 명시 값은 `'partial'`과 `'force-disabled'`이며 기본 `'auto'`는 export를 생략하는 것과 같다.

```ts
export const prefetch = 'partial'
```

`'partial'`은 global `partialPrefetching` 없이 destination route의 App Shell을 prefetch해 점진적으로 채택하게 한다. `<Link prefetch={true}>`는 더 넓은 per-link prefetch를 요청하며 URL 데이터까지 해결한 새 응답을 사용한다. 이 경우 하위의 `'force-disabled'` segment도 같은 응답에 포함될 수 있다.

`'force-disabled'`는 해당 destination의 자동·부분 prefetch를 강제로 끈다. 다만 상위 link가 전체 응답을 prefetch하면 포함될 수 있으므로 데이터 보안을 prefetch 설정에 의존해서는 안 된다.

`<Link prefetch={false}>`는 특정 link의 prefetch를 끄고, `prefetch={true}`는 route 설정보다 넓은 full prefetch를 요청한다. segment export는 destination에, Link prop은 개별 출발 link에 적용된다는 범위 차이를 기억한다.

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
