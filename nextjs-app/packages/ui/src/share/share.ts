import type {
  ExecuteShareOptions,
  NavigatorLike,
  ShareData,
  ShareExecutionResult,
} from './types'

/**
 * 상대 URL을 주어진 origin(또는 window.location.origin) 기준의 절대 URL로 정규화합니다.
 * 이미 http/https로 시작하는 절대 URL인 경우 그대로 반환합니다.
 */
export function normalizeShareUrl(url: string, origin?: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  const baseOrigin =
    origin ??
    (typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : undefined)

  if (!baseOrigin) {
    return url
  }

  try {
    return new URL(url, baseOrigin).toString()
  } catch {
    return url
  }
}

function isAbortError(error: unknown): boolean {
  if (!error) return false
  if (error instanceof Error && error.name === 'AbortError') return true
  if (typeof error === 'object' && 'name' in error && (error as { name?: string }).name === 'AbortError') return true
  return false
}

/**
 * 공유 실행 로직:
 * 1. Web Share API(navigator.share)를 우선 시도합니다.
 *    - 성공 시 즉시 종료 ({ success: true, method: 'share' })
 *    - AbortError 발생 시 사용자 취소로 간주하여 복사나 에러를 발생시키지 않고 종료 ({ success: false, method: 'canceled' })
 * 2. Web Share API 미지원 또는 취소 이외의 오류 시 navigator.clipboard.writeText()로 대체 전환합니다.
 *    - 클립보드 복사 성공 시 ({ success: true, method: 'clipboard' })
 * 3. 공유와 복사가 모두 실패하거나 클립보드 API가 없으면 에러 결과를 반환합니다.
 */
export async function executeShare(
  options: ExecuteShareOptions
): Promise<ShareExecutionResult> {
  const nav: NavigatorLike | undefined =
    options.navigator ??
    (typeof navigator !== 'undefined' ? (navigator as unknown as NavigatorLike) : undefined)

  const fullUrl = normalizeShareUrl(options.url, options.origin)

  // 1. Web Share API 시도
  if (nav && typeof nav.share === 'function') {
    try {
      const shareData: ShareData = {
        title: options.title,
        url: fullUrl,
      }
      if (options.text) {
        shareData.text = options.text
      }

      await nav.share(shareData)
      return { success: true, method: 'share' }
    } catch (error) {
      if (isAbortError(error)) {
        return { success: false, method: 'canceled' }
      }
      // 취소 이외의 실패는 클립보드로 전환
    }
  }

  // 2. Clipboard API 대체
  if (nav?.clipboard && typeof nav.clipboard.writeText === 'function') {
    try {
      await nav.clipboard.writeText(fullUrl)
      return { success: true, method: 'clipboard' }
    } catch (clipboardError) {
      return { success: false, method: 'error', error: clipboardError }
    }
  }

  // 3. 공유 및 복사 모두 실패
  return {
    success: false,
    method: 'error',
    error: new Error('공유와 복사가 모두 지원되지 않거나 실패했습니다.'),
  }
}
