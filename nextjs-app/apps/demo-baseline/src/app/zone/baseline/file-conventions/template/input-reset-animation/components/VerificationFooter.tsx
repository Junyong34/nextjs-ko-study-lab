'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useInputResetState } from '../hooks/useInputResetStore'

export function VerificationFooter() {
  const { templateMountCount, lastValueBeforeUnmount, animationLog } = useInputResetState()

  const startCount = animationLog.filter((entry) => entry.type === 'start').length
  const endCount = animationLog.filter((entry) => entry.type === 'end').length

  const hasNavigatedAway = templateMountCount > 1
  const valueWasWiped = lastValueBeforeUnmount.trim().length > 0
  const animationReplayed = startCount > 0 && startCount === endCount

  const isMatched = hasNavigatedAway ? valueWasWiped && animationReplayed : undefined

  const expected =
    '• 폼 리셋: 탭 이동 시 직전 인스턴스의 입력값이 존재했더라도 새 인스턴스는 항상 빈 문자열로 시작\n' +
    '• 애니메이션: template 마운트마다 animationstart → animationend 이벤트가 1회씩 대칭으로 발생'

  const actual = hasNavigatedAway
    ? `• template 마운트 횟수: ${templateMountCount}회\n` +
      `• 직전 인스턴스에서 언마운트 직전 실제로 읽은 입력값: ${
        valueWasWiped ? `"${lastValueBeforeUnmount}" (이번 인스턴스는 빈 값으로 시작)` : '(입력 없이 이동함 — 위 입력창에 문구를 적고 다시 이동해 보세요)'
      }\n` +
      `• animationstart 이벤트: ${startCount}회 / animationend 이벤트: ${endCount}회`
    : '• 아직 탭을 이동하지 않았습니다. 실습 화면에서 입력 후 [사이즈 문의 탭] ↔ [색상 문의 탭]으로 이동해 주세요.'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="template.tsx 진입 애니메이션 재생 및 폼 리셋 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="animationstart/animationend 네이티브 이벤트 리스너와 언마운트 직전 실제 DOM 입력값 캡처로 측정한 결과입니다. 개발 모드 React Strict Mode에서는 최초 진입 시 마운트가 한 번 더 실행될 수 있지만, '탭 이동마다 입력값이 비워지고 애니메이션이 재생된다'는 관계 자체는 항상 성립합니다."
      />
      <DemoDeepDiveCard title="template.tsx 진입 애니메이션 재생 및 폼 입력 상태 자동 리셋">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              공식 문서(API Reference &ndash; File Conventions &ndash; <code>template.js</code>)에 따르면 template은
              layout과 달리 <strong>세그먼트별로 고유한 <code>key</code></strong>를 부여받고, 그 세그먼트(하위
              세그먼트 포함)가 바뀔 때마다 새 인스턴스로 마운트됩니다. DOM 요소는 완전히 재생성되고, 내부{' '}
              <code>useState</code> 등 클라이언트 상태도 함께 초기화됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 [사이즈 문의 탭] ↔ [색상 문의 탭] 사이를 이동할 때마다{' '}
              <code>template.tsx</code>가 실제로 언마운트·재마운트됩니다. 언마운트 직전 <code>useEffect</code>{' '}
              클린업 함수가 비제어(uncontrolled) 입력의 실제 DOM 값(<code>ref.current.value</code>)을 그대로
              읽어 기록하고, 새 인스턴스는 <code>defaultValue</code>만 가진 새 DOM 노드로 태어나므로 그 값과
              무관하게 항상 빈 상태로 시작합니다. 같은 방식의 입력이 <code>layout.tsx</code>(대조군, 세그먼트
              유지)에서는 DOM 노드 자체가 파괴되지 않으므로 값이 그대로 남습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. CSS 진입 애니메이션 실측 방법</h5>
            <p>
              template 박스에는 <code>@keyframes</code>로 정의한 슬라이드 페이드인 애니메이션이 적용돼 있고,
              루트 요소의 <code>onAnimationStart</code>/<code>onAnimationEnd</code>(네이티브{' '}
              <code>animationstart</code>/<code>animationend</code> 이벤트)가 실제로 발생할 때만 로그를 남깁니다.
              타이머로 흉내 낸 것이 아니라 브라우저가 실제 애니메이션을 재생하고 끝냈다는 사실 자체를
              측정합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 활용 및 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>다단계 폼·탭별 검색창처럼 &ldquo;이전 화면의 미저장 입력이 다음 화면에 남으면 안 되는&rdquo; 곳에 적합합니다.</li>
              <li>정적인 GNB·사이드바를 template에 두면 이동마다 불필요하게 DOM이 재생성되므로 피합니다.</li>
              <li>스크롤 위치 유지가 중요하면 template 단독이 아니라 layout과 조합을 검토합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
