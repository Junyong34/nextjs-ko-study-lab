import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/analytics/custom-beacon')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { BeaconLab } from './components/BeaconLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="navigator.sendBeacon으로 상품 클릭 이벤트 전송하고 서버 수신 확인"
        concept="sendBeacon()은 응답을 기다리지 않고 브라우저 전송 큐에 요청을 맡깁니다. 그래서 반환값 true는 '큐 등록'일 뿐이고, 서버가 받았는지는 서버 쪽 기록을 따로 조회해야 압니다."
        steps={[
          {
            step: 1,
            title: "[구매하기 클릭] 버튼으로 정상 엔드포인트에 비콘 전송",
            description: "Blob(application/json) 본문을 navigator.sendBeacon()으로 이 디렉토리의 Route Handler(api/route.ts)에 POST합니다. 화면에는 반환값과 id가 표시됩니다.",
            actionBadge: "비콘 전송",
            observe: "서버 수신 목록에 같은 id가 POST · application/json으로 추가되고, 검증 패널이 성공으로 바뀝니다. 개발 서버 터미널에도 [custom-beacon] 로그가 찍힙니다.",
            observeAt: "playground",
          },
          {
            step: 2,
            title: "[잘못된 엔드포인트] 버튼으로 실패 사례 확인",
            description: "존재하지 않는 경로로 보내도 sendBeacon()은 true를 반환합니다. 서버 목록에는 id가 없습니다.",
            actionBadge: "실패 사례",
            observe: "반환값은 true인데 서버 수신 목록에 id가 없고 검증 패널이 실패로 표시됩니다.",
            observeAt: "playground",
          },
          {
            step: 3,
            title: "[서버 기록 초기화]로 다시 실행",
            description: "서버 메모리 목록을 비우고 검증을 대기 상태로 되돌립니다. 이 목록은 서버 프로세스 단위라 재시작하거나 서버리스 인스턴스가 바뀌면 사라집니다.",
            actionBadge: "초기화",
          },
        ]}
      />
      <BeaconLab />
    </DemoContainer>
  )
}
