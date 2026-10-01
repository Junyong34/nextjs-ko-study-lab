// 같은 zone(baseline) 안의 도착 화면. 소프트 이동이면 출발 문서가 그대로 살아 있다.
export default function ArrivalPage() {
  return (
    <main data-hop-screen="arrival" className="p-4 text-sm">
      <p className="font-bold">도착: baseline zone (hop/arrival)</p>
    </main>
  )
}
