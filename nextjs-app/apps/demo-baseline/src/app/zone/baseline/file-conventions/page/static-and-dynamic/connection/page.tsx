import { connection } from 'next/server'
import { RenderStamp } from '../components/RenderStamp'

/**
 * 요청 정보를 읽지는 않지만 connection()을 await한다.
 * "실제 요청이 들어올 때까지 렌더링을 미룬다"는 선언이라, 요청 데이터를 쓰지 않는 page도 요청마다 렌더링(ƒ)된다.
 */
export default async function ConnectionPage() {
  await connection()
  return <RenderStamp file="connection/page.tsx" api="await connection()" />
}
