# Route Segment Config

- 공식 문서: [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- 상위 메뉴: [File-system conventions](../README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Page, Layout, Route Handler에서 상수 export로 segment 동작을 설정합니다.
- Next.js 16의 Cache Components와 deprecated 옵션을 구분합니다.

## 핵심 개념 및 설명

Route Segment Config는 파일에서 변수를 직접 export해 route 동작을 지정합니다.

| 옵션 | type | 기본값 |
|---|---|---|
| `dynamicParams` | boolean | `true` |
| `runtime` | `'nodejs'` 또는 deprecated `'edge'` | `'nodejs'` |
| `preferredRegion` | 문자열/배열 계열(deprecated) | `'auto'` |
| `maxDuration` | number | deployment platform이 결정 |

Next.js 16에서 Cache Components가 활성화되면 과거의 `dynamic`, `dynamicParams`, `revalidate`, `fetchCache` 설정은 제거됩니다. `experimental_ppr`도 제거되었습니다. 이 그룹에는 새 내비게이션 검증용 `instant`와 segment prefetch 제어용 `prefetch` 문서도 포함됩니다.

## 학습 순서

- 3.1.22.1 [dynamicParams](./dynamicParams.md)
- 3.1.22.2 [instant](./instant.md)
- 3.1.22.3 [maxDuration](./maxDuration.md)
- 3.1.22.4 [prefetch](./prefetch.md)
- 3.1.22.5 [runtime](./runtime.md)
- 3.1.22.6 [preferredRegion (deprecated)](./preferredRegion.md)

## 예제 및 데모 설계

- Phase 2에서 같은 route에 옵션을 하나씩 적용하고 build output과 내비게이션을 비교합니다.
- Cache Components 활성화 전후 지원 여부를 표로 기록합니다.

## 연습 문제

1. Cache Components에서 제거된 설정 조합은?
   - A. `dynamic`, `dynamicParams`, `revalidate`, `fetchCache`
   - B. `maxDuration`만
   - C. `runtime`만

<details><summary>정답 보기</summary>

정답: A. 이전 caching model의 설정은 Cache Components에서 사용할 수 없습니다.
</details>

## 챕터 요약

- Route Segment Config는 상수 export 기반 설정입니다.
- Page, Layout, Route Handler에 적용합니다.
- Cache Components는 일부 이전 설정을 제거합니다.
- Edge runtime과 preferredRegion은 deprecated 상태입니다.
- 내비게이션 관련 새 옵션은 각 하위 문서에서 다룹니다.
