# error.js

- 공식 문서: [error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 라우트 세그먼트의 예상하지 못한 오류를 `error.js`로 격리한다.
- `error`, `retry`, `reset`의 계약과 production 정보 은닉을 이해한다.
- root 오류와 컴포넌트 수준 오류 복구 방법을 구분한다.

## 핵심 개념 및 설명

### Error Boundary

`error.js`는 반드시 Client Component여야 하며 세그먼트와 하위 UI를 React Error Boundary로 감싼다. 같은 세그먼트의 `loading.js`, `not-found.js`, `page.js`, 중첩 layout을 감싸지만 위에 있는 `layout.js`와 `template.js`는 감싸지 않는다.

```tsx
'use client'

export default function Error({ error, retry }: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return <button onClick={() => retry()}>Try again</button>
}
```

### Props와 복구

Client Component에서 난 오류는 원래 message가 전달된다. Server Component 오류는 민감한 정보 노출을 막기 위해 production에서 일반 message와 `digest` 식별자로 바뀐다. `retry()`는 자식을 다시 fetching하고 렌더링한다. fetching 없이 오류 상태만 지울 특별한 이유가 있을 때만 `reset()`을 사용한다. 상위 boundary로 보내려면 오류 UI 렌더링 중 다시 `throw`한다.

### Global Error와 사용자 정의 boundary

root layout·template 오류는 `app/global-error.js`로 처리한다. 이 파일은 root layout을 대체하므로 `<html>`, `<body>`, 전역 스타일, 폰트를 직접 포함해야 한다. Client Component이므로 metadata export는 지원하지 않으며 React `<title>`을 사용할 수 있다. 라우트 세그먼트와 무관한 컴포넌트 수준 복구에는 `catchError`나 사용자 정의 Error Boundary를 사용한다.

> **알아두면 좋은 점**: 개발에서는 디버깅을 위해 원본 message가 직렬화되지만 production에서는 서버 오류 상세를 숨긴다.

## 예제 및 데모 설계

- Phase 2에서 의도적으로 오류를 내고 `retry()`가 성공한 렌더링으로 교체하는 흐름을 만든다.
- Server Component 오류의 `digest`를 서버 로그와 UI에 각각 기록한다.
- `global-error.tsx`가 전역 스타일과 `<html>/<body>`를 직접 포함하는지 확인한다.

## 연습 문제

1. `error.js`에 필요한 지시어는?
   - A. `'use cache'`
   - B. `'use client'`
   - C. `'use server'`

<details><summary>정답 보기</summary>

정답: B. Error Boundary UI는 Client Component여야 한다.
</details>

2. `retry()`와 `reset()`의 차이는?
   - A. `retry()`는 다시 fetching·렌더링하고 `reset()`은 fetching 없이 상태를 지운다.
   - B. 둘은 완전히 같다.
   - C. `reset()`만 production에서 쓸 수 있다.

<details><summary>정답 보기</summary>

정답: A. 대부분의 경우 새 결과를 시도하는 `retry()`가 권장된다.
</details>

## 챕터 요약

- `error.js`는 세그먼트별 예상하지 못한 오류를 격리한다.
- Error Boundary는 Client Component여야 한다.
- 서버 오류 상세는 production에서 `digest`로 숨겨진다.
- 대부분의 복구에는 `retry()`를 사용한다.
- root 오류는 완전한 문서를 반환하는 `global-error.js`가 처리한다.
