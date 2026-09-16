import { ThemeBadge } from './ThemeBadge'

/**
 * 실제 Suspense 스트리밍 청크를 만들기 위한 지연 Server Component.
 * 이 컴포넌트가 resolve되며 만드는 두 번째 플러시에서 useServerInsertedHTML이
 * 다시 호출되고, 그 결과는 이미 닫힌 <head> 대신 body 안에 인라인으로 삽입된다.
 */
export async function DelayedMouseBadge() {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return <ThemeBadge productKey="mouse" />
}
