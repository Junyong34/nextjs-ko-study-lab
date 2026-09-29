import { SAVE_DELAY_MS } from '../constants'
import { NewEventButton, ResetControl } from './HeaderControls'

/** Server Component 헤더. 안쪽의 Client 버튼만 Context에 접근한다. */
export function EventsHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-zinc-500">
        서버 Action에 관찰용 지연 {SAVE_DELAY_MS}ms · 저장소는 공유 모듈 메모리(재시작 시 초기화)
      </p>
      <div className="flex items-center gap-2">
        <NewEventButton />
        <ResetControl />
      </div>
    </div>
  )
}
