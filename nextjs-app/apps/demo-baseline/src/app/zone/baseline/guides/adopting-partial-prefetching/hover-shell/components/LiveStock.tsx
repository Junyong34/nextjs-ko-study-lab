import { connection } from 'next/server'
import { STOCK_DELAY_MS } from '../data'

// 요청 시점에만 실행되는 동적 영역. connection()으로 프리렌더에서 제외하고 일부러 지연시킨다.
export async function LiveStock({ id }: { id: string }) {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, STOCK_DELAY_MS))
  const stock = 3 + (Math.floor(Date.now() / 1000) % 17)
  return (
    <p className="text-xs text-zinc-700 dark:text-zinc-300" data-live-stock>
      실시간 재고 <strong>{stock}개</strong> · 서버 렌더 시각 <code>{new Date().toISOString()}</code> · 상품 {id}
    </p>
  )
}
