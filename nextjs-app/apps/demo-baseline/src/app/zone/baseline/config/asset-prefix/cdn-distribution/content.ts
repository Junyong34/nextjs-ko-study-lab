export const content = {
  "scenario": "상품 카탈로그의 HTML은 앱 서버에서 제공하고, 빌드한 JS와 CSS는 별도 CDN에서 제공하려고 합니다. 어떤 파일을 업로드해야 할까요?",
  "examples": [
    {
      "file": "next.config.ts",
      "code": "import type { NextConfig } from 'next'\nimport { PHASE_DEVELOPMENT_SERVER } from 'next/constants'\n\nexport default (phase: string): NextConfig => ({\n  assetPrefix: phase === PHASE_DEVELOPMENT_SERVER\n    ? undefined\n    : 'https://cdn.example.com',\n})",
      "note": "개발에서는 로컬 자산을 사용하고, 프로덕션 빌드에는 예시 CDN 주소를 넣습니다. 실제 배포에서는 자신이 운영하는 CDN 주소를 사용하세요."
    },
    {
      "file": "배포할 파일과 예상 요청 경로",
      "code": ".next/static/chunks/<hash>.js\n  → CDN의 _next/static/chunks/<hash>.js\n  → https://cdn.example.com/_next/static/chunks/<hash>.js\n\npublic/shoes.webp\n  → /shoes.webp (assetPrefix가 자동으로 붙지 않음)\n\n/products\n  → 앱 서버의 페이지 요청",
      "note": "설정만으로 CDN에 파일이 업로드되지는 않습니다. .next/static의 내용을 CDN의 _next/static 경로에서 제공하도록 배포해야 합니다."
    },
    {
      "file": "별도 앱에서 확인할 명령",
      "code": "pnpm build\npnpm exec next start --port 3100\n# 배포한 앱의 Network에서 JS와 CSS 요청 확인",
      "note": "CDN 배포 후 프로덕션 앱을 엽니다. JS/CSS 요청의 호스트와 200 응답을 확인하고, public 이미지의 호스트와 비교하세요. 설정 예제의 주소만 넣으면 실제 로딩 성공을 보장할 수 없습니다."
    }
  ],
  "procedure": [
    "별도 앱에서 프로덕션 빌드를 만들고 .next/static의 내용을 CDN에 배포합니다.",
    "Network에서 _next/static 요청이 CDN으로 가는지, 파일이 정상 응답하는지 확인합니다. 개발 서버는 위 설정에서 CDN을 사용하지 않습니다.",
    "public 이미지와 /products 페이지가 같은 방식으로 바뀌는지 비교합니다. 이 두 경로의 CDN 배포는 별도로 설정합니다."
  ],
  "cautions": [
    ".next 전체를 CDN에 공개하지 마세요. 서버 코드와 설정 파일도 포함될 수 있으므로 .next/static만 대상으로 삼습니다.",
    "하위 경로에 앱을 배포하려면 basePath를 확인하세요. Vercel 배포는 CDN을 자동으로 구성하므로 이 설정을 별도로 추가할 필요가 없습니다."
  ],
  "questions": [
    {
      "prompt": "assetPrefix를 설정하면 어떤 요청에 접두사가 자동으로 붙을까요?",
      "choices": [
        "public/shoes.webp 요청",
        "/products 페이지 요청",
        "/_next/static/chunks의 JS 요청"
      ],
      "correct": 2,
      "reason": "자동 적용 대상은 _next/static에서 제공하는 빌드 자산입니다. public 파일과 페이지 라우트에는 자동으로 붙지 않습니다."
    },
    {
      "prompt": "CDN에 올릴 대상으로 올바른 것은?",
      "choices": [
        ".next/static의 내용을 _next/static 경로로 배포",
        ".next 디렉토리 전체를 공개",
        "next.config.ts만 업로드"
      ],
      "correct": 0,
      "reason": "assetPrefix는 요청 URL을 지정합니다. 실제 파일 배포도 필요하며 .next 전체를 공개하면 서버 파일이 노출될 수 있습니다."
    }
  ],
  "concepts": [
    {
      "title": "URL 설정과 파일 배포",
      "body": "방금 고른 JS 요청은 assetPrefix가 바꾸지만, 그 URL에서 파일을 제공하는 일은 CDN 배포 절차가 맡습니다. URL이 바뀐 것과 자산이 정상 로드된 것은 따로 확인합니다."
    },
    {
      "title": "페이지와 번들의 흐름",
      "body": "앱 서버의 HTML → CDN URL을 가리키는 JS/CSS 태그 → CDN의 _next/static 파일 응답. 이미지나 API까지 전부 CDN으로 이동한다고 해석하지 않습니다."
    }
  ],
  "references": [
    {
      "label": "assetPrefix 공식 문서",
      "url": "https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix"
    }
  ]
}
