export const content = {
  notApplied:
    'trailingSlash는 앱의 모든 URL 규칙을 바꾸는 전역 설정입니다. 이 zone에서 true로 바꾸면 모든 데모 경로가 끝 슬래시 URL로 리다이렉트되고, 다른 데모의 상태 코드·Location 검증 결과도 바뀝니다. 그래서 이 화면은 현재 설정(기본값 false)만 실측하고, true는 예제와 확인 절차로 설명합니다.',
  examples: [
    {
      file: 'next.config.ts (별도 앱)',
      code: "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  trailingSlash: true,\n}\n\nexport default nextConfig",
      note: '기본값은 false입니다. true로 바꾸면 /about 요청이 308로 /about/에 리다이렉트됩니다. 확장자가 있는 경로와 .well-known/ 하위 경로는 슬래시를 붙이지 않습니다.',
    },
    {
      file: '별도 앱에서 확인할 명령',
      code: "pnpm dev\ncurl -sI http://localhost:3000/about     # 308, location: /about/\ncurl -sI http://localhost:3000/about/    # 200\ncurl -sI 'http://localhost:3000/about?tab=1'  # 308, location: /about/?tab=1\ncurl -sI http://localhost:3000/robots.txt   # 리다이렉트 없음",
      note: 'next.config를 바꾼 뒤에는 dev 서버를 다시 시작합니다. 같은 요청을 이 화면의 실측표와 나란히 놓고 방향이 반대로 바뀌었는지 비교하세요.',
    },
  ],
  procedure: [
    'create-next-app으로 만든 별도 앱에 app/about/page.tsx와 public/robots.txt를 둡니다. 이 학습 사이트의 설정을 바꾸는 절차가 아닙니다.',
    '먼저 설정 없이 curl -sI로 /about/을 요청해 이 화면과 같은 308 → /about을 확인합니다.',
    'trailingSlash: true를 넣고 dev 서버를 다시 시작한 뒤 같은 요청을 반복합니다. /about은 308 → /about/, /robots.txt는 그대로인지 확인합니다.',
  ],
  cautions: [
    '셸과 zone처럼 rewrites로 이어진 여러 앱은 설정을 맞춰야 합니다. 한쪽만 true로 바꾸면 한 앱은 슬래시를 붙이고 다른 앱은 떼어 내는 308을 서로 돌려줄 수 있습니다. 이 앱 구성에서 추론한 위험이며 실측하지 않았습니다.',
    '308은 브라우저와 검색 엔진이 오래 기억하는 영구 리다이렉트입니다. 운영 중에 방향을 바꾸면 이전 방향의 캐시된 리다이렉트와 충돌할 수 있으니 처음부터 정해 둡니다.',
  ],
  questions: [
    {
      prompt: '기본값(false)에서 /catalog/?sort=price를 요청하면?',
      choices: ['200으로 그대로 응답', '308 → /catalog?sort=price', '308 → /catalog (쿼리 제거)'],
      correct: 1,
      reason: '끝 슬래시만 떼어 낸 URL로 308 리다이렉트하며 쿼리 문자열은 그대로 따라갑니다. 실측표의 세 번째 줄과 같습니다.',
    },
    {
      prompt: 'trailingSlash: true에서 슬래시가 붙지 않고 그대로 유지되는 URL은?',
      choices: ['/products', '/blog/post-1', '/assets/logo.png'],
      correct: 2,
      reason: '확장자가 있는 정적 파일 URL과 .well-known/ 하위 경로는 예외입니다.',
    },
    {
      prompt: "output: 'export'와 trailingSlash: true를 함께 쓰면 /contact의 산출물은?",
      choices: ['out/contact.html', 'out/contact/index.html', 'out/contact.json'],
      correct: 1,
      reason: 'true면 경로마다 디렉토리와 index.html을 만들어, 디렉토리 요청에 index.html을 돌려주는 정적 서버와 잘 맞습니다.',
    },
  ],
  concepts: [
    {
      title: '정규화는 라우팅의 가장 앞에서 일어난다',
      body: 'Next.js는 trailingSlash 값에 따라 내부 리다이렉트 규칙 하나를 redirects 목록 맨 앞에 넣습니다(next/dist/lib/load-custom-routes.js). false면 /:path+/ → /:path+, true면 확장자·.well-known이 아닌 경로에 슬래시를 붙입니다. 그래서 page나 Route Handler가 실행되기 전에 308이 돌아가고, 루트 /는 규칙에 걸리지 않습니다.',
    },
    {
      title: '확장자 경로의 방향은 설정과 상관없다',
      body: '실측표의 spec.txt처럼 폴더 이름에 확장자가 있는 경로는 false에서 슬래시를 떼어 냅니다. true에서도 /file.txt/ → /file.txt 규칙이 따로 있어 파일 URL에는 슬래시가 붙지 않습니다. 다만 .well-known 예외는 true일 때만 적용되며, 기본값에서는 다른 경로처럼 슬래시를 떼어 냅니다.',
    },
    {
      title: '클라이언트 라우터와 zone 경계',
      body: '<Link>와 router.push도 같은 설정으로 href의 끝 슬래시를 맞춥니다. 이 사이트에서 학습자 요청은 셸을 먼저 거치고 셸도 trailingSlash를 지정하지 않았으므로(apps/shell/next.config.ts), zone 링크는 끝 슬래시 없는 상대 경로로 씁니다. 실습의 [catalog/ 직접 열기]처럼 셸 경유 요청은 셸이 먼저 308을 돌려줄 수 있습니다.',
    },
  ],
  references: [
    { label: 'trailingSlash 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash' },
    { label: 'Static Exports 공식 가이드', url: 'https://nextjs.org/docs/app/guides/static-exports' },
  ],
}
