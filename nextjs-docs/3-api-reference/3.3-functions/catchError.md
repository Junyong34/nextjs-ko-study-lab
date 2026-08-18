# catchError

- 공식 문서: [catchError](https://nextjs.org/docs/app/api-reference/functions/catchError)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js의 `catchError` API를 사용하여 React 컴포넌트 하위 트리에서 발생하는 에러를 세밀하게 포착하고 격리하는 방법을 익힌다.
- `error.js` 파일 기반 전역 에러 바운더리와 인라인 `catchError` 함수의 역할 차이 및 상호 보완 패턴을 이해한다.
- 에러 발생 시 `retry()` 콜백을 통한 복구(Recovery) 흐름 및 서버 렌더링 에러 폴백을 구현한다.

## 핵심 개념 및 설명

`catchError`는 React 19 및 Next.js에서 제공하는 선언적 에러 격리 함수로, 특정 컴포넌트나 위젯 영역의 에러를 포착하여 전체 페이지 붕괴 없이 대체 폴백 UI를 렌더링하고 복구 메커니즘을 제공한다.

```tsx filename="app/dashboard/page.tsx"
import { catchError } from 'next/error'

async function DynamicWidget() {
  const data = await fetch('https://api.example.com/widget-data').then((res) => {
    if (!res.ok) throw new Error('위젯 데이터를 불러오지 못했습니다.')
    return res.json()
  })
  return <div>위젯: {data.value}</div>
}

export default function DashboardPage() {
  return (
    <main>
      <h1>대시보드</h1>
      {catchError(
        <DynamicWidget />,
        ({ error, reset }) => (
          <div className="error-box">
            <p>위젯 로드 실패: {error.message}</p>
            <button onClick={() => reset()}>다시 시도</button>
          </div>
        )
      )}
    </main>
  )
}
```

---

### 매개변수 및 `ErrorInfo` 인터페이스

`catchError(children, fallback)`

1. **`children`**: 보호할 대상 React 노드(컴포넌트)
2. **`fallback`**: 에러 발생 시 렌더링할 콜백 함수 `({ error, reset }) => ReactNode`
   - `error`: 포착된 `Error` 객체
   - `reset`: 에러 상태를 초기화하고 컴포넌트를 다시 렌더링(re-render)하는 함수

---

### 에러 복구(Recovering from Errors) 및 서버 렌더링 에러 폴백

1. **에러 복구 (`reset()`)**: 클라이언트 상호작용 중 발생한 일시적 네트워크 오류나 렌더 오류 발생 시, 사용자가 '다시 시도' 버튼을 클릭하면 `reset()`을 호출해 해당 서브트리만 다시 렌더링을 시도한다.
2. **서버 렌더링 에러 폴백**: Server Component 렌더링 중 에러가 발생하더라도 페이지 전체가 중단되지 않고 `catchError`의 폴백 UI가 서버에서 즉시 HTML로 렌더링되어 전송된다.

---

### `catchError` vs `error.js` 비교

| 구분 | `catchError` | `error.js` |
|---|---|---|
| **범위** | 개별 컴포넌트/위젯 단위 (세밀한 인라인 격리) | 라우트 세그먼트 전체 (`page.js` 전체를 대체) |
| **선언 방식** | JSX 코드 내 인라인 함수 호출 | 파일 시스템 컨벤션 (`error.tsx`) |
| **적용 시점** | 특정 위젯 오류가 주변 UI에 영향을 주지 않아야 할 때 | 페이지 전체의 치명적 오류 처리 |

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | React 19 호환 인라인 에러 격리 API `catchError` 도입 |

## 예제 및 데모 설계

- 대시보드에 여러 개의 독립적인 위젯을 배치하고, 하나의 위젯이 에러를 발생시켜도 나머지 위젯은 정상 표시되는지 격리 동작을 테스트한다.
- `reset()` 버튼을 클릭했을 때 Server Component 재요청이 발생하여 정상 UI로 회복되는 과정을 검증한다.

## 연습 문제

1. `catchError`의 폴백 콜백 함수에서 제공하는 두 가지 핵심 매개변수는?
   - A. `(error, reset)`
   - B. `(error, state)`
   - C. `(event, retry)`
   - D. `(status, redirect)`

<details><summary>정답 보기</summary>

정답: **A**  
해설: `catchError`의 폴백 함수는 포착된 에러 객체 `error`와 상태를 초기화하고 재시도하는 `reset` 함수를 인자로 받는다.
</details>

## 챕터 요약

- `catchError`는 인라인 컴포넌트 단위로 에러를 격리하여 페이지 전체 붕괴를 방지한다.
- `fallback` 콜백을 통해 에러 메시지 출력 및 `reset()` 기반 재시도 UI를 구성할 수 있다.
- 라우트 세그먼트 전체를 감싸는 `error.js`와 함께 계층형 에러 처리 전략을 완성한다.
