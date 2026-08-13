# forbidden.js

- 공식 문서: [forbidden.js](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 인증은 되었지만 권한이 없는 요청에 403 UI를 제공한다.
- experimental 기능이라는 제약과 props 계약을 이해한다.

## 핵심 개념 및 설명

> **주의**: 이 기능은 experimental이며 변경될 수 있어 production 사용을 권장하지 않는다.

인증 흐름에서 `forbidden()`을 호출하면 `forbidden.js`가 사용자 정의 UI를 렌더링하고 Next.js는 `403`을 반환한다. 컴포넌트는 props를 받지 않는다. 로그인하지 않은 사용자의 401과, 신원은 확인됐지만 자원 접근 권한이 없는 403을 구분한다.

```tsx
export default function Forbidden() {
  return <main><h1>403 - Forbidden</h1></main>
}
```

## 예제 및 데모 설계

- Phase 2에서 일반 사용자가 관리자 route를 열 때 `forbidden()`을 호출한다.
- UI와 network status가 모두 403인지 확인한다.

## 연습 문제

1. `forbidden.js`가 대응하는 상태 코드는?
   - A. 401
   - B. 403
   - C. 404

<details><summary>정답 보기</summary>

정답: B. 인증됐지만 권한이 없는 접근을 나타낸다.
</details>

## 챕터 요약

- `forbidden.js`는 `forbidden()`의 UI다.
- 응답 상태 코드는 403이다.
- 컴포넌트는 props를 받지 않는다.
- 현재 experimental이며 production 사용은 권장되지 않는다.
