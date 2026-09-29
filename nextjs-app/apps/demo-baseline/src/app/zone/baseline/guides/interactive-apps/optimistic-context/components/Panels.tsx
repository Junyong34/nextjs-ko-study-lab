import { getSavedEvents } from '../actions'
import { EventsVerification } from './EventsVerification'
import { SummaryBoard } from './SummaryBoard'
import { WeekBoard } from './WeekBoard'

// 아래 세 컴포넌트는 Server Component다. 공급자(Client)와 뷰(Client) 사이에서 서버 데이터를 읽는다.
export async function WeekPanel() {
  return <WeekBoard events={await getSavedEvents()} />
}

export async function SummaryPanel() {
  return <SummaryBoard events={await getSavedEvents()} />
}

export async function VerificationPanel() {
  return <EventsVerification events={await getSavedEvents()} />
}
