# template.js

- 공식 문서: [template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 상태를 보존하는 layout과 매번 새 인스턴스를 만드는 template을 구분한다.
- template이 필요한 reset·effect·fallback 시나리오를 판단한다.

## 핵심 개념 및 설명

`template.js`는 하위 layout이나 page를 감싸는 점은 layout과 같지만, 내비게이션 때 각 child에 고유 key가 부여되어 새 인스턴스가 mount된다. 따라서 Client Component state가 보존되지 않고 effect가 다시 동작하며 Suspense fallback도 다시 표시된다.

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

일반적으로 UI와 상태를 공유하려면 layout을 사용한다. 자식별로 enter/exit logging을 다시 수행하거나, 내비게이션마다 feature state를 reset하거나, fallback을 다시 보여야 할 때 template을 선택한다. 컴포넌트 계층에서 template은 layout 안쪽, error·loading·page 바깥쪽에 있다.

## 예제 및 데모 설계

- Phase 2에서 같은 입력 폼을 layout과 template에 각각 두고 페이지 이동 뒤 값 보존 여부를 비교한다.
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
