import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * apple-touch-icon(180×180 PNG). 구글 검색 결과의 사이트 아이콘으로도 선택되므로
 * 브라우저 파비콘(`./icon.svg`)과 같은 책 + 코드 도형을 그린다.
 * path 데이터는 `icon.svg`에서 그대로 옮겼다. 도형을 바꿀 때 두 파일을 함께 갱신한다.
 * 배경은 캔버스 전체를 채운다(iOS·구글이 각자 모서리를 자른다).
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#09090B',
        }}
      >
        <svg viewBox="0 0 64 64" width={130} height={130} xmlns="http://www.w3.org/2000/svg">
          <g id="book" fill="#FFFFFF">
            <path d="M10.5 15.5c8.2 0 15.2 2.4 20.7 7v30c-5.6-4.1-12.5-6.1-20.7-6.1V15.5Z" />
            <path d="M53.5 15.5c-8.2 0-15.2 2.4-20.7 7v30c5.6-4.1 12.5-6.1 20.7-6.1V15.5Z" />
          </g>
          <g fill="none" stroke="#09090B" strokeLinecap="round">
            <path d="M15.5 33h10.5" strokeWidth={3} />
            <g id="code" strokeLinejoin="round" strokeWidth={3}>
              <path d="m40 29.5-3.5 3.5 3.5 3.5M46.5 29.5 50 33l-3.5 3.5M44.5 28.5l-3 9" />
            </g>
          </g>
        </svg>
      </div>
    ),
    { ...size }
  )
}
