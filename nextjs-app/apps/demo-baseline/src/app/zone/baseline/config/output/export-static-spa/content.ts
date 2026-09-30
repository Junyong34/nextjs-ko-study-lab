export const content = {
  "scenario": "고정된 상품 소개 페이지를 정적 호스팅에 배포하려고 합니다. 상품 경로를 빌드 때 확정하고, 요청 시점의 회원 쿠키나 주문 처리가 필요한지 따져 봅니다.",
  "examples": [
    {
      "file": "next.config.ts",
      "code": "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  output: 'export',\n  trailingSlash: true,\n  images: { unoptimized: true },\n}\nexport default nextConfig",
      "note": "trailingSlash는 /products/running-shoes/index.html 형태로 내보내도록 설정합니다. images.unoptimized는 기본 이미지 최적화 서버를 사용하지 않는 예시입니다."
    },
    {
      "file": "app/products/[id]/page.tsx",
      "code": "export function generateStaticParams() {\n  return [{ id: 'running-shoes' }, { id: 'windbreaker' }]\n}\n\nexport default async function Page({ params }: {\n  params: Promise<{ id: string }>\n}) {\n  const { id } = await params\n  return <h1>상품 소개: {id}</h1>\n}",
      "note": "Server Component는 빌드 때 실행됩니다. generateStaticParams가 알려 준 두 상품 경로에 HTML을 만들며, 목록 밖의 상품은 새 빌드에 포함해야 합니다."
    },
    {
      "file": "별도 앱에서 확인할 명령",
      "code": "pnpm build\n# out/products/running-shoes/index.html 확인\npython3 -m http.server 3100 --directory out\n# http://localhost:3100/products/running-shoes/ 직접 열기",
      "note": "next export 명령은 사용하지 않습니다. out을 정적 서버에서 제공하고, 상품 상세 URL을 직접 열거나 새로고침해 확인합니다."
    }
  ],
  "procedure": [
    "별도의 Next.js 앱에 설정과 두 상품 경로를 준비한 뒤 빌드합니다. 이 학습 사이트 전체를 export로 바꾸는 절차가 아닙니다.",
    "out에 경로별 HTML이 생성됐는지 확인하고 정적 서버에서 상품 상세 URL을 직접 엽니다. 새로고침 때도 해당 파일이 제공되는지 확인하세요.",
    "정적 호스팅에서는 cookies(), Server Actions, 요청에 의존하는 Route Handler를 실행할 서버가 없습니다. 필요한 기능이 있으면 서버 배포 방식이나 별도 API를 검토합니다."
  ],
  "cautions": [
    "브라우저 상태와 외부 API를 사용하는 Client Component는 쓸 수 있지만, 같은 앱의 Server Actions나 요청별 cookies()는 지원하지 않습니다.",
    "ISR, Proxy, Next.js의 rewrites/redirects/headers, 기본 이미지 최적화 loader도 정적 export에서 지원하지 않습니다. 이미지에는 unoptimized 또는 외부 서비스의 custom loader를 사용합니다."
  ],
  "questions": [
    {
      "prompt": "상품 상세 동적 경로를 정적 export로 만들려면?",
      "choices": [
        "방문한 상품을 서버가 요청마다 생성",
        "generateStaticParams 없이 모든 id를 자동 생성",
        "generateStaticParams로 빌드할 상품 경로 제공"
      ],
      "correct": 2,
      "reason": "정적 호스팅에서는 요청 시점에 새 HTML을 만들 서버가 없습니다. 빌드할 동적 경로를 미리 알려 줍니다."
    },
    {
      "prompt": "정적 export에서 사용할 수 있는 기능은?",
      "choices": [
        "Server Action으로 이 앱의 주문 서버 실행",
        "Client Component의 브라우저 상태와 외부 API 요청",
        "cookies()로 요청별 회원 쿠키 읽기"
      ],
      "correct": 1,
      "reason": "브라우저 코드와 별도 API 요청은 가능하지만, 이 앱의 서버 런타임이 필요한 기능은 사용할 수 없습니다."
    }
  ],
  "concepts": [
    {
      "title": "빌드 시점의 Server Component",
      "body": "generateStaticParams → 상품별 Server Component 실행 → out의 HTML과 탐색용 파일 → 정적 호스팅. Server Component를 사용할 수 있어도 요청마다 서버 코드를 실행할 수 있다는 뜻은 아닙니다."
    },
    {
      "title": "SPA 탐색과 직접 진입",
      "body": "Link로 클라이언트 탐색을 할 수 있으며 각 경로에는 초기 진입용 HTML도 있습니다. 두 번째 문항에서 고른 브라우저 상태는 동작하지만, 상세 경로 새로고침은 호스팅 서버가 올바른 파일을 제공하는지도 확인해야 합니다."
    }
  ],
  "references": [
    {
      "label": "Static Exports 공식 가이드",
      "url": "https://nextjs.org/docs/app/guides/static-exports"
    },
    {
      "label": "output 공식 문서",
      "url": "https://nextjs.org/docs/app/api-reference/config/next-config-js/output"
    }
  ]
}
