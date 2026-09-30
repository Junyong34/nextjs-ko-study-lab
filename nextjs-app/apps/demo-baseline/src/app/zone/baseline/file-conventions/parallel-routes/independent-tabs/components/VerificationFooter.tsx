'use client'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { useSlotObservation } from '../hooks/useSlotObservation'
import { judge } from '../lib/judge'

export function VerificationFooter({ rootId }: { rootId: string }) {
  const { curr, prev, viaAnchor } = useSlotObservation(rootId)
  const v = judge(prev, curr, viaAnchor)
  return (
    <>
      <ExpectedActualPanel
        title="다른 슬롯이 유지되는지 실측"
        expected={<span className="whitespace-pre-wrap break-all">{v.expected}</span>}
        actual={<span className="whitespace-pre-wrap break-all">{v.actual}</span>}
        isMatched={v.isMatched}
        description="이동 직전과 직후의 DOM에서 슬롯별 화면, 인스턴스 id(마운트 시 생성), 메모 입력값을 읽어 비교합니다."
      />
      <DemoDeepDiveCard title="슬롯은 왜 서로 독립적으로 이동하는가">
        <p>layout.tsx는 children과 함께 @dashboard, @metrics를 props로 받습니다. @ 폴더 이름은 URL에 들어가지 않으므로 /sales와 /30d 같은 세그먼트는 각 슬롯 안에서만 해석됩니다.</p>
        <p>Link로 이동하는 소프트 내비게이션은 URL과 일치하는 슬롯만 부분 렌더링하고, 일치하지 않는 슬롯은 이전 화면을 그대로 둡니다. 그래서 인스턴스 id와 메모 state가 살아남습니다.</p>
        <p>새로고침이나 일반 &lt;a&gt; 이동은 전체 로드입니다. 이때 Next.js는 다른 슬롯의 활성 화면을 알 수 없어 default.tsx를 그립니다. 슬롯마다 default.tsx가 없으면 404가 됩니다. children도 암묵적 슬롯이라 default.tsx가 필요합니다.</p>
        <p>이 예제는 슬롯 이동의 독립성만 다룹니다. 슬롯별 loading·error 격리는 다루지 않습니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
