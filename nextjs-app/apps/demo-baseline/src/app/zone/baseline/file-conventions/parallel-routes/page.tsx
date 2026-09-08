import { getDemoMetadata } from '@study/demos'
export const metadata = getDemoMetadata('baseline', 'file-conventions/parallel-routes')
export default function Page() {
  return <section data-slot="children" data-screen="home" className="rounded border p-4 text-sm"><h3 className="font-semibold">운영 현황</h3><p>분석 화면과 운영팀 메모를 한 화면에서 확인합니다. 아래 내용은 실습용 예시입니다.</p></section>
}
