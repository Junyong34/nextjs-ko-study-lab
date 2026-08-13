# default.js

- 공식 문서: [default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Parallel Routes에서 `default.js`가 필요한 hard navigation 상황을 설명한다.
- named slot과 암시적 `children` slot의 fallback 계약을 이해한다.

## 핵심 개념 및 설명

`default.js`는 전체 페이지 로드 뒤 Next.js가 Parallel Routes slot의 활성 상태를 복구하지 못할 때 fallback을 렌더링한다. soft navigation에서는 각 slot의 활성 subpage가 클라이언트에 유지되지만 새로고침 같은 hard navigation에서는 URL과 일치하지 않는 slot 상태를 알 수 없다.

named slot에 `default.js`가 없으면 오류가 발생한다. 이전처럼 404를 원하면 fallback 안에서 `notFound()`를 호출한다. `children`도 암시적 slot이므로 부모 페이지의 활성 상태를 복구할 수 없는 구조라면 `default.js`가 필요하며, 없으면 404를 반환한다.

선택적 `params` prop은 root부터 slot subpage까지의 다이나믹 params를 담은 Promise다.

```tsx
export default function Default() {
  return null
}
```

## 예제 및 데모 설계

- Phase 2에서 `@team`과 `@analytics` slot을 만들고 `/settings` 이동 후 새로고침 결과를 비교한다.
- 한 slot의 `default.tsx`를 제거해 오류 또는 404 fallback을 관찰한다.

## 연습 문제

1. `default.js`가 주로 필요한 시점은?
   - A. soft navigation에서 항상
   - B. hard navigation 뒤 slot 상태를 복구할 수 없을 때
   - C. 빌드 설정을 읽을 때

<details><summary>정답 보기</summary>

정답: B. URL과 맞지 않는 slot의 fallback을 제공한다.
</details>

## 챕터 요약

- `default.js`는 Parallel Routes의 복구 불가능한 slot fallback이다.
- soft navigation은 활성 slot 상태를 유지한다.
- hard navigation은 URL과 맞지 않는 slot 상태를 복구하지 못한다.
- `children`도 암시적 slot이다.
- `params`는 Promise로 전달될 수 있다.
