import { redirect } from 'next/navigation'
import { RECEIPT_PATH } from '../constants'

export function POST() {
  // 본문을 읽거나 다시 보내지 않습니다. 브라우저가 307을 따라 재전송합니다.
  redirect(RECEIPT_PATH)
}

export function GET(request: Request) {
  const query = new URL(request.url).search
  redirect(`${RECEIPT_PATH}${query}`)
}
