import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PreventFlashSection } from './components/PreventFlashSection'

const BLOCKING_SCRIPT = `
(function() {
  try {
    var theme = localStorage.getItem('demo_darkmode-script_theme') || 'dark';
    document.documentElement.dataset.demoTheme = theme;
  } catch (e) {}
})();
`

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* React 하이드레이션 전에 동기 실행되는 실제 인라인 스크립트 */}
      <script dangerouslySetInnerHTML={{ __html: BLOCKING_SCRIPT }} />
      <DemoGuideCard
        title={"인라인 블로킹 스크립트를 통한 다크모드 깜빡임(FOUC) 방지"}
        concept={"동기식 인라인 스크립트를 React 렌더링보다 먼저 배치하면, 하이드레이션 전에 localStorage 테마 값을 읽어 documentElement에 즉시 반영할 수 있다. React가 나중에 같은 값을 읽어도 이미 적용된 상태이므로 깜빡임(FOUC)이 없다."}
        steps={[
          {
            step: 1,
            title: "document.documentElement.dataset.demoTheme 값 확인",
            description: "인라인 스크립트가 하이드레이션 전에 이미 설정해 둔 값을 확인합니다.",
            actionBadge: "테마 상태 확인",
          },
          {
            step: 2,
            title: "[테마 토글 (새로고침하며 검증)] 버튼 클릭",
            description: "localStorage 값을 바꾸고 새로고침하여 인라인 스크립트가 새 값을 반영하는지 확인합니다.",
            actionBadge: "테마 토글",
          },
          {
            step: 3,
            title: "localStorage 값과 documentElement 값 일치 확인",
            description: "새로고침 후에도 두 값이 항상 일치하는지 검증합니다.",
            actionBadge: "일치 검증",
            observe: "localStorage와 document.documentElement.dataset.demoTheme 값의 일치 여부 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <PreventFlashSection />
    </DemoContainer>
  )
}
