import type { AcceptReading, FormatSupport } from '../types'
import { ACCEPT_PATH, SAMPLE_BASE64 } from './constants'

/** 화면 밖 <img>로 accept/route.ts를 요청해 브라우저의 이미지 Accept를 쿠키에 남기고, fetch()로 되읽는다. */
export async function readAcceptHeaders(): Promise<AcceptReading> {
  await new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('accept/route.ts 이미지 요청 실패'))
    img.src = `${ACCEPT_PATH}?mode=img&n=${Date.now()}`
  })
  const res = await fetch(`${ACCEPT_PATH}?mode=read&n=${Date.now()}`, { cache: 'no-store' })
  return (await res.json()) as AcceptReading
}

async function canDecode(kind: 'avif' | 'webp'): Promise<boolean> {
  try {
    const bytes = Uint8Array.from(atob(SAMPLE_BASE64[kind]), (c) => c.charCodeAt(0))
    const bitmap = await createImageBitmap(new Blob([bytes], { type: `image/${kind}` }))
    const ok = bitmap.width === 2 && bitmap.height === 2
    bitmap.close()
    return ok
  } catch {
    return false
  }
}

function canEncode(kind: 'avif' | 'webp'): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 2
  // 지원하지 않는 타입을 넣으면 브라우저는 PNG로 인코드한다.
  return canvas.toDataURL(`image/${kind}`).startsWith(`data:image/${kind}`)
}

export async function detectSupport(): Promise<FormatSupport> {
  const [avif, webp] = await Promise.all([canDecode('avif'), canDecode('webp')])
  return { decode: { avif, webp }, encode: { avif: canEncode('avif'), webp: canEncode('webp') } }
}
