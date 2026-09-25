import type { MetadataRoute } from 'next'
import { cookies } from 'next/headers'
import { MANIFEST_THEME_COOKIE, SEGMENT_PATH, resolveThemePreset } from './theme-presets'

/**
 * app/manifest.ts와 완전히 같은 시그니처(default export, 인자 없음, `MetadataRoute.Manifest`
 * 반환)로 작성한 실제 매니페스트 생성 함수다. 내부에서 request-time API인 `cookies()`를
 * 호출하므로, 공식 문서의 "Good to know"(`manifest.js`는 request-time API나 dynamic 옵션을
 * 쓰지 않는 한 기본적으로 캐시되는 특수 Route Handler다)가 실제로 적용된다 — 매 요청마다
 * 쿠키에 저장된 테마 프리셋을 다시 읽어 theme_color/background_color를 계산한다.
 *
 * 다만 Next.js는 manifest.ts를 app 디렉터리의 "루트"에서만 특수 파일로 인식한다.
 * node_modules/next/dist/lib/metadata/is-metadata-route.js의 매니페스트 정규식이
 * `^[\/]manifest...`로 문자열 시작 위치에 고정돼 있어, 이 파일처럼 중첩 세그먼트에 있는
 * 경로("/zone/.../manifest.ts")와는 매칭되지 않는다. 실제로 이 파일을 이 위치에 둔 채
 * `next dev --port 3017`로 `/zone/.../dynamic-pwa-manifest/manifest.webmanifest`를 요청하면
 * Next.js 라우터가 이 파일을 전혀 모른 채 404를 반환한다(실측 확인, No-Simulation 원칙에 따라
 * 이 사실을 숨기지 않는다). 그래서 이 데모는 같은 세그먼트의 실제 Route Handler
 * (`manifest.webmanifest/route.ts`)가 아래 함수를 그대로 import해 호출해서, "코드가 그대로
 * 실제 응답 JSON이 된다"는 과정만은 정직하게 실증한다.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieStore = await cookies()
  const preset = resolveThemePreset(cookieStore.get(MANIFEST_THEME_COOKIE)?.value)

  return {
    name: 'Next.js 스터디 랩 쇼핑몰 (PWA)',
    short_name: '스터디몰',
    description: `Next.js 16 App Router manifest.ts 실습 — 현재 테마: ${preset.label}`,
    start_url: SEGMENT_PATH,
    display: 'standalone',
    background_color: preset.backgroundColor,
    theme_color: preset.themeColor,
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
