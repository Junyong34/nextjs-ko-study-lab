export const content = {
  "scenario": "상품 카탈로그 서버를 컨테이너로 옮기려 합니다. 전체 개발 의존성을 설치하는 대신, 빌드가 추적한 실행 파일을 패키징합니다.",
  "examples": [
    {
      "file": "next.config.ts",
      "code": "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = { output: 'standalone' }\nexport default nextConfig",
      "note": "next build가 의존성을 추적하고 필요한 파일을 .next/standalone에 복사합니다. 이미지 크기 감소율은 프로젝트와 컨테이너 구성에 따라 달라집니다."
    },
    {
      "file": "단일 앱의 빌드·실행 절차",
      "code": "pnpm build\n# public 디렉토리를 사용하는 앱에서만 복사\ncp -r public .next/standalone/\ncp -r .next/static .next/standalone/.next/\nPORT=3100 HOSTNAME=0.0.0.0 node .next/standalone/server.js",
      "note": "public과 .next/static은 기본 자동 복사 대상에서 제외됩니다. 별도 CDN을 쓰지 않는다면 직접 복사하고, HTML뿐 아니라 상품 이미지와 JS/CSS 응답도 확인합니다."
    },
    {
      "file": "단일 앱의 컨테이너 실행 단계 예시",
      "code": "FROM node:22-bookworm-slim\nWORKDIR /app\nENV NODE_ENV=production\nCOPY .next/standalone ./\nCOPY .next/static ./.next/static\n# public을 사용하는 앱에서만 추가\n# COPY public ./public\nENV HOSTNAME=0.0.0.0\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
      "note": "이미 빌드한 단일 앱의 산출물을 복사하는 예제입니다. Dockerfile 자체가 next build를 실행하지 않으므로 먼저 빌드하고, public을 쓰면 해당 COPY 줄도 추가하세요."
    }
  ],
  "procedure": [
    "별도의 단일 Next.js 앱에서 빌드하고 .next/standalone/server.js와 필요한 node_modules 파일이 생성됐는지 확인합니다.",
    "CDN을 사용하지 않는다면 정적 파일을 복사하고 node .next/standalone/server.js로 서버를 실행합니다.",
    "상품 페이지를 연 뒤 Network에서 JS/CSS와 상품 이미지가 200으로 응답하는지 확인합니다. 서버가 시작됐어도 정적 파일은 누락될 수 있습니다."
  ],
  "cautions": [
    "모노레포에서는 outputFileTracingRoot와 실제 server.js 위치를 확인합니다. 추적 루트에 따라 앱 경로가 산출물 안에 유지될 수 있으므로 위 단일 앱 경로를 그대로 쓰지 마세요.",
    "별도로 작성한 custom server는 standalone의 server.js와 함께 자동 추적·패키징되는 방식이 아닙니다. 산출물과 컨테이너 크기는 직접 측정하세요."
  ],
  "questions": [
    {
      "prompt": "standalone 산출물을 실행하는 기본 방법은?",
      "choices": [
        "out/index.html만 정적 호스팅",
        "node .next/standalone/server.js",
        "Node.js 없이 Dockerfile만 실행"
      ],
      "correct": 1,
      "reason": "standalone에는 최소 Node.js 서버인 server.js가 포함됩니다. 정적 export와 달리 서버 런타임이 필요합니다."
    },
    {
      "prompt": "별도 CDN 없이 JS/CSS와 public 이미지를 제공하려면?",
      "choices": [
        "public과 .next/static을 산출물에 직접 복사",
        "server.js만 복사하면 모든 자산이 자동 포함",
        "이미지를 전부 node_modules에 이동"
      ],
      "correct": 0,
      "reason": "public과 .next/static은 기본 자동 복사 대상이 아닙니다. 서버가 직접 제공하도록 올바른 위치에 복사합니다."
    }
  ],
  "concepts": [
    {
      "title": "추적과 패키징",
      "body": "next build → 파일 의존성 추적 → .next/standalone → Node.js server.js. 방금 고른 실행 명령은 서버를 시작하며, Node.js 런타임을 제거하는 설정은 아닙니다."
    },
    {
      "title": "서버와 정적 파일의 분리",
      "body": "두 번째 문항처럼 서버 패키징과 정적 파일 배포를 함께 확인합니다. Docker는 이 파일들을 담는 실행 환경이며, standalone 옵션만으로 이미지 크기나 정상 배포를 보장하지 않습니다."
    }
  ],
  "references": [
    {
      "label": "output 공식 문서",
      "url": "https://nextjs.org/docs/app/api-reference/config/next-config-js/output"
    }
  ]
}
