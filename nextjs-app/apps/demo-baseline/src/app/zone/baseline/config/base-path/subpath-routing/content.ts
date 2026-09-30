export const content = {
  "scenario": "기존 사이트의 /shop 아래에 상품 카탈로그를 배포하려고 합니다. 설정과 상품 링크, 이미지 경로를 함께 읽어 보세요.",
  "examples": [
    {
      "file": "next.config.ts",
      "code": "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = { basePath: '/shop' }\nexport default nextConfig",
      "note": "basePath는 빌드 때 클라이언트 번들에 포함됩니다. 값을 바꾸면 다시 빌드해야 합니다."
    },
    {
      "file": "app/page.tsx",
      "code": "import Link from 'next/link'\nimport Image from 'next/image'\n\nexport default function Page() {\n  return (\n    <>\n      <Link href=\"/products\">상품 목록</Link>\n      <Image src=\"/shop/shoes.webp\" alt=\"러닝화\"\n        width={320} height={240} />\n    </>\n  )\n}",
      "note": "별도 앱의 public/shoes.webp를 사용한 예제입니다. Link는 /shop/products를 만들고, Image의 src에는 /shop을 직접 적습니다."
    },
    {
      "file": "별도 앱에서 확인할 명령",
      "code": "pnpm build\npnpm exec next start --port 3100\n# 브라우저에서 http://localhost:3100/shop 열기",
      "note": "app/products/page.tsx와 public/shoes.webp도 준비합니다. Elements에서 상품 목록 링크의 href, Network에서 이미지 src에 해당하는 요청 경로와 응답을 확인합니다."
    }
  ],
  "procedure": [
    "위 파일들을 별도의 Next.js 앱에 준비하고 /shop 경로로 접속합니다. 이 학습 사이트의 basePath를 바꾸는 절차가 아닙니다.",
    "상품 목록 링크의 href가 /shop/products인지 확인하고 클릭합니다. 일반 <a href=\"/products\">는 브라우저가 그대로 요청하므로 자동 접두사를 기대하면 안 됩니다.",
    "Image의 src에서 /shop을 뺀 경우와 다시 넣은 경우를 비교합니다. Network에서 실제 이미지 요청의 경로와 성공 여부를 확인합니다."
  ],
  "cautions": [
    "basePath를 바꾼 뒤 서버만 재시작하면 기존 프로덕션 번들은 이전 값을 사용합니다. 다시 빌드하고 배포하세요.",
    "CDN으로 번들만 옮기는 목적이라면 assetPrefix의 적용 범위를 확인하세요. basePath는 애플리케이션 경로의 접두사입니다."
  ],
  "questions": [
    {
      "prompt": "basePath: '/shop'일 때 Link href='/products'가 만드는 href는?",
      "choices": [
        "/shop/products",
        "/products",
        "/shop/shop/products"
      ],
      "correct": 0,
      "reason": "next/link가 애플리케이션 링크에 basePath를 자동으로 붙입니다."
    },
    {
      "prompt": "public/shoes.webp를 next/image로 표시할 때 올바른 src는?",
      "choices": [
        "/shoes.webp",
        "/shop/shoes.webp",
        "/shop/public/shoes.webp"
      ],
      "correct": 1,
      "reason": "next/image의 src에는 basePath를 직접 붙입니다. public이라는 디렉토리명은 URL에 넣지 않습니다."
    }
  ],
  "concepts": [
    {
      "title": "링크와 이미지의 차이",
      "body": "방금 고른 /shop/products는 Link가 만든 경로입니다. /shop/shoes.webp는 개발자가 src에 적은 경로입니다. 모든 URL을 자동으로 바꾼다고 이해하면 이미지 누락을 놓칩니다."
    },
    {
      "title": "빌드와 요청의 흐름",
      "body": "next.config.ts의 basePath → 빌드된 라우팅 코드 → /shop 아래의 페이지와 자산 요청. 브라우저에서 버튼을 눌러 전역 basePath를 바꿀 수는 없습니다."
    }
  ],
  "references": [
    {
      "label": "basePath 공식 문서",
      "url": "https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath"
    }
  ]
}
