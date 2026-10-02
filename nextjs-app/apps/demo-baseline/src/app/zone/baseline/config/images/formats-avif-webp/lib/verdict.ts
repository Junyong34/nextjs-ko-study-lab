import type { ComputedImgProps, Measurement } from '../types'
import { PRODUCT_SRC } from './constants'

export interface Check {
  label: string
  actual: string
  ok: boolean
}

const has = (accept: string | null, type: string) => (accept ?? '').toLowerCase().includes(type)
const yn = (b: boolean) => (b ? '있음' : '없음')

/** 모두 실측값끼리 비교한다. optimizer가 꺼진 이 앱에서 나올 수 없는 AVIF/WebP 응답은 판정하지 않는다. */
export function buildChecks(m: Measurement, computed: ComputedImgProps): Check[] {
  const { imgAccept, fetchAccept } = m.accept
  const checks: Check[] = [
    {
      label: '<img> 요청의 Accept ↔ 실제 디코드 지원',
      actual:
        `Accept: ${imgAccept ?? '(받지 못함)'}\n` +
        `image/avif ${yn(has(imgAccept, 'image/avif'))} · 디코드 ${m.support.decode.avif ? '성공' : '실패'} / ` +
        `image/webp ${yn(has(imgAccept, 'image/webp'))} · 디코드 ${m.support.decode.webp ? '성공' : '실패'}`,
      ok:
        imgAccept !== null &&
        has(imgAccept, 'image/avif') === m.support.decode.avif &&
        has(imgAccept, 'image/webp') === m.support.decode.webp,
    },
    {
      label: 'fetch() 요청의 Accept',
      actual: fetchAccept ?? '(없음)',
      ok: fetchAccept === '*/*',
    },
  ]
  if (m.endpoint.ok) {
    const p = m.endpoint.probe
    checks.push({
      label: '/_next/image에 같은 Accept로 요청',
      actual: `${p.status} · Content-Type ${p.contentType ?? '없음'} · Vary ${p.vary ?? '없음'}`,
      ok: p.status === 404 && !/image\/(avif|webp)/.test(p.contentType ?? '') && !/(^|,\s*)accept(\s*,|$)/i.test(p.vary ?? ''),
    })
  } else {
    checks.push({ label: '/_next/image 요청', actual: `측정 실패: ${m.endpoint.error}`, ok: false })
  }
  checks.push({
    label: 'getImageProps()와 렌더된 <img>',
    actual: `계산 src ${computed.src} · srcSet ${computed.srcSet ?? '없음'} / DOM src ${m.dom?.srcAttr ?? '없음'} · srcset ${m.dom?.srcsetAttr ?? '없음'}`,
    ok: computed.src === PRODUCT_SRC && computed.srcSet === null && m.dom?.srcAttr === PRODUCT_SRC && m.dom.srcsetAttr === null,
  })
  return checks
}
