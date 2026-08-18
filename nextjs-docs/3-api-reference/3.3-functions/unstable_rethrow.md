# unstable_rethrow

- 공식 문서: [unstable_rethrow](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `try/catch` 문 내부에서 Next.js 내부 제어 예외가 의도치 않게 가로채지는 문제를 해결하는 `unstable_rethrow` 함수의 역할을 이해한다.
- [`notFound()`](./not-found.md), [`redirect()`](./redirect.md), [`forbidden()`](./forbidden.md) 등 예외를 던져 동작하는 Next.js 프레임워크 API 목록을 파악한다.
- `catch (err)` 블록의 최상단에서 `unstable_rethrow(err)`를 호출하여 일반 에러만 처리하고 프레임워크 흐름을 보존하는 패턴을 습득한다.
- `finally` 블록을 활용하여 안전한 자원 해제(Cleanup) 로직을 구성한다.

## 핵심 개념 및 설명

`unstable_rethrow`는 개발자가 작성한 애플리케이션 코드의 `try/catch` 문이 Next.js의 내부 제어 예외까지 잘못 가로채는 것을 방지하기 위해, 해당 프레임워크 예외를 다시 던져(re-throw) Next.js가 정상적으로 흐름을 제어할 수 있도록 돕는 유틸리티다.

예를 들어, `notFound()`나 `redirect()`는 내부적으로 특수 에러를 던져 동작하므로, `try/catch`로 무작정 감싸면 404 페이지나 리다이렉트가 동작하지 않는 버그가 발생한다.

```tsx filename="app/page.tsx" switcher
import { notFound, unstable_rethrow } from 'next/navigation'

export default async function Page() {
  try {
    const post = await fetch('https://api.example.com/posts/1').then((res) => {
      if (res.status === 404) notFound() // 404 예외 발생
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
    return <div>{post.title}</div>
  } catch (err) {
    // ⭕ Next.js 내부 예외(notFound, redirect 등)라면 다시 던져 상위로 전파
    unstable_rethrow(err)

    // 일반 애플리케이션 에러만 여기서 로깅 및 처리
    console.error('일반 네트워크 또는 비즈니스 에러:', err)
    return <div>오류가 발생했습니다.</div>
  }
}
```

```jsx filename="app/page.js" switcher
import { notFound, unstable_rethrow } from 'next/navigation'

export default async function Page() {
  try {
    const post = await fetch('https://api.example.com/posts/1').then((res) => {
      if (res.status === 404) notFound()
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
    return <div>{post.title}</div>
  } catch (err) {
    unstable_rethrow(err)
    console.error('일반 네트워크 또는 비즈니스 에러:', err)
    return <div>오류가 발생했습니다.</div>
  }
}
```

### Next.js가 예외를 통해 제어하는 주요 API

- [`notFound()`](./not-found.md)
- [`redirect()`](./redirect.md) / [`permanentRedirect()`](./permanentRedirect.md)
- [`forbidden()`](./forbidden.md) / [`unauthorized()`](./unauthorized.md)
- 정적 라우트 검사 단계에서의 요청 시점 API (`cookies()`, `headers()` 등)

> **알아두면 좋은 점**:
>
> - `unstable_rethrow(err)`는 항상 `catch` 블록의 **최상단**에서 호출해야 한다.
> - 타이머 해제, 리소스 정리 등의 클린업 작업은 `unstable_rethrow` 호출 이전 또는 `finally` 블록 내에서 처리해야 한다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v14.0.0` | `unstable_rethrow` 도입 |

## 예제 및 데모 설계

- `try/catch` 블록 안에서 `notFound()`가 호출될 때, `unstable_rethrow`가 없을 때 404 페이지 대신 일반 catch 에러 메시지가 렌더링되는 문제와, 추가했을 때 정상 404 페이지로 전환되는 차이를 비교 검증한다.
- `redirect()` 호출이 포함된 비동기 로직에서 `unstable_rethrow`를 통해 리다이렉트가 정상 실행되는지 테스트한다.

## 연습 문제

1. `unstable_rethrow`를 호출해야 하는 가장 올바른 위치는?
   - A. `try` 블록의 가장 첫 번째 줄
   - B. `catch (err)` 블록의 가장 첫 번째 줄
   - C. `finally` 블록 내부
   - D. 컴포넌트의 반환 JSX 내부

<details><summary>정답 보기</summary>

정답: **B**  
해설: 포착된 에러가 Next.js의 내부 제어 예외인지 확인하고 즉시 다시 던지기 위해 `catch (err)` 블록의 최상단에서 실행해야 한다.
</details>

2. 다음 중 `unstable_rethrow`를 통해 보호해야 하는 Next.js의 예외 기반 API가 **아닌** 것은?
   - A. `notFound()`
   - B. `redirect()`
   - C. `usePathname()`
   - D. `forbidden()`

<details><summary>정답 보기</summary>

정답: **C**  
해설: `usePathname()`은 클라이언트 훅이며 예외를 던져 제어 흐름을 바꾸는 API가 아니다. `notFound`, `redirect`, `forbidden` 등은 내부 예외를 발생시킨다.
</details>

## 챕터 요약

- `unstable_rethrow`는 `try/catch` 문에서 Next.js의 프레임워크 제어 예외를 안전하게 재전파하는 유틸리티다.
- `notFound()`, `redirect()`, `forbidden()` 등이 일반 에러 핸들러에 삼켜지는 문제를 방지한다.
- `catch (err)` 블록 최상단에서 호출하는 것이 표준 패턴이다.
- 자원 정리는 `finally` 블록에서 처리한다.
