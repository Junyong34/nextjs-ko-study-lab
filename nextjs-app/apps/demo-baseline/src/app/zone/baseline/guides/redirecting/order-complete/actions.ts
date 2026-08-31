'use server'

import { redirect } from 'next/navigation'

export async function completeOrderAction() {
  // 결제 승인 처리(가정) 후 실제 Next.js redirect()를 호출한다.
  // redirect()는 NEXT_REDIRECT 예외를 던져 프레임워크가 클라이언트 라우터를 실제로 이동시킨다.
  redirect('/zone/baseline/guides/redirecting/order-complete/complete?amount=219000')
}
