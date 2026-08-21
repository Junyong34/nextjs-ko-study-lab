# template.js

- 공식 문서: [template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 상태를 보존하는 layout과 매번 새 인스턴스를 만드는 template을 구분한다.
- template이 필요한 reset·effect·fallback 시나리오를 판단한다.

## 핵심 개념 및 설명

**템플릿** 파일은 레이아웃이나 페이지를 래핑한다는 점에서 [레이아웃](../../1-getting-started/layouts-and-pages.md#creating-a-layout)과 유사하다. 여러 경로에 걸쳐 유지되고 상태를 유지하는 레이아웃과 달리 템플릿에는 고유한 키가 제공된다. 즉, 하위 Client Component가 탐색 시 상태를 재설정한다.

다음과 같은 경우에 유용하다.

- 탐색 시 `useEffect`를 다시 동기화한다.
- 탐색 시 하위 Client Component의 상태를 재설정한다. 예를 들어 입력 필드이다.
- 기본 프레임워크 동작을 변경한다. 예를 들어 레이아웃 내부의 Suspense 경계는 첫 번째 로드 시에만 대체를 표시하는 반면 템플릿은 모든 탐색에 이를 표시한다.

<a id="convention"></a>
### 규칙

템플릿은 `template.js` 파일에서 기본 React 컴포넌트를 내보내 정의할 수 있다. 컴포넌트는 `children` prop을 허용해야 한다.

![template.js 특수 파일](./assets/template-01.webp)

```tsx filename="app/template.tsx" switcher
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```jsx filename="app/template.js" switcher
export default function Template({ children }) {
  return <div>{children}</div>
}
```

중첩 측면에서 `template.js`는 레이아웃과 해당 하위 항목 사이에 렌더링된다. 다음은 단순화된 출력이다.

```jsx filename="Output"
```tsx
<Layout>

<Template key={routeParam}>{children}</Template></Layout>
```jsx filename="Output"
```

[컴포넌트 계층 구조](../../1-getting-started/project-structure.md#component-hierarchy)에서 `template.js`는 `layout.js`와 `error.js` 사이를 렌더링한다.`error.js`,`loading.js`,`not-found.js` 및 `page.js`를 래핑하지만 동일한 세그먼트에서 `layout.js`를 래핑하지 **않는다**.

<a id="props"></a>
### prop

<a id="children-required"></a>
#### `children`(필수)

템플릿은 `children` prop을 허용한다.

```jsx filename="Output"
```tsx
<Layout>

<Template key={routeParam}>{children}</Template></Layout>
```jsx filename="Output"
```

<a id="behavior"></a>
### 동작

- **Server Component**: 기본적으로 템플릿은 Server Component이다.
- **탐색 포함**: 템플릿은 자체 세그먼트 수준에 대한 고유 키를 받는다. 해당 세그먼트(다이나믹 params 포함)가 변경되면 다시 마운트된다. 더 깊은 세그먼트 내의 탐색은 더 높은 수준의 템플릿을 다시 마운트하지 않는다. 검색 매개변수는 다시 마운트를 트리거하지 않는다.
- **상태 재설정**: 템플릿 내부의 모든 Client Component는 탐색 시 상태를 재설정한다.
- **효과 재실행**:`useEffect`와 같은 효과는 컴포넌트가 다시 마운트될 때 다시 동기화된다.
- **DOM 재설정**: 템플릿 내부의 DOM 요소가 완전히 다시 생성된다.

<a id="templates-during-navigation-and-remounting"></a>
#### 탐색 및 다시 마운트 중 템플릿

이 섹션에서는 탐색 중에 템플릿이 작동하는 방식을 보여준다. 각 경로 변경 시 다시 탑재되는 템플릿과 그 이유를 단계별로 보여준다.

이 프로젝트 트리를 사용하여:

```
app
├── about
│   ├── page.tsx
├── blog
│   ├── [slug]
│   │   └── page.tsx
│   ├── page.tsx
│   └── template.tsx
├── layout.tsx
├── page.tsx
└── template.tsx
```

`/`부터 시작하는 React 트리는 대략 다음과 같다.

> 참고: 예제에 표시된 `key` 값은 예시일 뿐이며 애플리케이션의 값은 다를 수 있다.

```jsx filename="Output"
```tsx
<RootLayout>

<Template key="/"><Page /></Template></RootLayout>
```jsx filename="Output"
```

`/about`(첫 번째 세그먼트 변경)로 이동하면 루트 템플릿 키가 변경되고 다시 마운트된다.

```jsx filename="Output"
```tsx
<RootLayout>

<Template key="/about"><AboutPage /></Template></RootLayout>
```
```

`/blog`(첫 번째 세그먼트 변경)로 이동하면 루트 템플릿 키가 변경되고 다시 마운트되고 블로그 수준 템플릿이 마운트된다.

```jsx filename="Output"
```tsx
<RootLayout>

<Template key="/blog">

<Template key="/blog"><BlogIndexPage /></Template></Template></RootLayout>
```
```

동일한 첫 번째 세그먼트 내에서 `/blog/first-post`(하위 세그먼트 변경)로 이동하면 루트 템플릿 키는 변경되지 않지만 블로그 수준 템플릿 키는 변경되어 다시 마운트된다.

```jsx filename="Output"
```tsx
<RootLayout>

<Template key="/blog">

<Template key="/blog/first-post"><BlogPostPage slug="first-post" /></Template></Template></RootLayout>
```
```

`/blog/second-post`(동일한 첫 번째 세그먼트, 다른 하위 세그먼트)로 이동하면 루트 템플릿 키는 변경되지 않지만 블로그 수준 템플릿 키는 변경되어 다시 마운트된다.

```jsx filename="Output"
```tsx
<RootLayout>

<Template key="/blog">

<Template key="/blog/second-post"><BlogPostPage slug="second-post" /></Template></Template></RootLayout>
```
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ---------------------- |
| `v13.0.0` | `template`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 같은 입력 폼을 layout과 template에 각각 두고 page 이동 뒤 값 보존 여부를 비교한다.
- `useEffect` mount log와 Suspense fallback 횟수를 기록한다.

## 연습 문제

1. 내비게이션마다 Client Component state를 초기화하려면?
   - A. `layout.js`
   - B. `template.js`
   - C. `default.js`

<details><summary>정답 보기</summary>

정답: B. template은 child별 key로 새 인스턴스를 mount한다.
</details>

## 챕터 요약

- template은 구조상 layout과 비슷하지만 내비게이션 때 remount된다.
- template 안의 state는 보존되지 않는다.
- effect와 Suspense fallback이 다시 실행된다.
- 기본 선택은 layout이며 명시적인 reset이 필요할 때 template을 쓴다.
