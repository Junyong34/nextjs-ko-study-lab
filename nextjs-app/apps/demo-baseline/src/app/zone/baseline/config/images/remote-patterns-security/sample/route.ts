// 데모 앱에는 public/을 둘 수 없어서(apps/AGENTS.md 5항) <Image>에 넣을 로컬 이미지를 Route Handler로 만든다.
const WIDTH = 640
const HEIGHT = 320

export async function GET() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">` +
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="#27272a"/>` +
    `<text x="50%" y="50%" fill="#fafafa" font-size="28" font-family="monospace" text-anchor="middle" dominant-baseline="middle">original ${WIDTH}px · sample/route.ts</text>` +
    `</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store',
    },
  })
}
