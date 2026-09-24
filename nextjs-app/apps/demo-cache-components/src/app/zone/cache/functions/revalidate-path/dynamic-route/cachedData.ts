import type { ProductSnapshot } from './types'

// 'use cache' 엔트리는 렌더 중인 라우트의 암묵적 태그(구체 경로 + 라우트 패턴/page)를 함께 기록한다.
// revalidatePath는 이 암묵적 태그를 만료시키므로, 다음 요청 때 이 함수 본문이 다시 실행되어 cacheId가 바뀐다.
export async function getProductSnapshot(id: string): Promise<Omit<ProductSnapshot, 'requestedAt'>> {
  'use cache'
  return {
    id,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    cachedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
  }
}
