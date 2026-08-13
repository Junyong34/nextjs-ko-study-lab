# Preventing Flash Before Hydration

- 공식 문서: [Preventing Flash](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 서버 HTML과 브라우저 초기 값 차이가 flash와 hydration mismatch를 만드는 이유를 설명한다.
- blocking inline script로 첫 paint 전에 DOM을 맞춘다.
- 날짜, 테마, React 상태 동기화에 적합한 대안을 선택한다.

## 핵심 개념 및 설명

서버가 알 수 없는 브라우저 값에 따라 첫 화면이 달라지면 서버 HTML이 먼저 보인 뒤 hydration 과정에서 내용이 바뀌는 flash가 발생한다. React가 기대한 초기 트리와 DOM이 다르면 hydration 경고도 생긴다. 해결의 핵심은 React가 hydrate하기 전에 작은 inline script로 DOM을 최종 초기 상태에 맞추는 것이다.

### 날짜와 로케일

서버 로케일·시간대와 브라우저가 다르면 같은 `Date`도 다른 문자열이 된다. 서버는 UTC 문자열을 렌더링했는데 브라우저 첫 렌더가 지역 문자열을 만들면 mismatch가 발생한다.

> **알아두면 좋은 점**: 개발 머신과 브라우저 로케일이 같으면 문제를 놓치기 쉽다. `TZ=UTC LANG=ja_JP.UTF-8 next dev`처럼 서로 다른 환경으로 실행해 조기에 확인한다.

#### inline script로 수정하기

화면에 표시할 원시 값을 `data-*` 속성에 넣고, 해당 요소 바로 뒤의 동기식 script가 `textContent`를 브라우저 형식으로 바꾼다. script는 parser를 잠시 막지만 첫 paint 전에 실행되므로 잘못된 값이 보이지 않는다. 사용자 입력을 문자열로 조합하지 말고 직렬화가 안전한 데이터만 전달한다.

```tsx
function LocalDate({ iso }: { iso: string }) {
  const id = `date-${iso}`
  return (
    <>
      <time id={id} dateTime={iso}>{iso}</time>
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById(${JSON.stringify(id)}).textContent =
          new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })
            .format(new Date(${JSON.stringify(iso)}))
      ` }} />
    </>
  )
}
```

`suppressHydrationWarning`은 의도적으로 다른 텍스트의 경고만 숨기는 escape hatch다. mismatch 자체나 flash를 고치지 않으며 한 단계 깊이의 노드에만 적용한다. 날짜 패턴이 반복되면 formatter와 script 직렬화를 재사용 컴포넌트로 추출한다.

> **알아두면 좋은 점**: inline script에 사용자 제어 문자열을 직접 삽입하면 XSS 위험이 있다. `JSON.stringify` 등 안전한 직렬화를 사용하고 가능한 한 고정된 script를 재사용한다.

### 테마

테마도 서버가 `localStorage`를 읽을 수 없어 같은 문제가 생긴다. `<html>` 또는 `<body>`보다 먼저 실행되는 script가 저장된 테마나 시스템 설정을 읽고 class/data 속성을 적용해야 한다. script와 React가 사용하는 테마 판정 로직을 같게 유지한다.

cookie에 테마를 저장하면 Server Component가 요청 시 읽어 처음부터 올바른 HTML을 만들 수 있다. 다만 요청 데이터에 의존하므로 라우트의 렌더링·캐시 특성이 바뀐다. 클라이언트 전용 저장소가 꼭 필요하지 않다면 cookie가 더 단순할 수 있다.

### React 상태와 동기화

inline script가 DOM을 먼저 바꾼 뒤 Client Component의 초기 state가 다른 값을 사용하면 hydration 뒤 다시 되돌아갈 수 있다. 초기 state 함수가 script와 같은 저장소·판정 규칙을 읽도록 한다. 이후 `storage`나 media query 변경 이벤트를 구독해 다른 탭과 시스템 테마 변경도 반영한다.

개발 환경의 Fast Refresh나 Strict Mode에서 속성이 다시 적용될 수 있으므로 script를 멱등하게 만든다. 같은 값을 여러 번 적용해도 결과가 같아야 한다.

### 다른 접근을 선택할 때

| 상황 | 접근 방식 |
| --- | --- |
| 날짜가 cookie/header에 의존 | 서버에서 `headers()` 또는 `cookies()`를 읽어 포맷 |
| countdown·clock처럼 계속 갱신 | Client Component의 `useEffect`와 제한적 `suppressHydrationWarning` |
| 페이지가 이미 완전히 다이나믹 | `Accept-Language`를 읽어 서버에서 포맷 |
| 언어별 콘텐츠 번역 | 로케일별 정적 빌드 또는 다이나믹 렌더링을 쓰는 국제화 |

`useEffect`만 사용하면 hydration 뒤에 실행되므로 flash를 막지 못한다. 요청 시 header/cookie를 읽으면 정확한 HTML을 만들지만 정적 캐시 가능성을 줄일 수 있다. 데이터 성격과 라우트 캐시 목표에 맞춰 선택한다.

## 예제 및 데모 설계

- Phase 2에서 서버 시간대를 UTC로 고정하고 브라우저 로케일과 다른 날짜를 렌더링한다.
- `useEffect` 방식과 blocking inline script 방식의 첫 paint를 느린 CPU로 비교한다.
- localStorage 테마와 cookie 테마가 캐싱·초기 화면에 미치는 차이를 관찰한다.

## 연습 문제

1. `suppressHydrationWarning`이 해결하지 못하는 것은?
   - A. 경고 표시 억제
   - B. 잘못된 초기 값의 flash
   - C. 의도적 텍스트 차이 표시

   <details><summary>정답 보기</summary>B. 경고를 숨길 뿐 DOM 차이나 첫 paint의 flash 자체를 고치지 않는다.</details>

2. inline script의 안전 조건은?
   - A. 사용자 입력을 그대로 문자열 결합
   - B. 안전하게 직렬화하고 멱등적으로 작성
   - C. hydration 뒤 비동기로 실행

   <details><summary>정답 보기</summary>B. XSS를 막고 개발 중 반복 실행에도 같은 결과를 내야 한다.</details>

## 챕터 요약

- flash는 서버 HTML과 브라우저가 원하는 초기 DOM이 다를 때 생긴다.
- blocking inline script는 첫 paint 전에 DOM을 맞출 수 있다.
- `suppressHydrationWarning`은 경고용 escape hatch이며 flash 해결책이 아니다.
- 테마 script와 React state는 같은 판정 로직을 사용해야 한다.
- 요청 데이터, 실시간 갱신, 국제화 여부에 따라 서버·클라이언트 방식을 선택한다.
