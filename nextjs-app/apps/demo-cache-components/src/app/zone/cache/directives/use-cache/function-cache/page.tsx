import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseCacheFunctionDemo } from './components/DirectiveUseCacheFunctionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache' 비동기 함수 단위 캐시 격리"}
        concept={"Next.js 16 'use cache'를 개별 비동기 함수에 선언하고 cacheTag('product-detail')를 부여하면, 해당 함수의 반환값만 독립 캐시되어 DB 쿼리 부하를 0으로 줄입니다."}
        steps={[
        {
        "step": 1,
        "title": "캐시 대상 상품 ID 버튼 선택",
        "description": "상품 ID(PROD-01)를 선택하여 캐시된 비동기 함수 getProductDetails()를 호출합니다.",
        "actionBadge": "함수 호출"
        },
        {
        "step": 2,
        "title": "캐시 HIT (0ms) 응답 확인",
        "description": "두 번째 호출부터는 서버 DB 연산 없이 메모리 캐시에서 0ms로 즉각 반환(HIT)되는 것을 확인합니다.",
        "actionBadge": "캐시 HIT"
        },
        {
        "step": 3,
        "title": "[🔄 revalidateTag('product-detail') 실행] 클릭",
        "description": "캐시 태그를 무효화하여 다음 호출 시 새로운 데이터(MISS)를 가져오도록 캐시를 갱신합니다.",
        "actionBadge": "태그 무효화",
        "observe": "태그 무효화 후 다음 호출 시 MISS 상태로 새 데이터가 페칭되고 다시 HIT로 전환되는 과정 대조",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"'use cache' 지시어를 통한 비동기 함수 결과 캐싱 실습"}>
        <DirectiveUseCacheFunctionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
