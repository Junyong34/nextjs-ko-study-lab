# forbidden.js

- 공식 문서: [forbidden.js](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 인증은 되었지만 권한이 없는 요청에 403 UI를 제공한다.
- experimental 기능이라는 제약과 props 계약을 이해한다.

## 핵심 개념 및 설명

**forbidden** 파일은 인증 시 [`forbidden`](../3.3-functions/forbidden.md) 함수가 호출될 때 UI를 렌더링하는 데 사용된다. UI를 사용자 정의할 수 있는 것과 함께 Next.js는 `403` 상태 코드를 반환한다.

```tsx filename="app/forbidden.tsx" switcher
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

```jsx filename="app/forbidden.jsx" switcher
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

<a id="reference"></a>
### 참조

<a id="props"></a>
#### prop

`forbidden.js` 컴포넌트는 prop을 허용하지 않는다.

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | -------------------------- |
| `v15.1.0` | `forbidden.js`가 출시되었다. |

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
