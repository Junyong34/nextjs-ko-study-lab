# instant

- 공식 문서: [instant](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- segment 진입 시 즉시 UI가 보일 것이라는 기대를 검증한다.
- validation level과 global 기본값을 설정하고 loading state를 점검한다.

## 핵심 개념 및 설명

`instant` 라우트 세그먼트 구성은 Next.js가 이 세그먼트에 대한 탐색이 인스턴트 UI를 생성하는지 여부를 검증하는 방법을 제어한다.

Next.js는 prefetching을 사용하여 현재 페이지의 모든 인앱 링크에 대한 탐색을 미리 로드한다. 그러나 서버에서 클라이언트 측 데이터를 가져오거나 부분적으로 prerendering된 결과로 인해 UI가 즉시 업데이트되지 않는 탐색이 발생할 수 있다. 빠른 느낌의 탐색을 구축하는 데 도움이 되도록 `instant`를 사용하면 구성된 세그먼트를 통한 탐색에서 무엇을 기대하는지 Next.js에 알릴 수 있다. 예를 들어, 이 세그먼트에 대한 탐색이 외부에서 로드된 데이터를 기다리지 않고 즉시 렌더링되는 UI를 생성해야 함을 나타낼 수 있다. 탐색이 즉각적이지 않을 것으로 예상된다는 것을 나타낼 수도 있다.

인스턴트 UI를 기대하도록 세그먼트가 구성된 경우 Next.js는 탐색이 UI를 즉시 업데이트하지 못하도록 차단하는 모든 코드를 애플리케이션에 표시한다. 전체 안내는 [빠른 탐색 가이드](../../../2-guides/instant-navigation.md)를 참조한다.

> **알아두면 좋은 점**:
>
> - `instant` 내보내기는 [`cacheComponents`](../../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화된 경우에만 작동한다.
> - `instant`는 Client Component에서 사용할 수 없다. 오류가 발생한다.
> - Next.js는 개발 중에 prefetch를 수행하지 않으므로 탐색이 프로덕션에서처럼 즉각적으로 느껴지지 않을 수 있다. 유효성 검사는 prefetching이 활성화된 `next start` 중에 발생하는 상황을 반영한다.

```tsx filename="layout.tsx | page.tsx" switcher
export const instant = true

export default function Page() {
  return <div>...</div>
}
```

```jsx filename="layout.js | page.js" switcher
export const instant = true

export default function Page() {
  return <div>...</div>
}
```

<a id="reference"></a>
### 참조

내보내기는 다음을 허용한다.

- **`true`**: 전역적으로 구성된 모든 수준에서 세그먼트를 검증하도록 선택한다([검증 기본값 구성](#configuring-validation-defaults) 참조). 프레임워크 기본값을 사용하면 유효성 검사가 개발 중에만 실행되고 개발 오버레이에 오류가 표시된다.
- **`false`**: 세그먼트를 옵트아웃한다([인스턴트 비활성화](#disabling-instant) 참조).
- **객체**: 추가 옵션을 선택한다. [`level`](#level)을 참조한다.

<a id="level"></a>
#### `level`

이 세그먼트에 대해 검증이 실행되는 심각도를 설정한다.

```tsx filename="page.tsx"
export const instant = {
  level: 'warning',
}
```

- **`'warning'`**: 개발 중에만 유효성을 검사한다. 개발 오버레이에 오류가 나타난다. 빌드는 영향을 받지 않는다.

앞으로는 빌드 중 유효성 검사를 지원하는 유효성 검사 수준이 지원될 예정이다. 실험적 검증 모드를 활성화하지 않는 한 사용 가능한 유일한 레벨은 `"warning"`이므로 레벨을 지정할 필요가 없다.

`level`가 생략되면(또는 `instant = true`가 사용되는 경우) 전역적으로 구성된 모든 수준에서 세그먼트가 검증된다. [검증 기본값 구성](#configuring-validation-defaults)을 참조한다.

<a id="disabling-instant"></a>
#### 인스턴트 비활성화 중

레이아웃이나 페이지에서 `false`를 설정하여 탐색 시 이 세그먼트가 차단되도록 허용한다.

이는 더 깊은 페이지가 즉각적이어야 하지만 상위 페이지는 그럴 수 없는 경우에 유용하다. 예를 들어 공유 레이아웃을 즉시 로드할 수 없지만 이 레이아웃 아래의 페이지를 즉시 탐색할 수 있다고 주장하려는 경우 페이지에 `instant = true`가 있고 공유 레이아웃에 `instant = false`가 있는지 확인할 수 있다.

```tsx filename="app/tabs/layout.tsx"
export const instant = false
```

```tsx filename="app/tabs/[tab]/page.tsx"
export const instant = true
```

외부에서 탭으로의 탐색은 레이아웃에서 차단될 수 있다. 탭 간 탐색은 인스턴트 UI에 대해 검증된다.

단지 차단 작업을 수행한다는 이유만으로 인스턴트 페이지의 상위 항목에 `false`를 추가할 필요는 없다. 상위 `instant = true`는 하위 항목의 유효성을 검사하도록 강제하지 않으며 상위 항목을 구성하지 않은 상태로 두어도 괜찮다. 더 깊은 페이지를 인스턴트로 구성하고 차단 상위 항목을 통과하는 탐색을 면제해야 하는 경우에만 `false`에 도달한다.

<a id="disabling-static-shell-validation"></a>
#### static shell 검증 비활성화

또한 Cache Components는 prerendering 시 앱의 각 페이지가 비어 있지 않은 static shell을 생성하는지 확인한다. 이 검증에서 경로를 선택 해제하려면 경로 트리에서 가장 높은 `instant` 구성이 `false` 인지 확인한다. static shell 확인을 위해 트리에서 더 높은 `false`가 더 깊은 `true`보다 우선한다.

루트 레이아웃에서 `false`를 설정하면 전체 앱에 대한 static shell 유효성 검사가 비활성화된다.`false`를 가능한 한 낮게 배치한다(선택 해제하려는 경로를 포함하는 데 필요한 만큼만 높게). 그러면 앱의 나머지 부분이 계속해서 검증된다.

<a id="how-validation-works"></a>
### 유효성 검사 작동 방식

`instant`는 경로의 모든 공유 레이아웃 경계에서 검증을 트리거한다. 검증은 개발 중에(페이지 로드 및 HMR 업데이트 시) 실행되며 개발 오류 오버레이에 오류가 표시된다.

각 오류는 탐색을 차단하는 컴포넌트를 식별한다. 해결 방법은 일반적으로 `use cache`로 데이터를 캐시하거나 `<Suspense>` 경계로 래핑하는 것이다.

<a id="configuring-validation-defaults"></a>
### 검증 기본값 구성

기본적으로(`validationLevel: 'warning'`) Cache Components 앱은 개발 중인 모든 페이지 및 기본 세그먼트의 유효성을 검사한다.`experimental.instantInsights.validationLevel` 구성은 이 동작을 조정한다. 예를 들어 `instant`를 통해 명시적으로 선택한 세그먼트로 유효성 검사를 제한한다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    instantInsights: {
      validationLevel: 'warning',
    },
  },
}
```

지원되는 수준은 다음과 같다.

- **`'warning'`** _(프레임워크 기본값)_: 모든 페이지 및 기본 세그먼트는 경고 수준에서 암시적으로 검증된다(개발자에게만 해당).
- **`'manual-warning'`**: 명시적인 `instant`가 있는 세그먼트만 경고 수준에서 검증된다(개발자 전용).

세그먼트에 `instant = false`를 설정하면 유효성 검사가 완전히 제외된다.

> **알아두면 좋은 점**:
>
> - 프레임워크 기본값은 사용자가 더 높은 수준의 유효성 검사를 받을 수 있도록 향후 버전에서 변경될 수 있다. 이 기능은 실험적이므로 해당 변경 사항은 주요 변경 사항으로 간주되지 않는다. 특정 동작을 고정하려면 `validationLevel`를 명시적으로 설정한다.
> - 프레임워크 합성 오류 경로(`/_global-error`,`/_not-found`)는 암시적 유효성 검사에서 제외된다. 이를 확인하려면 `instant`를 사용하여 명시적으로 선택한다.

<a id="inspecting-loading-states"></a>
### 로딩 상태 검사

탐색 검사기는 Cache Components가 활성화된 경우 사용할 수 있다.

```js filename="next.config.js"
module.exports = {
  cacheComponents: true,
}
```

Next.js DevTools를 열고 **Navigation Inspector**를 선택한 다음 **Pause on Navigations**를 켭니다. 토글이 켜져 있는 동안:

- 동적 데이터가 스트리밍되기 전에 페이지를 새로 고쳐 경로에 대해 생성된 초기 정적 UI를 고정한다.
- 대상 경로에 대해 미리 가져온 UI를 고정하려면 링크를 클릭한다.

UI가 정지되면 **재개**를 클릭하여 현재 탐색을 완료한다. 토글이 계속 켜져 있으므로 다음 새로 고침이나 링크 클릭도 일시 중지된다. 완료되면 끈다. 페이지 새로 고침과 링크 클릭을 모두 사용하여 첫 번째 방문과 탐색 시 로딩 상태가 올바른지 확인한다.

<a id="testing-instant-navigation"></a>
### 즉각적인 탐색 테스트

`@next/playwright` 패키지는 콜백이 인스턴트 UI에 대해 실행되는 동안 동적 콘텐츠를 보류하는 `instant()`도우미를 내보낸다. 전체 예시는 [가이드](../../../2-guides/instant-navigation.md#prevent-regressions-with-e2e-tests)를 참조한다.

```typescript
import { instant } from '@next/playwright'
```

<a id="known-issue-shared-cookie-across-projects"></a>
### 알려진 문제: 프로젝트 간 공유 쿠키

DevTools는 `next-instant-navigation-testing` 쿠키를 사용하여 동적 콘텐츠를 보류하고 인스턴트 UI에서 페이지를 고정한다. 쿠키는 포트가 아닌 도메인으로 범위가 지정되므로 동일한 도메인(일반적으로 `localhost`)에서 여러 프로젝트를 실행하면 쿠키가 프로젝트 간에 공유되고 예기치 않은 동작이 발생할 수 있다. 문제를 방지하려면 프로젝트 간 전환 시 쿠키를 지우거나 Navigation Inspector 패널을 닫는다.

> **알아두면 좋은 점**: 이는 기능 안정화의 일환으로 수정될 예정이다.

<a id="typescript"></a>
### TypeScript

```tsx
type InstantConfig =
  | true
  | false
  | {
      level?: 'warning'
    }

export const instant: InstantConfig = true
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | --------------------------------------------------- |
| `v16.x.x` | `instant` 내보내기 도입됨(Cache Components에만 해당) |

## 예제 및 데모 설계

- Phase 2에서 runtime 데이터를 boundary 밖에 두어 개발 overlay 오류를 확인한 뒤 loading state로 해결한다.
- `warning` 메시지와 프로덕션 prefetch 동작을 비교한다.

## 연습 문제

1. `instant`의 필수 조건은?
   - A. `cacheComponents` 활성화
   - B. Pages Router 사용
   - C. Client Component export

<details><summary>정답 보기</summary>

정답: A. Cache Components가 켜진 route segment에서만 동작한다.
</details>

## 챕터 요약

- `instant`는 즉시 UI 기대를 검증한다.
- true, false, level 객체를 지원한다.
- Cache Components가 필요하다.
- Client Component에서는 사용할 수 없다.
- loading state와 Suspense boundary로 blocking 원인을 해결한다.
