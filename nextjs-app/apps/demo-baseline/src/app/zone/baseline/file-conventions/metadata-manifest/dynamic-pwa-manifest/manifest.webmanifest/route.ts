import { NextResponse } from 'next/server'
import manifest from '../manifest'

/**
 * 실제 GET 엔드포인트. manifest.ts의 default export 함수를 그대로 호출해 응답을 만든다 —
 * 검증 화면에서 보여줄 값을 여기서 다시 계산하거나 흉내 내지 않는다.
 * 직렬화(JSON.stringify)와 Content-Type/Cache-Control 헤더는 Next.js가 루트 manifest.ts를
 * 처리할 때 내부적으로 쓰는 것과 동일한 값이다
 * (node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js,
 * .../metadata/resolve-route-data.js의 resolveManifest/CACHE_HEADERS.REVALIDATE 참고).
 */
export async function GET() {
  const data = await manifest()

  return new NextResponse(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
