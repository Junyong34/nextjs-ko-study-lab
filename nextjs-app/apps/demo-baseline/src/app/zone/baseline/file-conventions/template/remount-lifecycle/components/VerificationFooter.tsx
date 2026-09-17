'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useRemountCounts } from '../hooks/useRemountStore'

export function VerificationFooter() {
  const { layoutMountCount, layoutMountedAt, templateMountCount, templateMountedAt } =
    useRemountCounts()

  const hasNavigated = layoutMountCount > 0 && templateMountCount > 0
  const isMatched = hasNavigated ? templateMountCount > layoutMountCount : undefined

  const expected =
    '• layout.tsx 마운트 횟수: 최초 진입 이후 그대로 유지\n• template.tsx 마운트 횟수: 탭 이동마다 계속 증가해 결국 layout 횟수를 앞지름'

  const actual = hasNavigated
    ? `• layout 마운트 횟수: ${layoutMountCount}회 (최초 마운트 ${layoutMountedAt})\n• template 마운트 횟수: ${templateMountCount}회 (최근 마운트 ${templateMountedAt})`
    : '• 아직 탭을 이동하지 않았습니다. 실습 화면에서 [탭 A 진입 →] 또는 [탭 B 진입 →]을 눌러 세그먼트를 이동해 주세요.'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="template.tsx vs layout.tsx 리마운트 수명 주기 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="탭 A ↔ 탭 B ↔ 홈을 오가며 layout.tsx와 template.tsx가 실제로 몇 번 마운트됐는지 비교합니다. 개발 모드에서는 React Strict Mode로 인해 최초 마운트가 2회로 집계될 수 있지만, 'template 횟수 > layout 횟수' 관계 자체는 항상 성립합니다."
      />
      <DemoDeepDiveCard title="template.tsx vs layout.tsx 리마운트 수명 주기 & 인스턴스 재생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 라우팅 계층의 컴포넌트 렌더링 순서는{' '}
              <code>layout.js {'>'} template.js {'>'} error.js {'>'} loading.js {'>'} not-found.js {'>'} page.js</code>입니다
              (공식 문서 Project Structure &ndash; Component Hierarchy 기준). <code>template.tsx</code>는{' '}
              <code>layout.tsx</code>와 달리 자신이 속한 세그먼트 레벨에서 고유한 React <code>key</code>를 매번 새로
              부여받아, 그 세그먼트(하위 세그먼트 포함)가 바뀔 때마다 완전히 새 인스턴스로 마운트(Remount)되며 모든
              내부 상태가 초기화됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>/tab-a</code> ↔ <code>/tab-b</code> ↔ 홈(<code>/remount-lifecycle</code>) 사이를
              이동할 때마다 <code>layout.tsx</code>의 마운트 횟수·입력값·DOM은 그대로 유지되는 반면,{' '}
              <code>template.tsx</code>는 <code>useEffect</code>가 매번 재실행되어 마운트 횟수가 계속 증가하고, 내부{' '}
              <code>useState</code> 입력값과 진입 애니메이션이 즉시 리셋되는 수명 주기를 실측으로 확인합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>진입 애니메이션 100% 재실행</strong>: CSS/Framer-motion 페이드인 등 페이지 전환 시각 효과를 매번 깔끔하게 트리거합니다.</li>
              <li><strong>페이지 뷰(PV) 분석 로깅 자동화</strong>: 컴포넌트 마운트 시점의 <code>useEffect</code>를 통해 페이지 진입 텔레메트리 이벤트를 누락 없이 수집합니다.</li>
              <li><strong>폼 및 임시 상태 자동 클린업</strong>: 하위 세그먼트 전환 시 이전 페이지의 잔여 입력값이나 필터 상태를 부작용 없이 초기화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 탭 전환 시마다 부드러운 페이드인 진입 애니메이션 적용</li>
              <li>사용자 탐색 경로별 GA/엠플리튜드 페이지 진입 로깅 훅 연동</li>
              <li>피드백 작성 모달이나 문의하기 폼의 페이지 이동 시 자동 리셋</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>불필요한 리렌더링 오버헤드 주의</strong>: 정적인 UI 요소(GNB, 사이드바)를 <code>template.tsx</code>에 배치하면 매 네비게이션마다 불필요한 DOM 재생성 비용이 발생하므로 반드시 상태 리셋이 필요한 서브 래퍼에만 한정해야 합니다.</li>
              <li><strong>children Props 필수 렌더링</strong>: <code>template.tsx</code>는 <code>{'{'} children {'}'}: {'{'} children: React.ReactNode {'}'}</code>를 필수로 받아 렌더링해야 하위 페이지가 정상적으로 마운트됩니다.</li>
              <li><strong>개발 모드 카운트 오차</strong>: React Strict Mode(App Router 기본값 true)는 개발 모드에서 마운트 직후 한 번 더 마운트를 재실행하므로, 로컬 개발 환경에서는 마운트 횟수가 실제 이동 횟수의 2배로 보일 수 있습니다. 프로덕션 빌드에는 영향이 없습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
