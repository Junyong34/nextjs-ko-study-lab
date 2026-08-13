# loading.js

- 공식 문서: [loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `loading.js`가 생성하는 Suspense boundary와 instant loading state를 이해한다.
- streaming 중 내비게이션·SEO·상태 코드 동작을 설명한다.
- 레이아웃의 runtime 데이터에는 별도 Suspense가 필요한 이유를 이해한다.

## 핵심 개념 및 설명

### Instant Loading States와 동작

`loading.js`는 같은 폴더의 `page.js`와 하위 세그먼트를 `<Suspense>`로 감싼다. fallback은 prefetch되어 내비게이션 직후 표시될 수 있고, 새 콘텐츠가 스트리밍 완료되면 교체된다. 내비게이션은 중단 가능하며 공유 레이아웃은 계속 상호작용할 수 있다. 컴포넌트는 인자를 받지 않으며 기본값은 Server Component다.

```tsx
export default function Loading() {
  return <p>Loading...</p>
}
```

컴포넌트 계층에서 `loading.js`는 `not-found.js`, `page.js`, 중첩 `layout.js`를 감싸지만 같은 세그먼트의 `layout.js`, `template.js`, `error.js`는 감싸지 않는다.

### SEO와 상태 코드

정적 HTML만 읽는 bot에는 `generateMetadata`가 UI 스트리밍 전에 해결된다. 다른 user agent에는 스트리밍 metadata가 사용될 수 있으며 Next.js가 자동으로 선택한다. 스트리밍 응답은 헤더가 이미 전송되므로 성공을 나타내는 `200`을 반환한다. 이후 `redirect`나 `notFound`는 스트리밍된 콘텐츠에 meta tag를 주입해 클라이언트 동작과 검색 엔진 신호를 전달한다.

> **알아두면 좋은 점**: 레이아웃에서 `cookies()`, `headers()`, uncached fetch를 사용하면 그 아래의 `loading.js`는 레이아웃 fallback이 되지 못한다. Cache Components에서는 해당 접근을 별도 `<Suspense>`로 감싸야 하며, 그렇지 않으면 빌드 오류가 안내된다.

## 예제 및 데모 설계

- Phase 2에서 지연된 페이지와 skeleton `loading.tsx`를 만들고 즉시 표시·교체 과정을 관찰한다.
- 공유 레이아웃의 버튼이 하위 페이지 streaming 중에도 작동하는지 확인한다.
- layout fetching을 자체 Suspense 안팎에 놓고 내비게이션 차이를 비교한다.

## 연습 문제

1. `loading.js`가 자동으로 감싸지 않는 것은?
   - A. 같은 세그먼트의 `page.js`
   - B. 중첩 `layout.js`
   - C. 같은 세그먼트의 `layout.js`

<details><summary>정답 보기</summary>

정답: C. `loading.js`는 같은 세그먼트 레이아웃 아래에 위치한다.
</details>

## 챕터 요약

- `loading.js`는 라우트 세그먼트에 Suspense fallback을 제공한다.
- fallback은 prefetch되어 즉각적인 피드백을 줄 수 있다.
- 내비게이션은 중단 가능하고 공유 레이아웃은 상호작용을 유지한다.
- streaming 응답의 HTTP 상태 코드는 보통 `200`이다.
- 레이아웃의 runtime 데이터에는 자체 Suspense가 필요하다.
