import { ImageResponse } from 'next/og'
import { ogImageSize } from '@study/demos'

/**
 * demo-baseline 전용 OG 이미지 렌더러. shell의 디자인을 그대로 옮겨왔지만
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
          position: 'relative',
          background: 'linear-gradient(135deg, #0A0A0F 0%, #16141F 55%, #201A2E 100%)',
          color: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -140,
            right: -140,
            width: 440,
            height: 440,
            borderRadius: 440,
            background: 'radial-gradient(circle, rgba(109,94,249,0.35) 0%, rgba(109,94,249,0) 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            padding: '8px 20px',
            borderRadius: 999,
            background: 'rgba(109,94,249,0.16)',
            color: '#B4A9FF',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 28 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.25,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              width: 28,
              height: 4,
              borderRadius: 4,
              background: 'linear-gradient(90deg, #6D5EF9, #B4A9FF)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 24, color: '#8B8894', fontWeight: 500 }}>Next.js 학습</div>
        </div>
      </div>
    ),
    { ...ogImageSize }
  )
}
