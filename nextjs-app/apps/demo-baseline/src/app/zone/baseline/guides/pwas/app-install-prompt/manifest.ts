import type { MetadataRoute } from 'next'
import { BACKGROUND_COLOR, ICON_SIZES, SEGMENT_PATH, THEME_COLOR, iconUrl } from './constants'

/**
 * app/manifest.ts와 같은 시그니처(default export, 인자 없음, `MetadataRoute.Manifest` 반환)의
 * 세그먼트 레벨 매니페스트다. Next.js는 manifest.ts를 app 루트에서만 특수 파일로 인식하므로
 * (metadata-manifest/dynamic-pwa-manifest 선례에서 실측), 같은 세그먼트의
 * manifest.webmanifest/route.ts가 이 함수를 호출해 실제 응답을 만든다.
 *
 * scope를 슬래시 없는 SEGMENT_PATH로 둔 이유: Next.js는 기본적으로 `/경로/`를 `/경로`로
 * 308 리다이렉트하므로, start_url(`/경로?source=pwa`)이 scope(`/경로/`) 밖이 되는 일을 피한다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: SEGMENT_PATH,
    name: 'Next.js 스터디 랩 — PWA 설치 실습',
    short_name: '설치 실습',
    description: 'manifest.ts, 서비스 워커, beforeinstallprompt로 홈 화면 설치 조건을 직접 확인하는 실습 앱',
    start_url: `${SEGMENT_PATH}?source=pwa`,
    scope: SEGMENT_PATH,
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: ICON_SIZES.map((size) => ({
      src: iconUrl(size),
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any' as const,
    })),
  }
}
