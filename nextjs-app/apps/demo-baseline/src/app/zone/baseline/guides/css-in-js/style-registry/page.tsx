import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { StyleRegistryDemo } from './components/StyleRegistryDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Style Registry를 통한 CSS-in-JS SSR 스타일 주입"
        concept="런타임 CSS-in-JS는 렌더 중에 규칙을 만든다. registry가 그 규칙을 수집해 useServerInsertedHTML로 첫 HTML의 <head>에 flush하고, 클라이언트는 같은 registry로 SSR 규칙을 재사용하며 새 규칙만 추가한다. registry가 없으면 규칙이 하이드레이션 뒤에야 도착해 FOUC가 생긴다."
        steps={[
          {
            step: 1,
            title: '[두 라우트 원본 HTML 실측] 클릭',
            description: '서버가 registry 있음/없음 두 라우트를 직접 요청해 하이드레이션 이전의 원본 HTML을 분석합니다.',
            actionBadge: '서버 실측',
            observe: 'registry 있음은 head에 <style data-registry="ssr">이 있고 FOUC 없음, 없음은 style 0개에 FOUC 발생',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[하이드레이션 후 DOM 실측] 클릭',
            description: '이 화면의 SSR 규칙을 클라이언트 registry가 재사용했는지(adopted), 계산된 배경색이 규칙대로인지 읽습니다.',
            actionBadge: 'DOM 실측',
          },
          {
            step: 3,
            title: '[클라이언트 규칙 추가] 후 다시 실측',
            description: '런타임에 새 규칙이 생기면 data-registry="client" style만 추가되고 SSR 규칙은 중복되지 않는지 봅니다.',
            actionBadge: '동적 규칙',
            observe: '두 실측이 모두 끝나면 검증 패널이 검증 완료로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <StyleRegistryDemo />
    </DemoContainer>
  )
}
