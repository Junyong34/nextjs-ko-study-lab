# Route Segment Config

- 공식 문서: [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- 상위 메뉴: [File-system conventions](../README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Page, Layout, Route Handler에서 상수 export로 segment 동작을 설정합니다.
- Next.js 16의 Cache Components와 deprecated 옵션을 구분합니다.

## 핵심 개념 및 설명

라우트 세그먼트 구성 옵션을 사용하면 다음 변수를 직접 내보내 [페이지](../page.md), [레이아웃](../layout.md) 또는 [Route Handler](../route.md)의 동작을 구성할 수 있습니다.

| 옵션 | 유형 | 기본 |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------- |
| [`dynamicParams`](dynamicParams.md) | `boolean` | `true` |
| [`runtime`](runtime.md) | ``nodejs'\ | '가장자리'(더 이상 사용되지 않음)` | `'nodejs'` |
| [`preferredRegion`](preferredRegion.md) | ``자동'\ | '글로벌'\ | '집' \ | 끈 \ | string[] (더 이상 사용되지 않음)` | `'auto'` |
| [`maxDuration`](maxDuration.md) | `number` | 배포 플랫폼별로 설정 |

<a id="version-history"></a>
### Version History

| 버전 |                                                                                                                                                                                                                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v16.0.0` | [Cache Components](../../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화되면 `dynamic`,`dynamicParams`,`revalidate` 및 `fetchCache`가 제거됩니다. [캐싱 및 ​​유효성 재검사(이전 모델)](../../../2-guides/caching-without-cache-components.md#route-segment-config)를 참조하세요. |
| `v16.0.0` | `export const experimental_ppr = true`가 제거되었습니다. [codemod](../../../2-guides/2.64-upgrading/codemods.md#remove-experimental_ppr-route-segment-config-from-app-router-pages-and-layouts)를 사용할 수 있습니다. |
| `v15.0.0-RC` | `export const runtime = "experimental-edge"`는 더 이상 사용되지 않습니다. [codemod](../../../2-guides/2.64-upgrading/codemods.md#transform-app-router-route-segment-config-runtime-value-from-experimental-edge-to-edge)를 사용할 수 있습니다. |

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
