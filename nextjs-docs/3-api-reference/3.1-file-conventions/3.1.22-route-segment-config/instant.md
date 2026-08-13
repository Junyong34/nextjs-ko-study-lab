# instant

- 공식 문서: [instant](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- segment 진입 시 즉시 UI가 보일 것이라는 기대를 검증한다.
- validation level과 global 기본값을 설정하고 loading state를 점검한다.

## 핵심 개념 및 설명

`instant`는 이 segment로 내비게이션할 때 외부 데이터 대기 없이 UI가 즉시 갱신되는지 Next.js가 검증하도록 한다. `true`는 global level로 검증에 참여하고, `false`는 제외한다. 객체를 사용하면 segment별 `level`을 지정할 수 있다.

```ts
export const instant = true
```

이 export는 `cacheComponents`가 활성화된 Server Component에서만 동작한다. Client Component에서 사용하면 오류다. development에는 prefetch가 없으므로 체감 속도는 production과 다를 수 있지만 검증은 `next start`에서 일어날 동작을 기준으로 한다.

validation은 segment의 `loading.js`나 Suspense fallback이 prefetch 가능한 static shell을 제공하는지 추적한다. 필요하면 `false`로 즉시성을 포기하거나 validation만 끌 수 있지만, 실제 loading state를 제공하는 것이 우선이다. 프로젝트 기본 severity는 Next.js 설정에서 조정하고 route별 export로 override한다.

검증은 destination의 page만 보지 않고 진입 경로에 있는 layout과 static shell을 함께 검사한다. 개발 중에는 overlay가 blocking source를 가리키며, build 단계 검증을 선택한 경우 production build도 같은 기대를 강제할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 runtime 데이터를 boundary 밖에 두어 개발 overlay 오류를 확인한 뒤 loading state로 해결한다.
- `level`별 warning/error 동작과 production prefetch를 비교한다.

## 연습 문제

1. `instant`의 필수 조건은?
   - A. `cacheComponents` 활성화
   - B. Pages Router 사용
   - C. Client Component export

<details><summary>정답 보기</summary>

정답: A. Cache Components가 켜진 route segment에서만 동작한다.
</details>

## 챕터 요약

- `instant`는 즉시 UI 기대를 검증한다.
- true, false, level 객체를 지원한다.
- Cache Components가 필요하다.
- Client Component에서는 사용할 수 없다.
- loading state와 Suspense boundary로 blocking 원인을 해결한다.
