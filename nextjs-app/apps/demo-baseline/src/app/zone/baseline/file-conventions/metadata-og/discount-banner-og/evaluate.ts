import { OG_IMAGE, TWITTER_IMAGE } from './image-config'
import type { ImageChannel, ImageProbe, MetaTagRow } from './types'

export interface ChannelEvaluation {
  channel: ImageChannel
  metaOk: boolean
  fetchOk: boolean
  dataOk: boolean
  regenerated: boolean
  expectRegenerated: boolean
  isMatched: boolean
  lines: string[]
}

const SPEC = {
  og: { prefix: 'og:image', file: '/discount-banner-og/opengraph-image', config: OG_IMAGE },
  twitter: { prefix: 'twitter:image', file: '/discount-banner-og/twitter-image', config: TWITTER_IMAGE },
} as const

/** 채널별 기대 동작: og(connection 사용)는 항상 요청마다 재생성, twitter(정적)는 dev에서만 재생성 */
export function expectsRegeneration(channel: ImageChannel, isDev: boolean): boolean {
  return channel === 'og' ? true : isDev
}

export function evaluateChannel(
  channel: ImageChannel,
  probe: ImageProbe | undefined,
  htmlMeta: MetaTagRow[],
  isDev: boolean,
): ChannelEvaluation {
  const spec = SPEC[channel]
  const get = (suffix: string) =>
    htmlMeta.find((row) => row.key === `${spec.prefix}${suffix}` && row.inHead)?.content
  const url = get('') ?? ''
  const metaChecks = [
    url.includes(spec.file),
    get(':width') === String(spec.config.size.width),
    get(':height') === String(spec.config.size.height),
    get(':type') === spec.config.contentType,
    get(':alt') === spec.config.alt,
  ]
  const metaOk = metaChecks.every(Boolean)
  const expectRegenerated = expectsRegeneration(channel, isDev)

  if (!probe) {
    return {
      channel, metaOk, fetchOk: false, dataOk: false, regenerated: false, expectRegenerated,
      isMatched: false,
      lines: [`• <head>에서 ${spec.prefix} 태그를 찾지 못해 이미지를 요청하지 못함`],
    }
  }

  const { first, second, source } = probe
  const fetchOk = [first, second].every(
    (r) => r.status === 200 && r.contentType === spec.config.contentType && r.byteSize > 0,
  )
  const dataOk = source.atGeneration !== null && first.rate === source.atGeneration.rate
  const regenerated = first.generatedAt !== second.generatedAt
  const isMatched = metaOk && fetchOk && dataOk && regenerated === expectRegenerated

  return {
    channel, metaOk, fetchOk, dataOk, regenerated, expectRegenerated, isMatched,
    lines: [
      `• <head> ${spec.prefix} 태그 5종(url·width·height·type·alt): ${metaOk ? '일치' : '불일치'} (${metaChecks.filter(Boolean).length}/5)`,
      `• 이미지 응답: ${first.status} · ${first.contentType} · ${first.byteSize.toLocaleString()} bytes`,
      `• 이미지 속 할인율 ${first.rate}% vs 데이터 원본(생성 시각 기준) ${source.atGeneration?.rate ?? '-'}% → ${dataOk ? '일치' : '불일치'}`,
      `• 지금 서버 원본 할인율: ${source.current.rate}% (slot #${source.current.slot})`,
      `• 연속 2회 생성 시각: ${first.generatedAt} / ${second.generatedAt} → ${regenerated ? '요청마다 재생성' : '같은 결과 재사용(정적)'} (기대: ${expectRegenerated ? '요청마다 재생성' : '정적'})`,
    ],
  }
}
