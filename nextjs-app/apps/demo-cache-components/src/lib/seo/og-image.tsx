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
          position: 'relative',
          backgroundColor: '#1E1B18',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 40px 40px',
          color: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -160,
            right: -160,
            width: 480,
            height: 480,
            borderRadius: 480,
            background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: -180,
            left: -140,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            padding: '8px 20px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.10)',
            color: '#D4D4D8',
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
              background: 'linear-gradient(90deg, #FFFFFF, #71717A)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 24, color: '#8B8894', fontWeight: 500 }}>Next.js 학습</div>
        </div>
      </div>
    ),
    { ...ogImageSize }
  )
}
