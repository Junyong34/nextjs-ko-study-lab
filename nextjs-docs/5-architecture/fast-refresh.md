# Fast Refresh

- 공식 문서: [Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)
- 상위 메뉴: [Architecture](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Fast Refresh가 무엇이고 언제부터 기본으로 활성화되는지 설명한다.
- 수정한 파일의 export 구성에 따라 Fast Refresh가 파일 단위 업데이트·연쇄 업데이트·전체 새로고침 중 무엇을 선택하는지 구분한다.
- 문법 에러와 런타임 에러가 발생했을 때 Fast Refresh가 각각 어떻게 복구되는지 이해한다.
- 컴포넌트 상태가 보존되지 않는 대표적인 상황(클래스 컴포넌트, 익명 화살표 함수, 추가 export 등)을 식별한다.
- `// @refresh reset`으로 상태를 강제로 초기화하는 방법과, `useState`/`useRef`가 `useEffect`/`useMemo`/`useCallback`과 다르게 동작하는 이유를 설명한다.

## 핵심 개념 및 설명

### Fast Refresh란

Fast Refresh는 React 기능을 Next.js에 통합한 것으로, 파일을 저장할 때 임시 클라이언트 상태를 유지하면서 브라우저 페이지를 라이브 리로드한다. **9.4 이상**의 모든 Next.js 애플리케이션에서 기본적으로 활성화되어 있으며, Fast Refresh가 켜져 있으면 대부분의 수정 사항이 1초 안에 화면에 반영된다.

### 동작 방식

Fast Refresh는 수정한 파일이 무엇을 export하는지에 따라 세 가지 방식 중 하나로 동작한다.

- **React 컴포넌트만 export하는 파일을 수정한 경우**: Fast Refresh는 그 파일의 코드만 갱신하고 컴포넌트를 다시 렌더링한다. 스타일, 렌더링 로직, 이벤트 핸들러, effect 등 파일 안의 어떤 내용을 수정해도 이 방식이 적용된다.
- **React 컴포넌트가 아닌 것도 export하는 파일을 수정한 경우**: Fast Refresh는 그 파일과, 그 파일을 import하는 다른 파일들을 함께 다시 실행한다. 예를 들어 `Button.js`와 `Modal.js`가 모두 `theme.js`를 import한다면, `theme.js`를 수정했을 때 두 컴포넌트가 모두 갱신된다.
- **React 트리 바깥의 파일이 import하는 파일을 수정한 경우**: Fast Refresh는 전체 새로고침으로 전환한다. React 컴포넌트를 렌더링하면서 동시에 **React가 아닌** 파일이 import하는 값을 export하는 파일이 여기에 해당한다. 예를 들어 컴포넌트 파일이 상수도 함께 export하고, 그 상수를 React가 아닌 유틸리티 파일이 import하는 경우다. 이럴 때는 그 상수를 별도 파일로 옮기고 두 파일 모두에서 import하는 방법을 고려해볼 수 있다. 이렇게 하면 Fast Refresh가 다시 정상 동작한다. 다른 유사한 상황도 대체로 같은 방식으로 해결할 수 있다.

### 에러 복원력

#### 문법 에러

개발 중 문법 에러가 발생해도 수정하고 파일을 다시 저장하면 된다. 에러는 자동으로 사라지므로 앱을 다시 로드할 필요가 없다. **컴포넌트 상태를 잃지 않는다.**

#### 런타임 에러

컴포넌트 안에서 런타임 에러로 이어지는 실수를 하면 맥락이 담긴 오버레이가 나타난다. 에러를 고치면 오버레이는 앱을 다시 로드하지 않고 자동으로 사라진다.

에러가 렌더링 중에 발생하지 않았다면 컴포넌트 상태는 유지된다. 반대로 에러가 렌더링 중에 발생했다면 React는 갱신된 코드로 애플리케이션을 다시 마운트한다.

앱에 [에러 바운더리](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)가 있다면(프로덕션에서 우아하게 실패를 처리하기 위해 두는 것이 좋다), 렌더링 에러 이후 다음 수정에서 렌더링을 다시 시도한다. 즉 에러 바운더리가 있으면 매번 루트 앱 상태로 초기화되는 상황을 막을 수 있다. 다만 에러 바운더리를 너무 세분화하지 않도록 유의한다. 에러 바운더리는 프로덕션에서도 React가 실제로 사용하므로 항상 의도를 가지고 설계해야 한다.

### 상태 보존의 한계

Fast Refresh는 수정 중인 컴포넌트의 로컬 React 상태를 보존하려고 시도하지만, 안전한 경우에만 그렇게 한다. 파일을 수정할 때마다 로컬 상태가 초기화되는 대표적인 이유는 다음과 같다.

- 클래스 컴포넌트에서는 로컬 상태가 보존되지 않는다(함수 컴포넌트와 Hooks만 상태를 보존한다).
- 수정 중인 파일이 React 컴포넌트 외에 **다른** export도 함께 가지고 있는 경우다.
- 파일이 `HOC(WrappedComponent)`처럼 고차 컴포넌트(HOC)를 호출한 결과를 export하는 경우도 있다. 이때 반환된 컴포넌트가 클래스라면 그 상태는 초기화된다.
- `export default () => <div />;`처럼 익명 화살표 함수를 사용하면 Fast Refresh가 로컬 컴포넌트 상태를 보존하지 못한다. 코드베이스가 크다면 [`name-default-component` codemod](https://nextjs.org/docs/pages/guides/upgrading/codemods#name-default-component)를 사용할 수 있다.

코드베이스가 함수 컴포넌트와 Hooks로 점점 더 옮겨갈수록, 더 많은 경우에 상태가 보존될 것으로 기대할 수 있다.

### 실무 팁

- Fast Refresh는 기본적으로 함수 컴포넌트(와 Hooks)의 React 로컬 상태를 보존한다.
- 때로는 상태를 강제로 초기화하고 컴포넌트를 다시 마운트하고 싶을 수 있다. 예를 들어 마운트 시에만 일어나는 애니메이션을 조정할 때 유용하다. 이럴 때는 수정 중인 파일 어디에나 `// @refresh reset`을 추가하면 된다. 이 지시어는 해당 파일에 한정되며, 그 파일에 정의된 컴포넌트를 수정할 때마다 다시 마운트하도록 Fast Refresh에 지시한다.
- 개발 중 수정하는 컴포넌트 안에 `console.log`나 `debugger;`를 넣어도 된다.
- import는 대소문자를 구분한다는 점을 기억해두자. import가 실제 파일명과 일치하지 않으면 fast refresh와 full refresh 모두 실패할 수 있다. 예를 들어 `'./header'`와 `'./Header'`는 다른 경로로 취급된다.

### Fast Refresh와 Hooks

가능한 경우 Fast Refresh는 수정 사이에 컴포넌트의 상태를 보존하려고 시도한다. 특히 `useState`와 `useRef`는 인자나 Hook 호출 순서를 바꾸지 않는 한 이전 값을 그대로 유지한다.

`useEffect`, `useMemo`, `useCallback`처럼 의존성을 가진 Hooks는 Fast Refresh 중에는 **항상** 다시 실행된다. Fast Refresh가 일어나는 동안에는 이 Hooks의 의존성 목록이 무시된다.

예를 들어 `useMemo(() => x * 2, [x])`를 `useMemo(() => x * 10, [x])`로 수정하면, 의존성인 `x`가 바뀌지 않았어도 다시 실행된다. React가 이렇게 동작하지 않는다면 수정한 내용이 화면에 반영되지 않을 것이다!

이 때문에 가끔 예상치 못한 결과로 이어질 수 있다. 예를 들어 의존성 배열이 빈 `useEffect`도 Fast Refresh 중에는 한 번 더 다시 실행된다.

다만 `useEffect`가 가끔 다시 실행되더라도 문제없이 동작하도록 코드를 작성하는 것은 Fast Refresh 여부와 무관하게 좋은 습관이다. 그렇게 하면 나중에 새 의존성을 추가하기가 쉬워지고, [React Strict Mode](../3-api-reference/3.5-config/3.5.1-next-config-js/reactStrictMode.md)에서도 강제되는 습관이므로 Strict Mode 활성화를 적극 권장한다.

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서 다음 시나리오를 데모로 구성한다.
  - React 컴포넌트만 export하는 파일을 수정했을 때 상태가 보존되는 것을 눈으로 확인하는 데모(예: 카운터 컴포넌트의 스타일이나 JSX를 수정하면서 카운트 값이 유지되는지 확인).
  - 컴포넌트 파일에 컴포넌트가 아닌 값을 함께 export해 React 트리 바깥 파일이 import하도록 구성하고, 이 경우 전체 새로고침으로 전환되는 것을 관찰하는 데모.
  - 렌더링 중 에러와 렌더링 외 에러를 각각 발생시켜, 오버레이 동작과 상태 보존 여부가 어떻게 달라지는지 비교하는 데모.
  - `// @refresh reset`을 넣고 뺐을 때 컴포넌트 리마운트 여부가 달라지는 것을 비교하는 데모.
  - `useMemo`/`useCallback`의 의존성을 바꾸지 않고 콜백 본문만 수정했을 때도 Fast Refresh 중에는 다시 실행되는 것을 콘솔 로그로 확인하는 데모.

## 연습 문제

1. 컴포넌트 파일이 React 컴포넌트가 아닌 상수를 함께 export하고, 그 상수를 React 트리 바깥의 유틸리티 파일이 import하고 있다. 이 컴포넌트 파일을 수정하면 Fast Refresh는 어떻게 동작하는가?
   - A. 해당 파일만 갱신하고 나머지는 그대로 둔다.
   - B. 전체 새로고침으로 전환한다.
   - C. 아무 동작도 하지 않고 에러를 표시한다.

<details><summary>정답 보기</summary>

정답: B. React 트리 바깥의 파일이 import하는 값을 함께 export하는 파일을 수정하면 Fast Refresh는 전체 새로고침으로 전환한다. 상수를 별도 파일로 분리해 두 파일에서 각각 import하면 다시 Fast Refresh가 정상 동작한다.
</details>

2. Fast Refresh 중에 로컬 컴포넌트 상태가 보존되지 않는 경우로 옳은 것을 **모두** 고르시오.
   - A. 클래스 컴포넌트를 수정한 경우
   - B. `export default () => <div />;`처럼 익명 화살표 함수로 내보낸 컴포넌트를 수정한 경우
   - C. 의존성 배열이 변하지 않은 `useState`만 사용하는 함수 컴포넌트를 수정한 경우

<details><summary>정답 보기</summary>

정답: A, B. 클래스 컴포넌트는 함수 컴포넌트·Hooks와 달리 로컬 상태가 보존되지 않으며, 익명 화살표 함수로 내보낸 컴포넌트도 상태가 보존되지 않는다. `useState`는 인자나 Hook 호출 순서가 바뀌지 않는 한 이전 값을 유지하므로 C는 해당하지 않는다.
</details>

3. `useEffect(() => { ... }, [])`처럼 의존성 배열이 빈 `useEffect`가 있는 컴포넌트를 Fast Refresh로 수정했다. 이 `useEffect`는 어떻게 동작하는가?
   - A. 의존성이 바뀌지 않았으므로 다시 실행되지 않는다.
   - B. Fast Refresh 중에는 의존성 목록이 무시되므로 한 번 더 다시 실행된다.
   - C. 컴포넌트가 클래스 컴포넌트일 때만 다시 실행된다.

<details><summary>정답 보기</summary>

정답: B. `useEffect`, `useMemo`, `useCallback`처럼 의존성을 가진 Hooks는 Fast Refresh 중에는 의존성 목록과 무관하게 항상 다시 실행된다.
</details>

## 챕터 요약

- Fast Refresh는 파일 저장 시 임시 클라이언트 상태를 유지하며 브라우저를 라이브 리로드하는 React 기능으로, Next.js 9.4 이상에서 기본 활성화된다.
- 수정한 파일이 React 컴포넌트만 export하는지, 다른 값도 함께 export하는지, React 트리 바깥에서 import되는지에 따라 파일 단위 갱신·연쇄 갱신·전체 새로고침 중 하나가 선택된다.
- 문법 에러는 저장 시 자동으로 복구되고, 런타임 에러는 오버레이로 표시되며 렌더링 중 발생 여부에 따라 상태 보존 여부가 갈린다.
- 클래스 컴포넌트, 추가 export, HOC가 반환한 클래스 컴포넌트, 익명 화살표 함수는 상태 보존이 되지 않는 대표적인 경우다.
- `// @refresh reset`으로 강제 리마운트를 트리거할 수 있고, `useState`/`useRef`는 값을 보존하지만 `useEffect`/`useMemo`/`useCallback`은 Fast Refresh 중 의존성과 무관하게 항상 재실행된다.
