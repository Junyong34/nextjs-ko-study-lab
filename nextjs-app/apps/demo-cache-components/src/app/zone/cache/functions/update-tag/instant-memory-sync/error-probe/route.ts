import { updateTag } from 'next/cache'

/**
 * updateTag를 Route Handler에서 호출하면 실제로 어떤 일이 일어나는지 관측하는 엔드포인트.
 * 데이터는 변경하지 않고, 던져진 에러를 그대로 JSON으로 돌려준다.
 */
export async function POST() {
  try {
    updateTag('functions-update-tag-instant-memory-sync:cart-line:update')
    return Response.json({ threw: false, message: 'updateTag가 에러 없이 실행되었습니다.' })
  } catch (error) {
    const err = error as Error & { __NEXT_ERROR_CODE?: string }
    return Response.json({ threw: true, name: err.name, code: err.__NEXT_ERROR_CODE ?? null, message: err.message })
  }
}
