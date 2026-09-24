import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="실무 UI 상태, 어디에 두면 보존되는가" className="min-w-0">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. 가이드의 출발점</h5>
          <p>
            Preserving UI state 가이드는 Cache Components 이전에는 page 수준 상태를 내비게이션 너머로 보존하려면
            상태를 <strong>공유 layout으로 끌어올리거나</strong> 외부 store를 써야 했다고 설명한다. 이 데모가 도는
            demo-baseline zone은 <code>cacheComponents</code>를 켜지 않았으므로, 바로 그 상황을 장바구니 Drawer로 실측한다.
          </p>
        </div>
        <div>
          <h5 className={H}>2. 세 가지 배치와 파일 트리</h5>
          <pre className="min-w-0 overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] leading-relaxed dark:bg-zinc-900">
{`drawer-open/
├─ layout.tsx          <CartDrawer slot="layout" />        → 보존
│                      <CartDrawer key={pathname} ... />   → 이동마다 초기화
├─ page.tsx            (전자기기) <CartDrawer slot="page" /> → 이동하면 사라짐
└─ fashion/page.tsx    (패션)     <CartDrawer slot="page" /> → 새로 마운트`}
          </pre>
          <p className="mt-1.5">
            세 Drawer는 같은 컴포넌트이고 모두 자기 <code>useState</code>(열림·메모)와 DOM 스크롤을 가진다. 차이는 렌더링
            위치와 <code>key</code>뿐이다. layout은 하위 page가 바뀌어도 리마운트되지 않고, React는 <code>key</code>가
            바뀐 컴포넌트를 새 인스턴스로 교체한다.
          </p>
        </div>
        <div>
          <h5 className={H}>3. 무엇을 보존하고 무엇을 초기화할까</h5>
          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>
              사용자가 의도적으로 열어 둔 장바구니, 작성 중인 배송 메모처럼 <strong>작업의 연속성</strong>이 있는 상태는 공유
              layout에 둔다.
            </li>
            <li>
              카테고리마다 닫힌 채로 시작해야 하는 일시적 패널은 page에 두거나, layout에 두되 <code>key</code>를 경로·항목
              ID로 바꿔 초기화한다.
            </li>
            <li>
              <code>window.location.href</code> 같은 전체 새로고침은 layout 상태까지 모두 지운다. 이 데모는 문서{' '}
              <code>performance.timeOrigin</code>이 이동 전후 같은지로 클라이언트 이동임을 확인한다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={H}>4. Cache Components를 켜면 달라지는 점 (이 zone에서는 측정하지 않음)</h5>
          <p>
            가이드에 따르면 <code>cacheComponents: true</code>인 앱은 이동한 page를 언마운트하지 않고 React{' '}
            <code>&lt;Activity&gt;</code>로 숨겨 최대 3개 경로의 상태와 DOM을 보존한다. 그 경우 page에 둔 Drawer도 돌아왔을
            때 열려 있을 수 있으므로, 닫혀야 하는 UI는 <code>useLayoutEffect</code> cleanup이나 <code>Link</code>의{' '}
            <code>onNavigate</code>로 명시적으로 초기화해야 한다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
