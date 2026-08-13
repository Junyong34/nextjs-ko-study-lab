# Preserving UI state

- 공식 문서: [Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- App Router 내비게이션에서 보존할 UI 상태와 초기화할 상태를 구분한다.
- 폼, dialog, 인증, 전역 스타일의 오래된 상태를 명시적으로 초기화한다.
- React Activity가 숨긴 트리의 effect와 media를 어떻게 다루는지 설명한다.

## 핵심 개념 및 설명

이 가이드는 Cache Components가 활성화된 앱을 전제로 한다. Next.js는 뒤로/앞으로 이동할 때 이전 화면을 빠르게 복원하기 위해 UI 트리를 보존할 수 있다. 보존은 입력값이나 열린 패널에는 유용하지만, 성공 메시지·dialog 초기화·인증 상태처럼 새 내비게이션에서 다시 계산해야 하는 값에는 오래된 UI를 남길 수 있다.

> **알아두면 좋은 점**: `useRouter().bfcacheId`를 React `key`로 쓰면 push/replace 내비게이션에서 하위 트리 전체를 초기화하고 브라우저 뒤로/앞으로 이동에서는 복원할 수 있다. 이는 주로 마이그레이션 도구이며 새 코드는 아래의 상태별 초기화를 우선한다.

### 무엇을 보존할지 선택하기

#### 펼침 UI

dropdown, accordion, panel은 돌아왔을 때 열린 상태를 유지하는 편이 자연스러울 수 있다. 반대로 새 항목으로 이동할 때 반드시 닫혀야 한다면 pathname이나 항목 ID를 `key`로 사용하거나 route 변화에 맞춰 state를 초기화한다. 보존 여부는 컴포넌트 종류가 아니라 사용자 작업의 연속성으로 판단한다.

#### dialog와 초기화 로직

mount 시 한 번 실행하는 초기화 로직은 트리가 보존되면 다시 실행되지 않는다. dialog의 `open` state가 라우트와 연결돼 있다면 URL이나 props를 source of truth로 삼고, 닫기 동작도 해당 상태를 갱신한다. 단순히 mount effect에만 의존하지 않는다.

#### 폼과 입력

작성 중 입력은 뒤로 갔다 돌아올 때 보존하면 유용하다. 제출 완료 뒤에는 명시적으로 `reset()`하거나 form에 새 `key`를 부여한다. 제출 상태와 성공 메시지는 다음 제출 또는 내비게이션에서 초기화해 과거 결과가 남지 않게 한다.

```tsx
'use client'

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null)
  async function submit(formData: FormData) {
    await save(formData)
    setStatus('Saved')
  }
  return <form action={submit}>{/* fields */}{status && <p>{status}</p>}</form>
}
```

### 인증 상태

로그아웃이나 사용자 전환 뒤에 보존된 화면이 이전 사용자의 정보를 잠시 보여서는 안 된다. 인증 변경 시 서버 데이터를 무효화하고 router refresh 또는 적절한 navigation을 수행한다. 민감한 UI를 클라이언트 state 보존에만 맡기지 않는다.

### 전역 스타일

숨겨진 트리의 style이 문서 전역에 남으면 현재 화면에 영향을 줄 수 있다. 특히 `body`, `html`, CSS 변수, 넓은 selector를 Client Component가 주입하면 문제가 된다. 전역 규칙은 안정적인 layout이나 전역 stylesheet에 두고, 화면별 스타일은 명확한 컨테이너로 범위를 제한한다.

`:has()`는 자손 상태를 기준으로 상위 요소를 스타일링할 수 있다. 숨겨진 트리가 여전히 selector 조건을 만족하지 않도록 visible 상태나 명시적 속성을 조건에 포함한다.

> **알아두면 좋은 점**: 숨겨질 컴포넌트 자체가 전역 `:has` 규칙을 정의하면 컴포넌트를 비활성화할 때 그 규칙도 함께 제거될 수 있다.

### 테스트

브라우저 뒤로/앞으로, `<Link>`, `router.push`, `router.replace`를 각각 테스트한다. 숨겨진 DOM도 쿼리에 잡힐 수 있으므로 `getByRole` 같은 visibility-aware selector를 사용하고 실제로 보이는 요소를 검증한다. 입력 보존과 상태 초기화 모두 회귀 테스트로 고정한다.

### React Activity 활용

Activity는 트리를 제거하지 않고 숨겨 state를 보존하며, 보이는 트리를 우선 처리한다. 숨겨진 콘텐츠를 미리 렌더링해 다시 표시할 때 빠르게 복원할 수 있다.

effect는 숨김과 다시 표시를 mount/unmount와 다르게 다뤄야 한다. video, observer, subscription 같은 외부 자원은 visibility에 맞춰 pause·cleanup하고 다시 표시할 때 재개한다. 처음 mount인지 재표시인지 구분해야 한다면 ref로 수명 주기를 기록하되, 핵심 상태는 props나 URL 같은 명시적 source of truth에서 파생한다.

## 예제 및 데모 설계

- Phase 2에서 입력값은 보존하고 제출 메시지는 초기화되는 폼을 만든다.
- 인증 사용자 전환과 뒤로 가기에서 이전 사용자 UI가 노출되지 않는지 검사한다.
- 숨긴 video와 observer가 pause/cleanup되고 재표시 때 복구되는지 확인한다.

## 연습 문제

1. 뒤로 갔다 돌아왔을 때 보존하기 적합한 상태는?
   - A. 작성 중인 입력값
   - B. 이전 사용자의 인증 정보
   - C. 과거 제출 성공 메시지

   <details><summary>정답 보기</summary>A. 사용자의 진행 중 작업은 보존 가치가 있지만 인증·과거 상태는 다시 계산해야 한다.</details>

2. 숨겨진 DOM을 포함한 테스트에 알맞은 선택자는?
   - A. 존재하는 첫 노드만 선택
   - B. 실제 visibility를 고려하는 role 기반 선택자
   - C. 모든 hidden 노드 선택

   <details><summary>정답 보기</summary>B. 사용자가 실제로 볼 수 있는 요소를 기준으로 검증해야 한다.</details>

## 챕터 요약

- UI 보존은 작업 연속성을 높이지만 오래된 상태를 남길 수 있다.
- 입력은 보존하고 제출·dialog·인증 상태는 목적에 맞게 초기화한다.
- 전역 스타일은 보존된 숨은 트리의 영향을 받지 않게 범위를 제한한다.
- 테스트는 내비게이션 방식과 실제 visibility를 함께 검증한다.
- Activity의 숨긴 트리는 state를 보존하므로 외부 effect와 media를 명시적으로 정리한다.
