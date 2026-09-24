import { RenderStamp } from '../components/RenderStamp'

/**
 * 시간 기반 ISR 대상 page.
 * - next build 때 한 번 렌더링되어 저장된다(런타임 API를 쓰지 않으므로 정적).
 * - 저장된 결과는 10초 동안 그대로 서빙된다(x-nextjs-cache: HIT).
 * - 10초가 지난 뒤 첫 요청은 저장돼 있던 옛 결과를 즉시 받고(STALE), 서버는 백그라운드에서 page를 다시 렌더링한다.
 * - 재생성이 끝난 뒤의 요청부터 새 렌더 ID가 나온다.
 * 값은 정적으로 분석 가능한 숫자 리터럴이어야 한다(예: 60 * 10 같은 식은 불가).
 */
export const revalidate = 10

export default function IsrTenSecondsPage() {
  return <RenderStamp file="isr-10s/page.tsx" config="export const revalidate = 10" />
}
