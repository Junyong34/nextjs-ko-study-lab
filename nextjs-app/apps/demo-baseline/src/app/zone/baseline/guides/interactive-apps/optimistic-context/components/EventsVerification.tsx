'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { INITIAL_EVENTS } from '../constants'
import { useEventsState } from '../providers/EventsProvider'
import { describeEvents, eventChangeReducer, targetIdOf } from '../reducers/event-change-reducer'
import type { BoardEvent } from '../types'

export function EventsVerification({ events }: { events: BoardEvent[] }) {
  const { issued, isPending, pendingChanges } = useEventsState()
  const readOnlyIds = new Set(INITIAL_EVENTS.filter((e) => e.readOnly).map((e) => e.id))
  const accepted = issued.filter((c) => !readOnlyIds.has(targetIdOf(c)))
  const expected = describeEvents(accepted.reduce(eventChangeReducer, INITIAL_EVENTS))
  const actual = describeEvents(events)

  const started = issued.length > 0
  const isMatched = !started || isPending ? undefined : expected === actual

  return (
    <ExpectedActualPanel
      title="발행한 변경이 서버 이벤트에 모두 반영되었는가"
      isMatched={isMatched}
      description={
        started
          ? `발행한 변경 ${issued.length}건(읽기 전용 대상 ${issued.length - accepted.length}건 제외) · ${
              isPending ? `저장 진행 중, 대기 변경 ${pendingChanges.length}건 — 완료 후 판정합니다.` : '저장 완료'
            }`
          : '이벤트를 이동한 뒤 곧바로 길이를 바꾸거나, 읽기 전용 이벤트를 변경해 보세요.'
      }
      expected={`발행한 변경을 초기 이벤트에 순서대로 적용한 결과\n${expected}`}
      actual={`서버 Component가 방금 읽어 온 저장본\n${actual}`}
    />
  )
}
