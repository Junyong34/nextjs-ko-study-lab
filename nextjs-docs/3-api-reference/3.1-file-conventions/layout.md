# layout.js

- 공식 문서: [layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 라우트 세그먼트 사이에서 UI를 공유하고 상태를 보존하는 `layout.js`의 역할을 설명한다.
- 루트 레이아웃의 필수 계약과 `children`, `params`, `LayoutProps` 사용법을 구분한다.
- 레이아웃이 재렌더링되지 않는 특성 때문에 생기는 요청·URL 접근 제약을 다룬다.

## 핵심 개념 및 설명

### 레이아웃과 컴포넌트 계층

`layout.js`는 한 라우트 세그먼트의 가장 바깥 컴포넌트다. 같은 세그먼트의 `template.js`, `error.js`, `loading.js`, `not-found.js`, `page.js`를 감싸며 내비게이션 중에도 상태를 유지하고 다시 렌더링되지 않는다.

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>
}
```

### props와 타입 헬퍼

`children`은 필수이며 하위 레이아웃·페이지·특수 파일의 UI가 들어온다. `params`는 루트부터 현재 레이아웃까지의 다이나믹 params를 담은 Promise다. `LayoutProps<'/dashboard'>`를 사용하면 `params`와 Parallel Routes의 named slot 타입을 디렉터리 구조에서 추론할 수 있다. 타입은 `next dev`, `next build`, `next typegen` 때 생성된다.

### Root Layout

`app`에는 최상위 root layout이 반드시 있어야 하며 `<html>`과 `<body>`를 정의해야 한다. `<head>`를 직접 작성하지 않고 Metadata API를 사용한다. Route Groups나 하위 디렉터리에 여러 root layout을 둘 수 있지만 서로 다른 root layout 사이를 이동하면 전체 페이지가 로드된다.

### 주의사항

- 레이아웃은 raw Request 객체를 받지 않는다. 서버에서는 `headers()`와 `cookies()`를 사용한다.
- 내비게이션 때 재렌더링되지 않으므로 최신 query params나 pathname을 직접 읽지 않는다. 페이지의 `searchParams`, Client Component의 `useSearchParams`·`usePathname`을 사용한다.
- `loading.js`는 레이아웃 아래에 있으므로 레이아웃 자체의 runtime 데이터 접근을 감싸지 못한다. 별도 `<Suspense>`를 두거나 fetching을 `page.js`로 옮긴다.
- 레이아웃은 `children`에 데이터를 주입하지 않는다. 같은 요청을 다시 가져오고 React `cache` 또는 Next.js `fetch` 중복 제거를 활용한다.
- 하위 세그먼트는 Client Component에서 `useSelectedLayoutSegment(s)`로 읽는다.

## 예제 및 데모 설계

- Phase 2에서 대시보드 공통 내비게이션을 `layout.tsx`에 두고 페이지 이동 뒤에도 입력 상태가 유지되는지 확인한다.
- 다이나믹 `[team]` 레이아웃에서 `await params`와 `LayoutProps` 타입 추론을 비교한다.
- 레이아웃의 runtime 데이터 접근을 자체 `<Suspense>`로 감싼 경우와 그렇지 않은 경우의 내비게이션을 비교한다.

## 연습 문제

1. root layout이 반드시 반환해야 하는 태그는?
   - A. `<head>`와 `<main>`
   - B. `<html>`과 `<body>`
   - C. `<title>`과 `<meta>`

<details><summary>정답 보기</summary>

정답: B. root layout은 `<html>`과 `<body>`를 정의해야 한다.
</details>

2. 내비게이션 뒤 최신 query string을 읽는 적절한 방법은?
   - A. 레이아웃의 `searchParams` prop
   - B. Client Component의 `useSearchParams`
   - C. raw Request prop

<details><summary>정답 보기</summary>

정답: B. 레이아웃은 재렌더링되지 않으므로 Client Component에서 훅을 사용한다.
</details>

## 챕터 요약

- `layout.js`는 세그먼트의 공유 UI와 상태를 보존한다.
- root layout은 필수이며 `<html>`과 `<body>`를 정의한다.
- `params`는 Promise이고 `LayoutProps`로 타입을 생성할 수 있다.
- 최신 pathname과 query params는 Client Component에서 읽는다.
- 레이아웃의 runtime 데이터는 자체 Suspense boundary로 감싼다.
