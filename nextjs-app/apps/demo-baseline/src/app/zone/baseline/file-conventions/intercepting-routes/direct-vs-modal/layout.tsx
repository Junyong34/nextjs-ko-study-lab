import React from 'react'

/**
 * 이 데모 전용 병렬 라우트(@modal) 경계. 형제 데모 file-conventions/intercepting-routes의
 * @modal 슬롯과는 독립된 별도 슬롯이다 — target/[id]가 (.)target/[id]로 가로채지는
 * "같은 레벨" 관계는 이 layout이 정의하는 세그먼트 depth를 기준으로 계산된다.
 */
export default function DirectVsModalLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
      {modal}
    </div>
  )
}
