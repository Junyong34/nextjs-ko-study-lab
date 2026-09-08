'use server'

import { headers } from 'next/headers'
import type { CsrfProbeState } from './types'

export async function inspectSameOriginAction(
  _previousState: CsrfProbeState,
  formData: FormData,
): Promise<CsrfProbeState> {
  if (formData.get('probe') !== 'same-origin-server-action') {
    return {
      status: 'error',
      message: '허용되지 않은 데모 입력입니다.',
      origin: null,
      host: null,
      forwardedHost: null,
      reachedAction: true,
    }
  }

  const requestHeaders = await headers()
  console.info('[csrf-demo] action reached')

  return {
    status: 'success',
    message: '프레임워크 검사를 통과해 Server Action 본문이 실행됐습니다.',
    origin: requestHeaders.get('origin'),
    host: requestHeaders.get('host'),
    forwardedHost: requestHeaders.get('x-forwarded-host'),
    reachedAction: true,
  }
}
