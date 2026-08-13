# Intercepting Routes

- 공식 문서: [Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 다른 route 콘텐츠를 현재 layout 안에 표시하면서 URL 맥락을 유지한다.
- `(.)`, `(..)`, `(..)(..)`, `(...)` matcher를 route segment 기준으로 계산한다.
- Parallel Routes와 결합한 shareable modal 패턴을 이해한다.

## 핵심 개념 및 설명

Intercepting Routes는 client-side navigation에서 다른 route를 현재 layout 안에 표시하고 URL을 mask한다. 반면 공유 URL을 직접 열거나 새로고침하면 interception 없이 대상 full page를 렌더링한다.

- `(.)`: 같은 level
- `(..)`: 한 route segment 위
- `(..)(..)`: 두 route segment 위
- `(...)`: root `app`부터

matcher는 file-system depth가 아니라 route segment를 기준으로 한다. 따라서 `@slot`은 계산에 포함하지 않는다. 이 특성 때문에 gallery의 사진을 modal로 열면서도 `/photo/123` URL을 공유하고, 새로고침 때 full page를 제공할 수 있다.

> **알아두면 좋은 점**: modal 구현에서는 Parallel Routes가 표시 위치와 상태를, Intercepting Routes가 client navigation의 route 가로채기를 담당한다.

## 예제 및 데모 설계

- Phase 2에서 gallery의 사진 링크를 `@modal/(..)photo/[id]`로 intercept한다.
- 링크 클릭, 공유 URL 직접 진입, 새로고침, 뒤로·앞으로 이동을 각각 검증한다.

## 연습 문제

1. matcher depth 계산에서 제외되는 것은?
   - A. 다이나믹 세그먼트
   - B. `@slot` 폴더
   - C. 일반 route segment

<details><summary>정답 보기</summary>

정답: B. matcher는 file-system이 아니라 route segment를 센다.
</details>

## 챕터 요약

- Intercepting Routes는 다른 route를 현재 layout에서 보여준다.
- client navigation에서는 URL을 mask하고 맥락을 보존한다.
- 직접 진입·새로고침은 대상 full page를 렌더링한다.
- matcher는 route segment depth를 기준으로 한다.
- Parallel Routes와 결합하면 shareable modal을 만들 수 있다.
