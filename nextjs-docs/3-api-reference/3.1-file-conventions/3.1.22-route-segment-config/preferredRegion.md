# preferredRegion (deprecated)

- 공식 문서: [preferredRegion](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/preferredRegion)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 과거 route 배포 region hint의 의미를 이해한다.
- deprecated 상태를 인지하고 deployment platform 설정으로 이전한다.

## 핵심 개념 및 설명

> **더 이상 사용되지 않음:**`preferredRegion` 라우트 세그먼트 구성은 더 이상 사용되지 않는다. 경로 파일에서 `preferredRegion` 내보내기를 제거한다. 자세한 내용은 [지원 중단 메시지](https://nextjs.org/docs/messages/preferred-region-deprecated)를 참조한다.

`preferredRegion` 옵션을 사용하면 라우트 세그먼트에 대해 기본 배포 지역을 지정할 수 있다. 이 값은 배포 플랫폼으로 전달된다.

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const preferredRegion = // 문자열 || 끈[]
```

```js filename="layout.js | page.js | route.js" switcher
export const preferredRegion = // 문자열 || 끈[]
```

- **`string`**: 특정 지역에 경로를 배포한다. 사용 가능한 지역 코드는 플랫폼마다 다르다. 예를 들어 `'iad1'`이다.
- **`string[]`**: 여러 특정 지역에 경로를 배포한다. 경로는 목록에서 선택한 단일 지역이 아니라 나열된 **모든** 지역에 배포된다. 예를 들어 `['iad1', 'sfo1']`이다.

> **알아두면 좋은 점**:
>
> - `preferredRegion`를 지정하지 않으면 가장 가까운 상위 레이아웃의 옵션을 상속한다. 루트 레이아웃의 기본값은 `'auto'`이다.
> - 하위 세그먼트의 값이 상위 세그먼트의 값을 재정의하며 값은 병합되지 않는다.
> - Next.js는 지역 값을 배포 플랫폼으로 전달한다. 정확한 동작과 사용 가능한 지역 코드는 플랫폼마다 다르다. 지원되는 값은 배포 플랫폼의 설명서를 참조한다.

<a id="vercel"></a>
### Vercel

Vercel에 Next.js를 배포하는 경우 이전에는 지역이 `export const runtime = 'edge'`에서만 지원되었지만 현재는 [더 이상 사용되지 않음](https://nextjs.org/docs/messages/edge-runtime-deprecated). 다음 옵션을 전달할 수 있다.

- **`'auto'`**(기본값): 기본 지역을 사용한다.
- **`'global'`**: 사용 가능한 모든 지역에 경로를 배포하는 것을 선호한다.
- **`'home'`**: 홈 지역에 대한 경로 배포를 선호한다.

지원되지 않는 값이 전달되면 오류가 발생한다.

## 예제 및 데모 설계

- Phase 2 구현 대상에서는 제외한다. migration 검사에서 기존 export 탐지와 제거만 검증한다.

## 연습 문제

1. 기존 `preferredRegion` 코드의 처리 방법은?
   - A. 그대로 유지한다.
   - B. route에서 제거하고 platform 설정을 확인한다.
   - C. Client Component로 옮긴다.

<details><summary>정답 보기</summary>

정답: B. 이 route segment config는 deprecated되어 오류를 낸다.
</details>

## 챕터 요약

- `preferredRegion`은 과거의 배포 region hint다.
- 문자열과 배열 형태를 지원했었다.
- 현재 deprecated되어 사용하면 오류가 발생한다.
- route export를 제거하고 deployment platform 설정으로 이전한다.
