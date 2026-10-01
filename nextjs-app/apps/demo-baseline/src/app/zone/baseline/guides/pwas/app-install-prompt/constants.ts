// 이 데모가 소유한 세그먼트의 실제 URL들. manifest·서비스 워커·아이콘이 모두 이 경로 아래에서 서빙된다.
// (학습자 주소창은 셸 도메인이지만 셸이 /zone/baseline/* 를 그대로 rewrite하므로 같은 origin의 같은 경로다.)
export const SEGMENT_PATH = '/zone/baseline/guides/pwas/app-install-prompt'
export const MANIFEST_URL = `${SEGMENT_PATH}/manifest.webmanifest`
export const SW_URL = `${SEGMENT_PATH}/sw.js`
export const ICON_SIZES = [192, 512] as const
export const iconUrl = (size: number) => `${SEGMENT_PATH}/icon/${size}`

export const THEME_COLOR = '#4f46e5'
export const BACKGROUND_COLOR = '#ffffff'
