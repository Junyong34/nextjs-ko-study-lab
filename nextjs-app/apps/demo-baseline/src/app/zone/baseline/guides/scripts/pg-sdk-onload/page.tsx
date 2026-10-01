import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PgSdkOnloadDemo } from './components/PgSdkOnloadDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/script strategy와 onLoad로 외부 결제 SDK 안전하게 초기화"
        concept="외부 SDK는 네트워크가 끝나기 전까지 window 전역 객체가 없다. next/script의 strategy는 언제 요청하는지를, onLoad/onReady/onError는 언제 쓸 수 있는지를 알려 준다. SDK에 의존하는 코드와 결제 버튼은 onLoad 이후에만 켜야 한다."
        steps={[
          {
            step: 1,
            title: '페이지 로드 직후 [strategy별 요청 시각] 표 확인',
            description: '같은 페이지에서 afterInteractive와 lazyOnload 스크립트가 실제로 언제 요청·실행됐는지 Resource Timing으로 읽습니다.',
            actionBadge: 'strategy 실측',
            observe: 'lazyOnload 요청 시작이 window load 시작보다 뒤',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[parallel] → [chained] 시도 실행',
            description: 'SDK(1200ms 지연)와 의존 플러그인을 동시에 마운트하면 순서가 뒤집히고, SDK onLoad 뒤에 마운트하면 성공하는지 비교합니다.',
            actionBadge: '순서 보장',
          },
          {
            step: 3,
            title: '로딩 중 [가드 없이 결제 요청] 클릭, 이어서 [error] 시도',
            description: 'SDK 준비 전 호출이 TypeError로 실패하는 것과 HTTP 500에서 onError만 호출되는 것을 확인합니다.',
            actionBadge: '호출 방지',
            observe: '필수 실측(parallel·chained)이 끝나면 검증 패널이 검증 완료로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <PgSdkOnloadDemo />
    </DemoContainer>
  )
}
