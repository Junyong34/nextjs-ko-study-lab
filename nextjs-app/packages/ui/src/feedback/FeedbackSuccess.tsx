import React from 'react'
import { CheckCircle2 } from 'lucide-react'

/** 메일 클라이언트를 연 뒤 보여주는 안내. */
export function FeedbackSuccess() {
  return (
    <div className="py-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
      <h4 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
        메일 프로그램이 열렸습니다
      </h4>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        작성한 내용을 확인한 뒤 메일 프로그램에서 전송해 주세요.
      </p>
    </div>
  )
}
