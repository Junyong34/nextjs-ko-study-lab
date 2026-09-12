import { DemoGuideCard } from '@study/demo-kit'

export function RedirectGuide() {
  return (
    <DemoGuideCard
      title="상품 제출 후 완료 화면으로 이동하기"
      concept="Server Action은 상품을 검증하고 확인서를 저장한 뒤 redirect()로 완료 화면을 엽니다. JavaScript를 끄면 같은 폼이 HTTP 303 → GET으로 이동합니다."
      steps={[
        { step: 1, title: '상품과 수량 제출', description: '상품과 수량 1~10개를 정해 제출하세요. 완료 화면의 상품·수량이 선택한 값과 같은지 확인합니다.', actionBadge: '상품 제출' },
        { step: 2, title: '성공과 실패 비교', description: '초기화 후 수량 0으로 제출하세요. 서버 오류가 표시되고 완료 화면으로 이동하지 않아야 합니다.', actionBadge: '입력 오류 확인' },
        { step: 3, title: '303을 Network에서 관찰', description: 'Network 기록 보존(Preserve log)을 켜세요. JS가 켜져 있으면 POST 200과 x-action-redirect를, JS를 끄고 새로고침해 제출하면 POST 303·Location 뒤 GET을 확인합니다.', actionBadge: '요청 비교', observe: '화면의 확인서 일치와 HTTP 상태 코드는 서로 다른 검증입니다.', observeAt: 'verification' },
      ]}
    />
  )
}
