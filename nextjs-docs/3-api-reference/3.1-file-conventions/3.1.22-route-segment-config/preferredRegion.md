# preferredRegion (deprecated)

- 공식 문서: [preferredRegion](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/preferredRegion)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 과거 route 배포 region hint의 의미를 이해한다.
- deprecated 상태를 인지하고 deployment platform 설정으로 이전한다.

## 핵심 개념 및 설명

`preferredRegion`은 route를 실행할 선호 region을 `'auto'`, `'global'`, `'home'`, region 문자열 또는 배열로 지정하던 배포 hint다. 현재 deprecated되었으며 이 export를 사용하면 오류가 발생한다. route 코드에서 제거하고 사용하는 deployment platform의 region 설정을 따른다.

```ts
// deprecated: 제거한다.
export const preferredRegion = 'home'
```

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
