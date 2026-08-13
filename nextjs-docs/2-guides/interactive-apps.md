# Interactive apps

- 공식 문서: [Interactive apps](https://nextjs.org/docs/app/guides/interactive-apps)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 서버 작업을 기다리는 동안 사용자에게 즉각적이고 정확한 피드백을 제공할 수 있다.
- `Suspense`, `useOptimistic`, `useTransition`, `useActionState`의 역할을 구분할 수 있다.
- `data-pending`, Cache Components, `prefetch={true}`를 조합해 상위 UI와 반복 내비게이션을 최적화할 수 있다.

## 핵심 개념 및 설명

사용자 상호작용이 서버 작업을 요구하면 결과는 즉시 도착하지 않는다. 네트워크 요청은 완료 시간이 일정하지 않고 성공하거나 실패할 수 있다. 기다리는 동안 클라이언트가 상태를 알리지 않으면 사용자는 오래된 데이터를 보며 작업이 진행 중인지 판단하기 어렵다.

### 예제

공식 예제 Taskboard는 느린 읽기를 스트리밍하는 단계부터 mutation을 서버가 확인하기 전에 결과를 보여주는 단계까지 순서대로 확장한다. Server Function은 mutation 뒤에 [`refresh()`](../3-api-reference/3.3-functions/refresh.md)를 호출해 서버를 최신 데이터로 다시 렌더링한다.

> **알아두면 좋은 점**: `Suspense` 스트리밍은 느린 읽기가 끝나는 동안 셸을 먼저 그려 FCP와 LCP를 낮춘다. 낙관적 UI와 transition은 클릭 프레임을 빠르게 유지해 INP를 낮춘다. 다만 클라이언트 JavaScript를 줄이고 상호작용 중 블로킹 왕복 요청을 피하는 기본 INP 최적화도 계속 필요하다.

### 1단계: 느린 데이터를 `Suspense`로 스트리밍하기

페이지 최상위에서 모든 데이터를 `await`하면 가장 느린 읽기가 끝날 때까지 전체 화면이 막힌다. 각 읽기를 별도 컴포넌트로 나누고 `Suspense`로 감싸면 페이지는 셸을 즉시 반환하고, 서버는 준비된 섹션부터 스트리밍한다.

```tsx
import { Suspense } from 'react'

export default function TaskPage({ params }) {
  return (
    <Suspense fallback={<TaskDetailSkeleton />}>
      {params.then(({ id }) => (
        <>
          <TaskDetail id={id} />
          <Suspense fallback={<CommentSectionSkeleton />}>
            <CommentSection taskId={id} />
          </Suspense>
        </>
      ))}
    </Suspense>
  )
}
```

인라인 `params.then()`은 페이지를 동기 컴포넌트로 유지한다. 바깥 boundary는 `params`와 작업 상세를 기다리고, 상세가 나타난 뒤 안쪽 boundary가 댓글 skeleton을 보여준다. 더 많은 패턴은 [Streaming](./streaming.md)에서 다룬다.

### 2단계: 토글에 즉시 반응하기

`useOptimistic`은 서버가 넘긴 오래된 prop 대신 transition이 진행되는 동안 표시할 임시 값을 제공한다. `useTransition`은 Server Function을 transition 안에서 실행하고, 오류가 발생하면 가까운 error boundary로 전달한다.

```tsx
'use client'

import { useOptimistic, useTransition } from 'react'

export function TaskCard({ id, priority }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority)
  const [, startTransition] = useTransition()

  function handlePriority() {
    startTransition(async () => {
      setOptimisticPriority(PRIORITY_CYCLE[optimisticPriority])
      await cyclePriority(id)
    })
  }

  return <button onClick={handlePriority}>{optimisticPriority}</button>
}
```

현재 `optimisticPriority`를 기준으로 다음 값을 계산하면 빠르게 연속 클릭해도 오래된 closure 값을 읽지 않는다. 서버 렌더링이 도착하면 임시 값은 최신 prop으로 바뀐다.

### 3단계: 필터에 대기 피드백 제공하기

필터 컴포넌트는 목적 URL을 결정하고, 재사용 가능한 `ChipGroup`은 콜백 prop을 transition 안에서 실행한다. `useOptimistic`으로 선택된 칩과 `data-pending`을 즉시 갱신하면 조상은 상태를 끌어올리지 않고 CSS로 보드를 흐리게 할 수 있다.

```tsx
function handleClick(newValue) {
  startTransition(async () => {
    setOptimisticValue(newValue)
    setIsPending(true)
    await changeAction(newValue)
  })
}

return <div data-pending={isPending ? '' : undefined}>{/* chips */}</div>
```

`action` 또는 `Action` 접미사로 이름 붙인 prop은 소비자 컴포넌트가 해당 콜백을 transition 안에서 호출한다는 관례를 드러낸다.

> **알아두면 좋은 점**: Tailwind의 `group-has-data-pending:`과 `has-data-pending:`은 CSS `:has()` 선택자로 컴파일된다. 필터처럼 낮은 빈도로 상태가 바뀌는 좁은 트리에는 적합하다. 드래그나 스크롤처럼 넓은 트리에서 고빈도로 바뀌는 상호작용에는 클라이언트 상태를 사용하는 편이 낫다.

### 4단계: 댓글을 확인 전에 보여주기

Server Component는 저장된 댓글을 렌더링하고, Client Component는 `useOptimistic([])`으로 아직 확인되지 않은 댓글만 관리한다. 폼 action은 transition 안에서 실행되므로 입력은 `formRef.current?.reset()`으로 현재 프레임에 비우고, 클라이언트 UUID를 가진 임시 댓글을 추가한다. 다음 서버 렌더링이 도착하면 임시 목록은 비워지고 실제 댓글이 그 자리를 대신한다.

### 5단계: 카드 이동을 즉시 반영하기

드롭할 때 `useOptimistic`의 reducer로 이동한 카드의 상태만 바꾸면 서버 prop이 도착하기 전에 대상 열에 표시할 수 있다. 백그라운드 갱신이 도중에 도착해도 React는 최신 기본 데이터 위에서 reducer를 다시 실행한다. 이 단계는 별도 `startTransition`을 사용해 3단계의 보드 흐림 상태를 의도치 않게 켜지 않는다. Server Function이 실패하면 카드는 원래 위치로 돌아간다.

### 6단계: 폼 수명 주기 관리하기

`useActionState`는 제출 버튼의 대기 상태, 필드 재설정, dialog 닫기를 한 action 수명 주기에 묶는다. 성공할 때 반환 상태의 `key`를 증가시키면 입력 영역이 다시 마운트되어 모든 필드가 초기화된다.

```tsx
const [{ key }, formAction, isPending] = useActionState(
  async (prev, formData) => {
    await createTask({ title: String(formData.get('title')) })
    startTransition(() => setIsOpen(false))
    return { key: prev.key + 1 }
  },
  { key: 0 }
)
```

분석 이벤트, toast, focus 변경처럼 렌더링 상태를 바꾸지 않는 부수 효과는 transition이 필요 없다.

> **알아두면 좋은 점**: React는 현재 `await` 뒤의 상태 갱신을 자동으로 같은 transition에 포함하지 않는다. 이 제한이 해결되기 전까지 `setIsOpen(false)`처럼 `await` 이후의 상태 갱신을 `startTransition`으로 다시 감싸는 방식이 권장된다.

> **알아두면 좋은 점**: 동반 앱은 modal에 상태, 우선순위, 담당자, label 선택기도 추가한다. hidden input이 각 선택 상태를 추적하고, 성공할 때 `key`가 모든 입력을 재설정하는 패턴은 같다.

### 7단계: 삭제 대기 상태를 부모에 알리기

삭제 버튼만 현재 작업이 대기 중임을 안다. 버튼을 `<form>`으로 감싸고 `useOptimistic(false)` 값을 `data-pending` 속성으로 노출하면 부모 댓글 카드는 상태를 끌어올리지 않고 `has-data-pending:opacity-30`으로 자신을 흐리게 할 수 있다. 부모 Server Component는 `deleteComment.bind(null, comment.id)`로 ID가 결합된 action을 전달한다.

### 8단계: 반복 내비게이션을 즉시 만들기

1~7단계는 Cache Components 없이도 작동한다. Next.js 16에서 도입된 Cache Components를 켜면 요청 사이에 재사용할 읽기를 `'use cache'`와 [`cacheTag`](../3-api-reference/3.3-functions/cacheTag.md)로 캐싱할 수 있다. mutation 뒤에는 [`updateTag`](../3-api-reference/3.3-functions/updateTag.md)로 바뀐 읽기의 태그만 즉시 만료한다. 다이나믹 읽기에는 태그가 없으므로 `refresh()`를 사용한다.

```tsx
export async function getTask(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('tasks', `task-${id}`)
  return getTaskById(id)
}
```

Partial Prefetching이 적용된 Next.js 16.3 이상에서 `<Link>`는 현재 사용자가 공유하는 App Shell을 prefetch한다. `params`와 `searchParams`처럼 URL별 데이터까지 클릭 전에 준비하려면 `prefetch={true}`를 사용한다. 다이나믹 읽기는 prefetch마다 실제 서버 작업을 일으킬 수 있으므로 사용자가 다음에 열 가능성이 높은 링크에 적용한다.

### 다음 단계

| 상황 | 사용할 도구 |
| --- | --- |
| 느린 데이터가 페이지를 막지 않고 도착해야 함 | `<Suspense>` |
| 비동기 작업 중 값을 즉시 바꿔야 함 | `useOptimistic` |
| 대기 상태, 오류 전달, 여러 UI 갱신을 조율해야 함 | `useTransition` |
| 폼의 대기, 재설정, 결과 상태가 필요함 | `useActionState` |
| 다른 위치의 작업을 조상이 표시해야 함 | `data-pending`과 CSS |
| 요청 사이에서 읽기를 재사용하고 쓰기 뒤 갱신해야 함 | `'use cache'`, `cacheTag`, `updateTag` 또는 `revalidateTag` |
| 인터랙티브 앱의 페이지 이동을 즉시 보여야 함 | `<Link>` prefetch와 URL별 `prefetch={true}` |

관련 내용은 [Client-side data fetching](./2.15-client-side-data-fetching/README.md), [Streaming](./streaming.md), [Instant navigation](./instant-navigation.md), [View transitions](./view-transitions.md), [SPAs](./single-page-applications.md)에서 이어서 다룬다.

## 예제 및 데모 설계

- Phase 2에서 Taskboard를 만들고 읽기 지연, 토글, 필터, 댓글, 드래그, 폼, 삭제를 단계별로 활성화한다.
- 네트워크 지연과 Server Function 실패를 주입해 skeleton, 낙관적 상태, rollback, error boundary를 관찰한다.
- Cache Components와 `prefetch={true}` 전후의 반복 내비게이션 및 서버 읽기 횟수를 비교한다.

## 연습 문제

1. 서버 prop이 도착하기 전에 토글의 다음 값을 보여줄 때 가장 알맞은 훅은 무엇인가?

   - A. `useOptimistic`
   - B. `usePathname`
   - C. `useId`

   <details><summary>정답 보기</summary>

   정답: A. `useOptimistic`은 transition이 대기 중일 때 서버 prop 대신 렌더링할 임시 값을 제공한다.

   </details>

2. 자식의 삭제 대기 상태를 부모 카드가 상태 전달 없이 표시하는 방법은 무엇인가?

   - A. 전역 변수를 사용한다.
   - B. 자식의 `data-pending`을 부모의 CSS `:has()` 계열 선택자로 감지한다.
   - C. 매 프레임 서버를 polling한다.

   <details><summary>정답 보기</summary>

   정답: B. 자식이 상태를 DOM 속성으로 노출하면 조상이 CSS로 반응할 수 있다.

   </details>

3. Next.js 16.3 이상에서 URL별 데이터를 클릭 전에 준비하려면 무엇을 사용할 수 있는가?

   - A. `<Link prefetch={true}>`
   - B. `<Link scroll={false}>`
   - C. `router.back()`

   <details><summary>정답 보기</summary>

   정답: A. `prefetch={true}`는 App Shell뿐 아니라 링크별 URL 데이터의 준비도 요청한다.

   </details>

## 챕터 요약

- `Suspense`는 느린 읽기를 boundary별로 스트리밍해 셸을 먼저 보여준다.
- `useOptimistic`과 transition은 서버 확인 전에 안전한 임시 UI를 제공한다.
- `useActionState`는 폼의 대기, 결과, 재설정 수명 주기를 관리한다.
- `data-pending`과 CSS는 멀리 있는 조상에 대기 상태를 전달할 수 있다.
- 캐시 태그와 per-link prefetch는 반복 내비게이션을 빠르게 만든다.
