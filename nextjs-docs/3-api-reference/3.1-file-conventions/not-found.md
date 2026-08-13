# not-found.js

- 공식 문서: [not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `not-found.js`와 실험적인 `global-not-found.js`의 적용 범위를 구분한다.
- streaming 여부에 따른 상태 코드와 metadata 동작을 이해한다.
- 404 UI에서 데이터 fetching과 테마를 다루는 방법을 익힌다.

## 핵심 개념 및 설명

### `not-found.js`

라우트 세그먼트에서 `notFound()`가 발생하면 가장 가까운 `not-found.js`가 렌더링된다. 스트리밍 응답은 `200`, 스트리밍이 아닌 응답은 `404`를 반환한다. 이 파일은 기본적으로 Server Component라서 `async`로 데이터를 가져올 수 있으며 props는 받지 않는다. Client Component 훅이 필요하면 클라이언트에서 데이터를 가져온다.

### `global-not-found.js` (experimental)

일치하는 라우트가 전혀 없을 때 라우팅 수준에서 앱 전체 404를 반환한다. 여러 root layout이 있거나 root layout이 최상위 다이나믹 세그먼트 아래에 있을 때 유용하다. `experimental.globalNotFound`를 켜야 하며, layout을 거치지 않으므로 `<html>`과 `<body>`, 스타일, 폰트, 테마를 직접 포함해야 한다.

```tsx
export default function GlobalNotFound() {
  return <html lang="ko"><body><h1>404</h1></body></html>
}
```

### Metadata와 테마

`global-not-found.js`는 `metadata` 또는 `generateMetadata`를 export할 수 있다. Next.js는 404 응답에 `noindex` robots meta를 자동으로 주입한다. 기본 404 UI는 OS color scheme만 따르므로 앱의 명시적 테마가 필요하면 사용자 정의 파일에서 적용한다.

> **알아두면 좋은 점**: root `app/not-found.js`와 `app/global-not-found.js`는 앱 전체의 일치하지 않는 URL도 처리한다.

## 예제 및 데모 설계

- Phase 2에서 상품이 없을 때 `notFound()`를 호출하고 세그먼트 404 UI를 표시한다.
- 직접 입력·새로고침과 클라이언트 내비게이션에서 상태 코드와 UI를 비교한다.
- 다중 root layout 구조에서 `global-not-found.tsx`의 전역 스타일 포함 여부를 확인한다.

## 연습 문제

1. `global-not-found.js`가 반드시 직접 반환해야 하는 것은?
   - A. `<html>`과 `<body>`
   - B. `children` prop
   - C. `reset()` 함수

<details><summary>정답 보기</summary>

정답: A. 앱 layout 렌더링을 건너뛰므로 완전한 HTML 문서가 필요하다.
</details>

## 챕터 요약

- `not-found.js`는 세그먼트에서 `notFound()` 결과를 렌더링한다.
- streaming 404 UI는 HTTP `200`을 반환할 수 있다.
- `global-not-found.js`는 일치하지 않는 URL을 routing 수준에서 처리한다.
- 전역 404는 HTML 문서와 스타일·테마를 직접 포함한다.
- Next.js는 실제 404 응답에 `noindex`를 자동 주입한다.
