# Deploying

- 공식 문서: [Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Node.js 서버, Docker, 정적 export, 어댑터의 기능 지원 범위를 비교할 수 있다.
- Node.js 프로덕션 서버에 필요한 빌드·시작 스크립트를 구성할 수 있다.
- 서버 기능이 필요한 애플리케이션에 정적 export를 선택하지 않을 수 있다.
- 검증된 어댑터와 플랫폼 자체 통합의 차이를 설명할 수 있다.

## 핵심 개념 및 설명

Next.js는 Node.js 서버, Docker 컨테이너, 정적 export로 배포하거나 플랫폼에 맞는 어댑터로 실행할 수 있다.

| 배포 옵션 | 기능 지원 |
| --- | --- |
| [Node.js 서버](#nodejs-서버) | 전체 |
| [Docker 컨테이너](#docker) | 전체 |
| [정적 export](#정적-export) | 제한적 |
| [어댑터](#어댑터) | 플랫폼마다 다름(검증된 어댑터는 호환성 테스트 실행) |

### Node.js 서버

Node.js를 지원하는 제공자라면 Next.js를 배포할 수 있다. `package.json`에 빌드와 시작 스크립트를 둔다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

`npm run build`로 애플리케이션을 빌드하고 `npm run start`로 서버를 시작한다. 이 서버는 Next.js의 모든 기능을 지원하며, 필요하면 [사용자 정의 서버](../2-guides/custom-server.md)로 전환할 수 있다. 인프라 설정은 [Self-hosting](../2-guides/self-hosting.md)을 참고한다.

#### 템플릿

- [Flightcontrol](https://github.com/nextjs/deploy-flightcontrol)
- [Railway](https://github.com/nextjs/deploy-railway)
- [Replit](https://github.com/nextjs/deploy-replit)
- [Hostinger](https://github.com/hostinger/deploy-nextjs)

### Docker

Docker 컨테이너를 지원하는 제공자, Kubernetes 같은 컨테이너 오케스트레이터, Docker를 실행하는 클라우드에 배포할 수 있다. 컨테이너화 모범 사례는 Docker 공식 [Next.js 가이드](https://docs.docker.com/guides/nextjs/)와 [React.js 가이드](https://docs.docker.com/guides/reactjs/)를 참고한다. Docker 배포는 모든 Next.js 기능을 지원한다.

> **개발 참고**: Docker는 프로덕션 배포에 적합하지만 Mac과 Windows에서 개발할 때는 성능을 위해 Docker보다 로컬 `npm run dev`를 고려한다. 자세한 내용은 [로컬 개발 최적화](../2-guides/local-development.md)를 참고한다.

#### 템플릿

- [Docker Standalone Output](https://github.com/vercel/next.js/tree/canary/examples/with-docker): `output: "standalone"`으로 런타임 파일과 의존성만 포함한 최소 프로덕션 이미지를 만든다.
- [Docker Export Output](https://github.com/vercel/next.js/tree/canary/examples/with-docker-export-output): `output: "export"`로 정적 HTML을 만들어 가벼운 컨테이너에서 제공한다.
- [Docker Multi-Environment](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env): 개발·스테이징·프로덕션별 Docker 설정과 환경 변수를 관리한다.

배포 안내를 제공하는 호스팅 제공자로 [DigitalOcean](https://github.com/nextjs/deploy-digitalocean), [Fly.io](https://github.com/nextjs/deploy-fly), [Google Cloud Run](https://github.com/nextjs/deploy-google-cloud-run), [Render](https://github.com/nextjs/deploy-render), [SST](https://github.com/nextjs/deploy-sst)가 있다.

### 정적 export

Next.js 애플리케이션은 정적 사이트나 [SPA](../2-guides/single-page-applications.md)로 시작한 뒤, 필요할 때 서버 기능을 사용하는 형태로 확장할 수 있다. 정적 export 결과는 HTML, CSS, JavaScript 정적 파일을 제공하는 AWS S3, Nginx, Apache 같은 웹 서버 어디서나 호스팅할 수 있다.

정적 export는 서버가 필요한 Next.js 기능을 지원하지 않는다. 지원하지 않는 기능은 [Static Exports](../2-guides/static-exports.md)에서 확인한다.

#### 템플릿

- [GitHub Pages](https://github.com/nextjs/deploy-github-pages)

### 어댑터

[Deployment Adapter API](../3-api-reference/3.5-config/3.5.1-next-config-js/adapterPath.md)는 플랫폼이 자체 인프라에 맞게 Next.js 빌드와 배포를 조정하게 한다.

#### 검증된 어댑터

검증된 어댑터는 오픈 소스이며 전체 [Next.js 호환성 테스트](../3-api-reference/3.7-adapters/testing-adapters.md)를 실행하고 Next.js GitHub 조직에서 호스팅된다. Next.js 팀은 메이저 릴리스 전에 해당 플랫폼과 테스트를 조율한다. 공개 테스트 결과는 추후 제공될 예정이다.

- [Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Bun](https://bun.com/docs/guides/ecosystem/nextjs)

Cloudflare와 Netlify는 Adapter API 기반의 검증된 어댑터를 개발 중이며, 그전까지는 자체 통합을 제공한다.

#### 기타 플랫폼

Appwrite Sites, AWS Amplify Hosting, Cloudflare, Deno Deploy, Firebase App Hosting, Netlify는 자체 Next.js 통합을 제공한다. 이 통합들은 공개 Adapter API 기반이 아니고 Next.js 팀의 검증을 받지 않았으므로 기능 지원과 호환성이 다를 수 있다. 세부 내용은 각 제공자의 문서와 [플랫폼 배포](../2-guides/deploying-to-platforms.md)를 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 배포 매트릭스만 설계)
- 데모 목적: 동일 앱을 Node.js 서버와 정적 export로 빌드해 지원 기능 차이를 비교한다.
- 사용자가 확인할 화면과 상호작용: 정적 페이지와 서버 의존 라우트를 각각 빌드·실행하고 결과를 기록한다.
- 관찰할 결과: Node.js와 Docker는 전체 기능을 지원하지만 정적 export에서는 서버 기능이 제외된다.

## 연습 문제

**Q1. (단일 선택) 서버 기능을 포함한 Next.js 애플리케이션의 전체 기능을 지원하지 않는 옵션은?**

1. Node.js 서버
2. Docker 컨테이너
3. 정적 export
4. 검증된 어댑터

<details><summary>정답 보기</summary>

**정답: 3** — 정적 export는 HTML/CSS/JavaScript 정적 자산만 제공하므로 서버가 필요한 기능은 지원하지 않는다.

</details>

**Q2. (복수 선택) 검증된 어댑터의 특징을 모두 고르시오.**

- [ ] 오픈 소스다.
- [ ] 전체 Next.js 호환성 테스트를 실행한다.
- [ ] Next.js GitHub 조직에서 호스팅된다.
- [ ] 모든 플랫폼 자체 통합이 자동으로 검증된 어댑터가 된다.

<details><summary>정답 보기</summary>

**정답: 1, 2, 3** — 플랫폼 자체 통합은 공개 Adapter API 기반이나 공식 검증 여부가 다를 수 있다.

</details>

## 요약

- Node.js 서버와 Docker 배포는 Next.js의 모든 기능을 지원한다.
- 정적 export는 일반 정적 웹 서버에서 호스팅할 수 있지만 서버 기능은 지원하지 않는다.
- Docker 개발은 Mac과 Windows에서 로컬 개발보다 느릴 수 있다.
- Deployment Adapter API는 플랫폼별 빌드·배포 조정을 가능하게 한다.
- 검증된 어댑터와 플랫폼 자체 통합은 테스트·호스팅·지원 범위가 다르다.
