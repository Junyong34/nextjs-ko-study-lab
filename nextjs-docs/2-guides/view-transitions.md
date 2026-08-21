# View transitions

- 공식 문서: [View transitions](https://nextjs.org/docs/app/guides/view-transitions)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- React View Transitions로 내비게이션의 공간적 관계를 표현한다.
- shared element, Suspense reveal, 방향 이동, 같은 라우트 crossfade 패턴을 구현한다.
- 상호작용과 reduced motion을 보존하는 전환 원칙을 적용한다.

## 핵심 개념 및 설명

React의 `<ViewTransition>`은 DOM 변화 전후를 연결해 브라우저 View Transition으로 애니메이션한다. Next.js App Router에서는 `<Link>` 내비게이션, Suspense reveal, 상태 변경에 사용할 수 있다. 공식 문서는 자동화 작업에 `vercel-react-view-transitions` 스킬 사용을 안내하지만, 핵심은 전환이 콘텐츠 관계를 설명해야 한다는 점이다.

### 썸네일을 hero 이미지로 morph하기

목록과 상세 화면의 같은 이미지에 동일한 `name`을 부여하면 shared element로 연결된다.

```tsx filename="components/photo-grid.tsx"
<ViewTransition name={`photo-${photo.id}`}>
  <Image src={photo.src} alt={photo.title} />
</ViewTransition>
```

상세 화면도 같은 이름을 사용한다. `enter`, `exit`, `share` class를 지정하면 기본 morph를 CSS로 조정할 수 있다. 이름은 동시에 렌더링되는 전환마다 고유해야 한다.

### Suspense reveal 애니메이션

fallback과 실제 콘텐츠를 각각 `<ViewTransition>`으로 감싸면 데이터가 준비될 때 reveal을 표현할 수 있다. fallback은 즉시 보여야 하며, 콘텐츠가 도착할 때 짧은 fade나 scale을 적용한다. 느린 네트워크에서도 loading 상태가 정보 구조를 유지하도록 설계한다.

### 내비게이션 방향 표현

forward/back 방향에 서로 다른 전환 class를 사용하면 계층을 더 깊이 들어가는지 돌아오는지 전달할 수 있다. header처럼 위치 기준이 되는 요소는 전환 밖에 고정하거나 별도 이름을 부여해 흔들리지 않게 한다. 긴 애니메이션이 링크나 버튼 입력을 막지 않도록 pointer interaction을 유지한다.

`prefers-reduced-motion: reduce`에서는 이동과 scale을 제거하거나 전환 시간을 사실상 없애 사용자의 모션 설정을 존중한다.

```css filename="app/globals.css"
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*) {
    animation-duration: 0.01ms;
  }
}
```

### 같은 라우트 콘텐츠 crossfade

필터나 탭 변경처럼 URL의 위치는 같고 내용만 바뀌는 경우에는 상태 변경을 transition으로 감싸고 콘텐츠 영역에 안정적인 이름을 준다. shared element morph가 “같은 대상의 상세 보기”를 뜻한다면 crossfade는 “같은 장소의 다른 콘텐츠”를 뜻한다.

| 패턴 | 전달하는 의미 |
| --- | --- |
| Shared element morph | 같은 대상을 더 깊이 본다 |
| Suspense reveal | 데이터가 준비됐다 |
| 방향 slide | 앞으로 가거나 돌아간다 |
| 같은 라우트 crossfade | 같은 위치에서 콘텐츠만 바뀐다 |

## 예제 및 데모 설계

- Phase 2에서 사진 목록→상세 morph와 뒤로 가기 전환을 만든다.
- 인위적으로 데이터를 지연해 Suspense fallback에서 실제 콘텐츠로 reveal되는 과정을 보여준다.
- reduced motion 설정과 빠른 연속 클릭에서 UI가 계속 조작 가능한지 확인한다.

## 연습 문제

1. 같은 사진의 목록·상세 이미지를 연결하는 핵심 조건은?
   - A. 같은 ViewTransition `name`
   - B. 같은 파일 크기만 사용
   - C. SSR 비활성화

   <details><summary>정답 보기</summary>A. 전환 전후 요소에 같은 고유 이름을 부여해 shared element로 연결한다.</details>

2. reduced motion 사용자를 위한 처리로 알맞은 것은?
   - A. 이동 거리를 늘린다
   - B. 모션과 시간을 제거하거나 최소화한다
   - C. 모든 링크를 비활성화한다

   <details><summary>정답 보기</summary>B. 콘텐츠는 유지하면서 불필요한 이동·scale 애니메이션을 줄인다.</details>

## 챕터 요약

- View Transition은 화면 변화의 관계를 시각적으로 설명한다.
- 같은 이름의 요소는 목록과 상세 사이에서 morph할 수 있다.
- Suspense reveal은 fallback에서 실제 데이터로의 완료를 표현한다.
- 방향 이동과 crossfade는 서로 다른 내비게이션 의미에 사용한다.
- 전환은 상호작용을 막지 않고 reduced motion 설정을 존중해야 한다.
