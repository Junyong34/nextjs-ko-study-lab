export const content = {
  notApplied:
    '이 앱에서는 next.config의 crossOrigin을 적용하지 않았습니다. 이 설정은 앱 전체 문서의 부트스트랩 <script>와 CSS <link>에 속성을 붙이는 전역 설정이라, 켜면 같은 zone의 다른 데모 HTML이 모두 바뀝니다. 그래서 위에서는 현재(미설정) 상태를 실측하고, 설정이 붙이는 속성의 의미는 컴포넌트 단위 <Script crossOrigin> prop으로 실측했습니다. 설정을 켰을 때의 결과는 아래 예제와 절차로 별도 앱에서 확인하세요.',
  examples: [
    {
      file: 'next.config.ts',
      code: "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  assetPrefix: 'https://cdn.example.com',\n  crossOrigin: 'anonymous',\n}\n\nexport default nextConfig",
      note: 'assetPrefix로 빌드 자산을 다른 출처(CDN)에서 받을 때 함께 쓰는 예입니다. CDN 주소는 예시이며, 그 CDN이 Access-Control-Allow-Origin 헤더를 보내야 자산이 로드됩니다.',
    },
    {
      file: '컴포넌트 단위 prop (위 실습에서 쓴 방식)',
      code: "import Script from 'next/script'\n\n<Script\n  src=\"https://widgets.example.com/sdk.js\"\n  crossOrigin=\"anonymous\"\n  onError={() => console.log('CORS 차단 또는 네트워크 오류')}\n/>",
      note: 'next.config가 아니라 이 <Script> 하나에만 속성을 붙입니다. 실습의 다섯 조합은 이 prop과 서버 헤더만 바꿔 측정했습니다.',
    },
    {
      file: '별도 앱에서 확인할 명령',
      code: "pnpm build\npnpm exec next start --port 3100\n# 브라우저 Elements에서 _next/static 스크립트와 CSS link 확인\ncurl -s http://localhost:3100/ | grep -o '<script[^>]*_next/static[^>]*>' | head",
      note: '설정을 켠 앱의 HTML에서 _next/static 스크립트와 CSS link에 crossorigin="anonymous"가 붙었는지 봅니다. 이 화면의 [문서 태그 검사]와 같은 대상을 비교하는 절차입니다.',
    },
  ],
  procedure: [
    '설정을 넣기 전, 이 화면처럼 _next/static 태그에 crossorigin 속성이 없는 상태를 먼저 기록합니다.',
    "next.config.ts에 crossOrigin: 'anonymous'를 넣고 다시 빌드한 뒤 같은 태그에 속성이 붙었는지 확인합니다.",
    '자산을 다른 출처(assetPrefix의 CDN)에서 받는다면 Network에서 그 응답의 Access-Control-Allow-Origin 헤더와 200 응답을 함께 확인합니다.',
  ],
  cautions: [
    '속성만 켜고 자산 서버에 CORS 헤더가 없으면, 위 실습의 [anonymous · CORS 헤더 없음]처럼 스크립트가 실행되지 않습니다.',
    "'use-credentials'는 와일드카드(*) 허용으로는 통과하지 못합니다. 서버가 요청 Origin과 Access-Control-Allow-Credentials: true를 보내야 합니다.",
    '같은 출처에서 자산을 제공하는 기본 구성에서는 이 설정이 필요하지 않습니다.',
  ],
  questions: [
    {
      prompt: "crossorigin=\"anonymous\" 스크립트를 다른 출처에서 받는데 서버가 CORS 헤더를 보내지 않으면?",
      choices: ['그대로 실행되고 오류만 가려진다', '브라우저가 차단해 실행되지 않고 onError가 호출된다', '쿠키를 붙여 다시 요청한다'],
      correct: 1,
      reason: 'crossorigin 속성이 있으면 CORS 모드로 요청하므로, 허용 헤더가 없으면 실행 전에 차단됩니다. 실습의 두 번째 조합에서 확인했습니다.',
    },
    {
      prompt: '교차 출처 스크립트의 오류 메시지가 "Script error."로 가려지지 않으려면?',
      choices: ['crossorigin 속성과 서버의 Access-Control-Allow-Origin 헤더가 모두 필요하다', 'crossorigin 속성만 있으면 된다', 'next.config의 assetPrefix만 지정하면 된다'],
      correct: 0,
      reason: '속성이 없으면 no-cors 요청이라 오류가 가려지고, 속성만 있고 헤더가 없으면 아예 차단됩니다. 둘 다 있어야 상세 메시지를 받습니다.',
    },
    {
      prompt: "next.config에 crossOrigin: 'anonymous'를 넣었을 때 이 데모가 확인하라고 안내하는 변화는?",
      choices: ['모든 fetch 요청이 CORS 모드로 바뀐다', 'Next가 HTML에 넣는 _next/static 스크립트·CSS 태그에 crossorigin 속성이 붙는다', '서버가 Access-Control-Allow-Origin 헤더를 자동으로 보낸다'],
      correct: 1,
      reason: '설정은 HTML 태그의 속성만 바꿉니다. 응답 헤더는 자산을 제공하는 서버(CDN)가 따로 보내야 하고, fetch 요청과는 관계없습니다.',
    },
  ],
}
