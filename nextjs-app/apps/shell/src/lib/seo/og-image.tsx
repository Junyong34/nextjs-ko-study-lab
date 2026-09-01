import { ImageResponse } from 'next/og'
import { ogImageSize } from './config'

/** `/og` 라우트와 apple-icon 등에서 공유하는 OG 이미지 렌더러. 제목/상단 라벨만 넘기면 된다 */
export function renderOgImage(title: string, eyebrow: string) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: 64,
          background: '#09090B',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', fontSize: 32, color: '#A1A1AA' }}>{eyebrow}</div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
      </div>
    ),
    { ...ogImageSize }
  )
}
