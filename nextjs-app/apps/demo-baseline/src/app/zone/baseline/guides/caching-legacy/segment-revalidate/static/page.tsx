import { RenderStamp } from '../components/RenderStamp'

/**
 * 대조군: revalidate를 선언하지 않은 정적 page (기본값 false = 사실상 무기한).
 * next build 때 만든 결과를 다음 배포(또는 revalidatePath 같은 요청 기반 무효화)까지 계속 서빙한다.
 */
export default function StaticPage() {
  return <RenderStamp file="static/page.tsx" config="revalidate 미지정 (기본값 false)" />
}
