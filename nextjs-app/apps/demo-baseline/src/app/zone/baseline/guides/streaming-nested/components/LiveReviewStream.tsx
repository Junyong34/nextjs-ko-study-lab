import React from 'react'
import type { Review } from '../types'
import { MountNotifier } from './MountNotifier'

async function getReviews(): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { id: 'rev-1', author: '프로개발자', rating: 5, comment: '가스켓 구조라 통울림이 전혀 없고 타건감이 부드럽습니다.' },
    { id: 'rev-2', author: '디자이너K', rating: 5, comment: '알루미늄 아노다이징 마감이 맥북 스페이스 그레이와 완벽히 어울려요.' },
  ]
}

export async function LiveReviewStream() {
  const reviews = await getReviews()

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <MountNotifier target="reviews" />
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          구매자 실시간 사용 후기 (중첩 스트리밍 청크)
        </h4>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          1000ms 청크 (2단계)
        </span>
      </div>

      <div className="space-y-2">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {r.author}
              </span>
              <span className="font-mono text-amber-500 font-bold">
                {'★'.repeat(r.rating)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              {r.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
