export const content = {
  notApplied:
    '이 앱의 next.config.ts에는 devIndicators 설정이 없으므로 기본값 { position: "bottom-left" }로 동작합니다. position이나 false로 바꾸면 같은 dev 서버의 모든 데모 화면이 함께 바뀌므로 바꾸지 않았습니다. 아래 측정은 기본값 상태의 실제 DOM입니다.',
  examples: [
    {
      file: 'next.config.ts — 위치 변경 (별도 앱)',
      code: "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  devIndicators: {\n    position: 'bottom-right', // 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'\n  },\n}\n\nexport default nextConfig",
      note: '하단 고정 장바구니 버튼처럼 기본 위치(왼쪽 아래)를 가리는 UI가 있을 때 다른 모서리로 옮깁니다.',
    },
    {
      file: 'next.config.ts — 숨김 (별도 앱)',
      code: "const nextConfig: NextConfig = {\n  devIndicators: false,\n}",
      note: '표시기만 숨깁니다. 컴파일 오류나 런타임 오류가 나면 오류 오버레이는 그대로 나타납니다.',
    },
    {
      file: 'next.config.ts — 16에서 제거된 옵션 (쓰지 않음)',
      code: "devIndicators: {\n  appIsrStatus: false,      // 15.2에서 폐기, 16.0에서 제거\n  buildActivity: false,     // 15.2에서 폐기, 16.0에서 제거\n  buildActivityPosition: 'bottom-right', // 15.2에서 폐기, 16.0에서 제거\n}",
      note: '16.3.2의 NextConfig 타입에는 position만 있으므로 이 객체는 타입 검사에서 걸립니다. 구버전 글의 예제를 옮길 때 확인하세요.',
    },
  ],
  procedure: [
    '별도 앱에서 설정 없이 next dev를 실행하고 페이지를 엽니다. 왼쪽 아래의 Next.js 로고 버튼이 표시기입니다. Elements 패널에서 body 끝의 <nextjs-portal>과 그 안의 #shadow-root (open)을 확인합니다.',
    "position: 'top-right'로 바꾸고 dev 서버를 다시 시작합니다. 같은 버튼이 오른쪽 위로 옮겨졌는지 확인합니다. 이 화면의 [표시기 측정]과 같은 코드를 Console에서 실행해도 됩니다.",
    'devIndicators: false로 바꾸고 다시 시작한 뒤 버튼이 사라졌는지 봅니다. 이어서 page.tsx에 일부러 문법 오류를 넣어 오류 오버레이는 여전히 뜨는지 확인합니다.',
    'next build && next start로 실행하면 설정과 관계없이 <nextjs-portal>이 없습니다.',
  ],
  cautions: [
    '표시기를 끄는 대신 위치만 옮기는 편이 낫습니다. Dev Tools 메뉴의 Route 항목(Static/Dynamic)과 오류 개수를 함께 잃기 때문입니다.',
    '표시기의 Static/Dynamic은 dev 서버의 추정입니다. 최종 판단은 next build 출력의 ○(Static)·ƒ(Dynamic) 기호로 합니다.',
  ],
  questions: [
    {
      prompt: '표시기를 오른쪽 위로 옮기는 16.3.2의 설정은?',
      choices: ["devIndicators: { position: 'top-right' }", "devIndicators: { buildActivityPosition: 'top-right' }", "devIndicators: { appIsrStatus: 'top-right' }"],
      correct: 0,
      reason: 'position만 남았습니다. buildActivityPosition·appIsrStatus는 16.0.0에서 제거됐습니다.',
    },
    {
      prompt: 'devIndicators: false로 설정한 앱에서 런타임 오류가 나면?',
      choices: ['오류 오버레이도 뜨지 않는다', '오류 오버레이는 뜬다', '브라우저 콘솔에도 오류가 찍히지 않는다'],
      correct: 1,
      reason: '공식 문서: false여도 컴파일·런타임 오류는 계속 표시합니다. 숨겨지는 것은 표시기입니다.',
    },
  ],
  concepts: [
    {
      title: '"렌더링 상태 뱃지"는 15.0 시절의 표현입니다',
      body: '15.0의 appIsrStatus는 정적 라우트에 별도 뱃지를 띄웠습니다. 15.2부터는 Next.js 로고 버튼 하나로 합쳐졌고, 정적/동적 여부는 버튼을 눌러 여는 Dev Tools 메뉴의 Route 항목에 나옵니다. 16.0에서 appIsrStatus·buildActivity·buildActivityPosition이 제거되어 지금 조절할 수 있는 것은 position과 false뿐입니다.',
    },
    {
      title: '설정이 화면에 닿는 경로',
      body: 'next.config.ts의 devIndicators → dev 빌드가 클라이언트 번들에 표시 여부와 위치를 값으로 넣음 → 브라우저에서 dev 오버레이가 <nextjs-portal>(open shadow root)을 body에 붙이고 그 안에 버튼을 그림. 그래서 값을 바꾸면 dev 서버를 다시 시작해야 하고, 프로덕션 번들에는 이 코드가 없습니다.',
    },
    {
      title: '이 화면이 iframe 안에 있을 때',
      body: '학습 사이트에서는 데모가 iframe으로 열립니다. 표시기는 데모 문서(iframe) 안의 nextjs-portal이므로 모서리는 iframe 뷰포트 기준으로 계산됩니다. 셸 페이지의 표시기와는 별개입니다.',
    },
  ],
  references: [
    { label: 'devIndicators 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators' },
  ],
}
