import { RenderStamp } from '../components/RenderStamp'

/**
 * 런타임 API(cookies/headers/searchParams/connection)를 하나도 쓰지 않는 page.
 * new Date()와 crypto.randomUUID()를 호출하더라도 요청 정보에 의존하지 않으므로,
 * next build가 이 page를 한 번 실행해 결과를 정적 HTML(○)로 저장한다.
 */
export default function StaticPage() {
  return <RenderStamp file="static/page.tsx" api="런타임 API 없음" />
}
