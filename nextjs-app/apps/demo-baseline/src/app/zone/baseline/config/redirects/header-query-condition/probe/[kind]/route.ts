// redirects() 규칙의 조건이 충족되지 않았을 때 요청이 도달하는 종착지.
// redirects()는 파일 시스템보다 먼저 검사되므로, 이 핸들러의 200 응답은 "리다이렉트 없이 통과했다"는 실제 증거다.
export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params
  return Response.json({ passedThrough: true, kind })
}
