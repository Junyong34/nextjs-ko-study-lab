// 폴더 이름에 확장자가 있는 Route Handler. URL이 /catalog/spec.txt 인 "파일처럼 보이는" 경로를 만든다.
// trailingSlash 문서가 말하는 확장자 경로 예외를 실제 경로로 확인하기 위한 대상이다.
export function GET() {
  return new Response('러닝화 카탈로그 사양서 (text/plain)\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
