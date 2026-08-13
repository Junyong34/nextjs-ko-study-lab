# unauthorized.js

- 공식 문서: [unauthorized.js](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 인증되지 않은 요청에 401과 로그인 UI를 제공한다.
- `unauthorized()` 호출과 파일 UI의 책임을 구분한다.

## 핵심 개념 및 설명

> **주의**: 이 기능은 experimental이며 변경될 수 있어 production 사용을 권장하지 않는다.

인증 과정에서 session이 없을 때 `unauthorized()`를 호출하면 `unauthorized.js`가 렌더링되고 Next.js는 `401`을 반환한다. 이 파일은 props를 받지 않으며 로그인 form이나 인증 안내를 포함할 수 있다.

```tsx
export default function Unauthorized() {
  return <main><h1>401 - Unauthorized</h1><Login /></main>
}
```

권한 검사 함수는 session 부재를 결정하고, 특수 파일은 사용자에게 다시 인증할 방법을 제공한다. 인증됐지만 권한이 부족한 경우에는 `forbidden()`과 `forbidden.js`를 사용한다.

## 예제 및 데모 설계

- Phase 2에서 dashboard 진입 전 session을 검사하고 없으면 로그인 UI를 표시한다.
- 401과 403 시나리오를 나란히 테스트한다.

## 연습 문제

1. 로그인하지 않은 사용자에게 맞는 상태는?
   - A. 401
   - B. 403
   - C. 500

<details><summary>정답 보기</summary>

정답: A. `unauthorized.js`는 인증되지 않은 요청을 처리한다.
</details>

## 챕터 요약

- `unauthorized.js`는 `unauthorized()`의 UI다.
- 응답 상태 코드는 401이다.
- 로그인 UI를 제공할 수 있다.
- 403 권한 부족과 구분한다.
- 현재 experimental이다.
