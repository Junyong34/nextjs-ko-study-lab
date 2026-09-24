import type { DiscountSnapshot } from '../discount-data'

/**
 * ImageResponse(Satori)에 넘기는 JSX. 서버에서만 쓰인다('use client' 없음).
 * Satori는 flexbox 서브셋만 지원하므로 자식이 여러 개인 div에는 display:flex를 명시한다.
 * 한글은 런타임에 Google Fonts를 내려받아야 렌더링되므로(네트워크 의존) 이미지 안 텍스트는 영문/숫자로 둔다.
 */
export function DiscountBannerArt({
  snapshot,
  generatedAt,
  channel,
  strategy,
}: {
  snapshot: DiscountSnapshot
  generatedAt: string
  channel: 'og:image' | 'twitter:image'
  strategy: 'connection()' | 'no request-time API'
}) {
  const accent = strategy === 'connection()' ? '#34d399' : '#fbbf24'
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 56,
        background: '#18181b',
        color: '#fafafa',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#a1a1aa' }}>
        <span>{`${channel}  ·  ${snapshot.sku}`}</span>
        <span style={{ color: accent }}>{`strategy: ${strategy}`}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 40, color: '#d4d4d8' }}>{snapshot.productName}</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 8 }}>
          <span style={{ fontSize: 180, fontWeight: 800, color: accent, lineHeight: 1 }}>
            {`${snapshot.rate}%`}
          </span>
          <span style={{ fontSize: 56, marginLeft: 24, marginBottom: 20 }}>OFF</span>
        </div>
        <div style={{ display: 'flex', fontSize: 36, marginTop: 16 }}>
          <span style={{ color: '#71717a', textDecoration: 'line-through' }}>
            {`KRW ${snapshot.listPrice.toLocaleString('en-US')}`}
          </span>
          <span style={{ marginLeft: 24 }}>{`KRW ${snapshot.salePrice.toLocaleString('en-US')}`}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24, color: '#a1a1aa' }}>
        <span>{`generated at ${generatedAt}`}</span>
        <span>{`discount slot #${snapshot.slot}  (${snapshot.slotStartedAt} ~ ${snapshot.slotEndsAt})`}</span>
      </div>
    </div>
  )
}
