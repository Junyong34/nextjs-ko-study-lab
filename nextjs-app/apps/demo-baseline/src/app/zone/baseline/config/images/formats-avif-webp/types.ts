export type ImageFormat = 'image/avif' | 'image/webp'

/** 브라우저가 <img>와 fetch()로 보낸 Accept를 accept/route.ts가 받아 되돌려 준 값 */
export interface AcceptReading {
  imgAccept: string | null
  fetchAccept: string | null
}

/** 브라우저에서 실제로 실행해 본 포맷 지원 */
export interface FormatSupport {
  /** createImageBitmap으로 작은 샘플을 디코드해 성공했는가 */
  decode: Record<'avif' | 'webp', boolean>
  /** canvas.toDataURL(type)이 해당 타입으로 인코드했는가 */
  encode: Record<'avif' | 'webp', boolean>
}

/** 서버(Server Action)가 브라우저의 이미지 Accept를 실어 /_next/image에 보낸 요청의 응답 */
export interface EndpointProbe {
  requestPath: string
  sentAccept: string
  status: number
  contentType: string | null
  vary: string | null
}

export type ProbeOutcome = { ok: true; probe: EndpointProbe } | { ok: false; error: string }

export interface ComputedImgProps {
  src: string
  srcSet: string | null
}

export interface Measurement {
  accept: AcceptReading
  support: FormatSupport
  endpoint: ProbeOutcome
  dom: { srcAttr: string | null; srcsetAttr: string | null } | null
  measuredAt: string
}

export interface FormatCase {
  id: string
  label: string
  accept: string
  formats: ImageFormat[]
}
