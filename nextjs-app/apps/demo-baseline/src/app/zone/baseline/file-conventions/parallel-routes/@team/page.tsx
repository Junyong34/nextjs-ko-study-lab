import { TeamNote } from '../components/TeamNote'
export default function Page() {
  return <section data-slot="team" data-screen="home" className="rounded border p-4 text-sm"><h3 className="font-semibold">운영팀</h3><p>분석 상세로 이동해도 이 메모는 유지됩니다.</p><TeamNote /></section>
}
