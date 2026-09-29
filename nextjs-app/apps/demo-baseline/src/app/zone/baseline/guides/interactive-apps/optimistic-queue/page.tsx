import type { Metadata } from 'next'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { getDemoMetadata } from '@study/demos'
import { DeepDive } from './components/DeepDive'
import { LayoutLab } from './components/LayoutLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/interactive-apps/optimistic-queue')

export default function OptimisticQueuePage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="겹치는 낙관적 저장 조율: useActionState 큐와 롤백"
        concept="저장이 끝나기 전에 다음 변경이 들어오면, 확정 상태를 기준으로 계산한 스냅샷은 앞선 변경을 지웁니다. useActionState 큐가 이전 저장의 결과 위에 변경을 쌓고, useOptimistic이 그 사이를 즉시 보여 줍니다."
        steps={[
          {
            step: 1,
            title: '[naive] 선택 후 저장 대기 중에 채널 두 개 이동',
            description: '#general을 [→ 즐겨찾기]로 옮기고, 1.2초가 지나기 전에 #random을 [→ 보관]으로 옮깁니다.',
            actionBadge: '연속 이동',
            observe: '두 번째 이동 직후 첫 이동이 화면에서 사라지고, 저장 완료 후 서버 저장본에도 없음',
            observeAt: 'verification',
          },
          {
            step: 2,
            title: '[queued]로 바꿔 같은 조작 반복',
            description: '모드를 바꾸면 서버 저장본이 초기화됩니다. 같은 두 이동을 1.2초 안에 반복합니다.',
            actionBadge: '큐 처리',
            observe: '이동 즉시 화면이 바뀌고 [저장 중] 배지가 표시되며, 완료 후 두 이동이 모두 저장본에 남음',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[다음 이동 저장을 서버에서 실패시키기] 체크 후 이동',
            description: '실패를 켠 채 채널을 옮기면 서버 Action이 예외를 던집니다.',
            actionBadge: '롤백',
            observe: '화면이 잠시 이동된 뒤 마지막 확정 레이아웃으로 돌아가고 오류 메시지가 표시됨',
            observeAt: 'verification',
          },
          {
            step: 4,
            title: '[서버 저장본 다시 읽기]로 서버 메모리 값 확인',
            description: '클라이언트 상태가 아니라 서버 모듈 메모리의 값을 직접 읽어 검증 패널의 값과 비교합니다.',
            actionBadge: '서버 확인',
            observe: '서버가 돌려준 저장본과 다시 읽은 값이 같음',
            observeAt: 'verification',
          },
        ]}
      />
      <LayoutLab />
      <DeepDive />
    </DemoContainer>
  )
}
