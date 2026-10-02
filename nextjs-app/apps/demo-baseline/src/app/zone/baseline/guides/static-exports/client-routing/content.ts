export const content = {
  notApplied:
    "output: 'export'는 앱 전체를 정적 파일로 바꾸는 빌드 설정입니다. 이 zone은 rewrites·redirects·headers·Proxy·Server Actions를 쓰는 다른 데모와 같은 앱이라 export를 켜면 빌드가 실패하거나 그 데모들이 사라집니다. 그래서 이 화면은 서버 모드의 실제 탐색 요청을 실측하고, export 동작은 예제와 Next.js 소스 규칙으로 설명합니다.",
  examples: [
    {
      file: 'next.config.ts (별도 앱)',
      code: "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  output: 'export',\n  images: { unoptimized: true },\n}\n\nexport default nextConfig",
      note: '기본 이미지 최적화 loader는 서버가 필요해 export에서 쓸 수 없습니다. unoptimized 또는 외부 서비스의 custom loader를 씁니다(이 zone도 셸 rewrites 때문에 이미 unoptimized: true입니다).',
    },
    {
      file: '별도 앱에서 확인할 명령',
      code: "pnpm build\nls out/products            # running-shoes.html, running-shoes.txt ...\npython3 -m http.server 3100 --directory out\n# http://localhost:3100/ 에서 상품 링크 클릭 → Network 탭에서 .txt 요청 확인",
      note: 'export 프로덕션 빌드의 라우터는 rsc 헤더 대신 경로 끝에 .txt(trailingSlash면 /index.txt)를 붙여 RSC payload 파일을 요청하고, text/plain 응답도 RSC로 받아들입니다.',
    },
  ],
  procedure: [
    'create-next-app으로 만든 별도 앱에 이 데모와 같은 products/[id] 경로와 generateStaticParams를 둡니다. 이 학습 사이트를 export로 바꾸는 절차가 아닙니다.',
    'pnpm build 후 out 폴더에 경로별 .html과 .txt가 함께 생겼는지 확인합니다.',
    '정적 서버에서 목록 페이지를 열고 상품 링크를 클릭해 Network 탭의 요청이 이 화면의 _rsc 요청 대신 .txt 파일인지, 주소창 URL은 .txt 없이 바뀌는지 비교합니다.',
  ],
  serverOnly: [
    { app: '사용 가능 (Node 서버가 요청마다 실행)', api: 'cookies() · headers() · 요청을 읽는 Route Handler', exported: '빌드 때 요청이 없어 사용 불가' },
    { app: '사용 가능 (Node 서버가 요청마다 실행)', api: 'Server Actions · Draft Mode', exported: '실행할 서버가 없어 사용 불가' },
    { app: '사용 가능 (Node 서버가 요청마다 실행)', api: 'rewrites · redirects · headers 설정 · Proxy', exported: '요청을 가로챌 서버가 없어 사용 불가' },
    { app: 'ISR·dynamicParams는 사용 가능, 이미지는 셸 rewrites 때문에 이미 unoptimized', api: 'ISR · dynamicParams: true · 기본 이미지 loader', exported: '요청 시점 생성·최적화 불가' },
    { app: '사용 가능 (위 실측표가 이 앱의 탐색 요청)', api: 'Link · useRouter · usePathname · Client Component', exported: '사용 가능 (브라우저에서 실행)' },
  ],
  questions: [
    {
      prompt: "output: 'export'로 빌드한 사이트에서 <Link>로 상품 상세로 이동하면 라우터가 요청하는 것은?",
      choices: ['상세 페이지의 .html 전체 문서', '상세 경로의 .txt RSC payload 파일', '서버의 _rsc 동적 응답'],
      correct: 1,
      reason: 'export 빌드의 라우터는 경로 끝에 .txt를 붙여 미리 만들어진 RSC payload를 받아 화면 일부만 바꿉니다.',
    },
    {
      prompt: '정적 export에서도 그대로 쓸 수 있는 것은?',
      choices: ['usePathname으로 현재 경로 읽기', 'cookies()로 회원 쿠키 읽기', 'Server Action으로 주문 저장'],
      correct: 0,
      reason: '클라이언트 훅은 브라우저에서 실행됩니다. 요청별 서버 실행이 필요한 기능은 지원하지 않습니다.',
    },
    {
      prompt: 'products/[id]를 정적 export에 포함하려면?',
      choices: ['dynamicParams = true로 두기', 'generateStaticParams로 빌드할 id 목록 제공', 'Route Handler에서 HTML 생성'],
      correct: 1,
      reason: 'export는 빌드 때 만든 파일만 제공하므로 동적 경로의 params를 미리 알려 줘야 합니다.',
    },
  ],
  concepts: [
    {
      title: 'HTML은 첫 진입용, RSC payload는 탐색용',
      body: '빌드는 경로마다 초기 진입용 HTML과 클라이언트 탐색용 RSC payload를 함께 만듭니다. 서버 모드에서는 같은 URL에 rsc: 1 헤더와 _rsc 쿼리를 붙여 서버가 payload를 응답하고, export에서는 헤더로 구분할 서버가 없으니 .txt 파일 경로로 구분합니다.',
    },
    {
      title: '레이아웃은 유지되고 바뀐 세그먼트만 교체된다',
      body: '실습의 장바구니 수와 요청 기록은 client-routing/layout.tsx에 있어 상세로 이동해도 사라지지 않습니다. 정적 호스팅에서도 이 클라이언트 탐색 방식은 같으며, 주소를 직접 입력하거나 새로고침하면 그때는 해당 경로의 HTML 파일이 필요합니다.',
    },
  ],
  references: [
    { label: 'Static Exports 공식 가이드', url: 'https://nextjs.org/docs/app/guides/static-exports' },
    { label: 'generateStaticParams 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/functions/generate-static-params' },
  ],
}
