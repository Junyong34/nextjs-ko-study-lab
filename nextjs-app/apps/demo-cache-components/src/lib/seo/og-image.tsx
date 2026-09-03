import { ImageResponse } from 'next/og'
import { ogImageSize } from '@study/demos'

/**
 * demo-cache-components 전용 OG 이미지 렌더러. shell의 디자인을 그대로 옮겨왔지만
 * 이 앱에서만 쓰는 독립된 사본이다 — 나중에 앱별로 배경/톤을 바꿀 때 다른 앱에 영향을 주지 않는다.
 */
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
