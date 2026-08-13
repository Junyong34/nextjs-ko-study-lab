# Dynamic Segments

- 공식 문서: [Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 단일·catch-all·optional catch-all 다이나믹 세그먼트를 설계한다.
- Promise `params`를 Server/Client Component에서 안전하게 읽는다.
- Cache Components와 `generateStaticParams`의 관계를 이해한다.

## 핵심 개념 및 설명

### Convention과 params

미리 알 수 없는 path 값을 `[slug]` 폴더로 캡처한다. `[...slug]`는 하나 이상의 나머지 세그먼트를 `string[]`로 받고, `[[...slug]]`는 값이 없는 base route까지 포함해 `string[] | undefined`가 된다. 값은 `layout`, `page`, `route`, `generateMetadata`의 Promise `params`로 전달된다.

```tsx
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  return <div>{slug}</div>
}
```

Client Component 페이지는 React `use(params)`를 사용하거나 컴포넌트 트리 어디서든 `useParams`를 사용할 수 있다. route helper 타입은 사용자 입력이 runtime에 정해진다는 사실을 반영해 넓은 string 계열 타입을 사용한다. 값의 집합이 제한되어 있으면 runtime validation 후 타입을 좁힌다.

### Cache Components

`generateStaticParams`가 없으면 params는 prerender 중 알 수 없는 runtime 데이터이므로 접근 지점을 `<Suspense>`로 감싼다. 함수가 sample params를 제공하면 빌드가 해당 경로를 실행해 static HTML과 runtime API 사용을 검증한다. sample에 포함되지 않은 조건 분기는 첫 요청 때 검증되므로 모든 runtime 데이터 접근을 올바른 boundary 안에 둬야 한다.

> **알아두면 좋은 점**: 다이나믹 세그먼트는 path params, route params, URL params라고도 부른다.

## 예제 및 데모 설계

- Phase 2에서 `[slug]`, `[...slug]`, `[[...slug]]`가 만드는 URL과 params를 표로 출력한다.
- locale params를 runtime validation하고 잘못된 값은 `notFound()`로 처리한다.
- `generateStaticParams` 유무에 따른 build 결과와 Suspense 요구를 비교한다.

## 연습 문제

1. `/shop` 자체와 모든 하위 경로를 함께 매칭하는 폴더는?
   - A. `[slug]`
   - B. `[...slug]`
   - C. `[[...slug]]`

<details><summary>정답 보기</summary>

정답: C. optional catch-all은 parameter 없는 base route도 매칭한다.
</details>

## 챕터 요약

- `[slug]`는 단일 다이나믹 세그먼트를 캡처한다.
- `[...slug]`와 `[[...slug]]`는 여러 세그먼트를 배열로 받는다.
- `params`는 Promise다.
- 제한된 값은 runtime validation으로 좁힌다.
- Cache Components에서는 prerender 가능 여부에 맞춰 Suspense와 sample params를 설계한다.
