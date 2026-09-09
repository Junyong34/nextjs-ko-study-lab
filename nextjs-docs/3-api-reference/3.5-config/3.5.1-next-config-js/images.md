# images

- 공식 문서: [images](https://nextjs.org/docs/app/api-reference/config/next-config-js/images)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js의 이미지 최적화 동작을 제어하는 `images` 설정 객체의 구조와 핵심 속성을 이해한다.
- 커스텀 이미지 로더(Custom Loader)를 구성하여 외부 CDN이나 클라우드 이미지 최적화 서비스를 연동하는 방법을 파악한다.
- `remotePatterns`, `qualities`, `formats` 등 내장 이미지 최적화 API의 보안 및 변환 설정을 구성할 수 있다.
- 프로바이더별 로더 함수 구현 패턴과 Client Component 직렬화 제약 조건을 설명할 수 있다.

## 핵심 개념 및 설명

Next.js 내장 Image Optimization API 대신 외부 클라우드 이미지 프로바이더로 이미지를 최적화하려 한다면 `next.config.js`의 `images` 객체에서 커스텀 설정을 구성할 수 있다.

또한 Next.js 내장 이미지 최적화 파이프라인을 그대로 활용할 때도 허용 원격 도메인(`remotePatterns`), 허용 이미지 품질(`qualities`), 지원 포맷(`formats`), 캐시 수명(`minimumCacheTTL`) 등을 이 설정에서 제어한다.

### 기본 설정 구조: 커스텀 로더 (Custom Loader)

클라우드 이미지 프로바이더를 전역 로더로 쓰려면 `loader`를 `'custom'`으로 지정하고 `loaderFile` 경로를 설정한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.ts',
  },
}

export default nextConfig
```

`loaderFile`은 Next.js 애플리케이션 루트를 기준으로 한 상대 파일 경로를 가리켜야 한다. 이 파일은 URL 문자열을 반환하는 기본 함수(default function)를 export해야 한다:

```ts filename="my/image/loader.ts"
'use client'

interface ImageLoaderProps {
  src: string
  width: number
  quality?: number
}

export default function myImageLoader({ src, width, quality }: ImageLoaderProps): string {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

전역 파일 지정 외에도, `next/image` 인스턴스마다 [`loader` prop](../../3.2-components/image.md#loader)을 직접 전달해 로더 함수를 지정할 수도 있다.

> **알아두면 좋은 점**:
>
> - 함수를 인수로 받는 커스텀 이미지 로더 파일을 구성할 때는 전달한 함수를 직렬화하도록 [Client Component](../../../1-getting-started/server-and-client-components.md) 지시어(`'use client'`)를 선언해야 한다.
> - `loader: 'custom'`을 적용하면 Next.js 서버의 내장 이미지 최적화 엔드포인트(`/_next/image`)를 거치지 않고 브라우저가 외부 로더 URL로 이미지를 직접 요청한다.

---

### 이미지 설정 옵션 (Configuration Options)

Next.js 내장 Image Optimization API와 `<Image>` 컴포넌트의 동작 방식을 제어하는 전체 설정 속성은 다음과 같다:

| 옵션명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `loader` | `'default' \| 'custom' \| 'cloudinary' \| 'akamai' \| 'imgix'` | `'default'` | 이미지 최적화에 사용할 로더 엔진을 지정한다. |
| `loaderFile` | `string` | `undefined` | 커스텀 로더 모듈의 프로젝트 루트 기준 상대 경로를 지정한다. |
| `localPatterns` | `Array<{ pathname: string, search?: string }>` | `undefined` | 최적화를 허용할 로컬 이미지 경로 및 쿼리 패턴을 제한한다. |
| `remotePatterns` | `Array<RemotePattern \| URL>` | `[]` | 최적화를 허용할 외부 호스트 및 경로 패턴 목록을 정의한다. |
| `path` | `string` | `'/ _next/image'` | 내장 이미지 최적화 API 엔드포인트의 기본 요청 경로를 지정한다. |
| `deviceSizes` | `number[]` | `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]` | 디바이스 화면 너비 중단점(breakpoint) 목록을 설정한다 (`sizes` prop과 연동). |
| `imageSizes` | `number[]` | `[32, 48, 64, 96, 128, 256, 384]` | 화면 너비보다 작은 고정 크기 이미지용 너비 목록을 설정한다. |
| `qualities` | `number[]` | `[75]` | 최적화 시 허용되는 이미지 품질(1~100) 목록을 지정한다 (Next.js 16 필수 보안 제약). |
| `formats` | `Array<'image/webp' \| 'image/avif'>` | `['image/webp']` | 생성할 최적화 이미지 포맷 목록을 정의한다. 브라우저의 `Accept` 헤더와 일치하는 첫 번째 포맷이 제공된다. |
| `minimumCacheTTL` | `number` | `14400` (4시간) | 최적화된 이미지의 캐시 유지 시간(초 단위)을 설정한다. |
| `disableStaticImages` | `boolean` | `false` | 정적 이미지 임포트(`import img from './logo.png'`) 동작을 비활성화한다. |
| `maximumRedirects` | `number` | `3` | 원격 이미지를 가져올 때 허용할 최대 HTTP 리다이렉트 횟수를 설정한다 (0이면 리다이렉트 비활성화). |
| `maximumDiskCacheSize` | `number` | 사용 가능한 디스크의 50% | 이미지 캐시가 차지할 수 있는 최대 디스크 용량(바이트)을 지정한다. |
| `maximumResponseBody` | `number` | `50_000_000` (50MB) | 최적화할 원본 이미지의 최대 응답 본문 크기(바이트)를 제한한다. |
| `dangerouslyAllowLocalIP` | `boolean` | `false` | 내부 네트워크 사설 IP(로컬 호스트 등)에 대한 이미지 최적화 요청을 허용한다 (SSRF 위험 유의). |
| `dangerouslyAllowSVG` | `boolean` | `false` | SVG 이미지 서빙 및 최적화를 허용한다 (XSS 위험 방지를 위해 CSP와 함께 사용 필수). |
| `contentDispositionType` | `'inline' \| 'attachment'` | `'attachment'` | 응답 `Content-Disposition` 헤더 방식을 지정한다. |
| `contentSecurityPolicy` | `string` | `undefined` | 이미지 제공 시 적용할 CSP(Content Security Policy) 헤더 값을 지정한다. |
| `domains` | `string[]` | `[]` | *(v14부터 Deprecated)* 허용 호스트명 목록. `remotePatterns` 사용을 권장한다. |

#### remotePatterns를 통한 외부 이미지 보안 구성

Next.js는 악의적인 사용자가 임의의 외부 URL을 이미지 최적화 엔드포인트로 요청해 서버 자원을 고갈시키는 공격(SSRF)을 방지하려고 엄격한 패턴 매칭을 요구한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/account/**',
        search: '',
      },
    ],
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `remotePatterns`에서 `protocol`, `port`, `pathname`, `search`를 생략하면 와일드카드 `**`가 암시된다. 보안을 위해 경로는 가능한 한 구체적으로 지정하기를 권장한다.
> - Next.js 16에서는 `qualities` 배열에 명시되지 않은 임의의 `quality` 파라미터 요청이 들어오면 API 수준에서 `400 Bad Request` 에러를 반환한다.

---

### 로더 구성 예제 (Example Loader Configuration)

주요 클라우드·CDN 프로바이더에 맞춘 커스텀 로더 함수 구현 예제다.

#### Akamai

```js
// 공식 문서: https://techdocs.akamai.com/ivm/reference/test-images-on-demand
export default function akamaiLoader({ src, width, quality }) {
  return `https://example.com/${src}?imwidth=${width}`
}
```

#### AWS CloudFront

```js
// 공식 문서: https://aws.amazon.com/developer/application-security-performance/articles/image-optimization
export default function cloudfrontLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('format', 'auto')
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

#### Cloudinary

```js
// 데모: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://example.com/${params.join(',')}${src}`
}
```

#### Cloudflare

```js
// 공식 문서: https://developers.cloudflare.com/images/transform-images
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
  return `https://example.com/cdn-cgi/image/${params.join(',')}/${src}`
}
```

#### Contentful

```js
// 공식 문서: https://www.contentful.com/developers/docs/references/images-api/
export default function contentfulLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('fm', 'webp')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}
```

#### Fastly

```js
// 공식 문서: https://developer.fastly.com/reference/io/
export default function fastlyLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('auto', 'webp')
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

#### Gumlet

```js
// 공식 문서: https://docs.gumlet.com/reference/image-transform-size
export default function gumletLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('format', 'auto')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}
```

#### ImageEngine

```js
// 공식 문서: https://support.imageengine.io/hc/en-us/articles/360058880672-Directives
export default function imageengineLoader({ src, width, quality }) {
  const compression = 100 - (quality || 50)
  const params = [`w_${width}`, `cmpr_${compression}`]
  return `https://example.com${src}?imgeng=/${params.join('/')}`
}
```

#### Imgix

```js
// 데모: https://static.imgix.net/daisy.png?format=auto&fit=max&w=300
export default function imgixLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  const params = url.searchParams
  params.set('auto', params.getAll('auto').join(',') || 'format')
  params.set('fit', params.get('fit') || 'max')
  params.set('w', params.get('w') || width.toString())
  params.set('q', (quality || 50).toString())
  return url.href
}
```

#### PixelBin

```js
// 리사이즈 문서: https://www.pixelbin.io/docs/transformations/basic/resize/#width-w
// 최적화 문서: https://www.pixelbin.io/docs/optimizations/quality/#image-quality-when-delivering
// 자동 포맷 전송 문서: https://www.pixelbin.io/docs/optimizations/format/#automatic-format-selection-with-f_auto-url-parameter
export default function pixelBinLoader({ src, width, quality }) {
  const name = '<your-cloud-name>'
  const opt = `t.resize(w:${width})~t.compress(q:${quality || 75})`
  return `https://cdn.pixelbin.io/v2/${name}/${opt}/${src}?f_auto=true`
}
```

#### Sanity

```js
// 공식 문서: https://www.sanity.io/docs/image-urls
export default function sanityLoader({ src, width, quality }) {
  const prj = 'zp7mbokg'
  const dataset = 'production'
  const url = new URL(`https://cdn.sanity.io/images/${prj}/${dataset}${src}`)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  url.searchParams.set('w', width.toString())
  if (quality) {
    url.searchParams.set('q', quality.toString())
  }
  return url.href
}
```

#### Sirv

```js
// 공식 문서: https://sirv.com/help/articles/dynamic-imaging/
export default function sirvLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  const params = url.searchParams
  params.set('format', params.getAll('format').join(',') || 'optimal')
  params.set('w', params.get('w') || width.toString())
  params.set('q', (quality || 85).toString())
  return url.href
}
```

#### Supabase

```js
// 공식 문서: https://supabase.com/docs/guides/storage/image-transformations#nextjs-loader
export default function supabaseLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

#### Thumbor

```js
// 공식 문서: https://thumbor.readthedocs.io/en/latest/
export default function thumborLoader({ src, width, quality }) {
  const params = [`${width}x0`, `filters:quality(${quality || 75})`]
  return `https://example.com${params.join('/')}${src}`
}
```

#### ImageKit.io

```js
// 공식 문서: https://imagekit.io/docs/image-transformation
export default function imageKitLoader({ src, width, quality }) {
  const params = [`w-${width}`, `q-${quality || 80}`]
  return `https://ik.imagekit.io/your_imagekit_id/${src}?tr=${params.join(',')}`
}
```

#### Nitrogen AIO

```js
// 공식 문서: https://docs.n7.io/aio/intergrations/
export default function aioLoader({ src, width, quality }) {
  const url = new URL(src, window.location.href)
  const params = url.searchParams
  const aioParams = params.getAll('aio')
  aioParams.push(`w-${width}`)
  if (quality) {
    aioParams.push(`q-${quality.toString()}`)
  }
  params.set('aio', aioParams.join(';'))
  return url.href
}
```

---

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (다양한 크기, 포맷(WebP/AVIF), 리모트 이미지 최적화 결과 브라우저 관찰 가능)
- 브라우저 개발자 도구 Network 탭에서 `/_next/image?url=...` 엔드포인트로 요청한 이미지 파일의 `Content-Type`이 `image/webp` 또는 `image/avif`로 자동 변환되는지 확인한다.
- `remotePatterns`에 등록된 도메인 이미지는 200 OK와 함께 최적화된 결과가 서빙되고 등록되지 않은 외부 이미지 URL은 400 Bad Request로 차단되는 보안 동작을 검증한다.
- 커스텀 로더가 적용된 환경에서는 `/_next/image` 프록시를 거치지 않고 지정한 CDN 포맷의 URL로 직접 이미지 요청이 전송되는지 관찰한다.

---

## 연습 문제

1. Next.js의 `images.loaderFile`을 설정하여 커스텀 로더를 구성할 때 지켜야 하는 규칙으로 올바른 것은 무엇인가?
   - A. 로더 파일은 반드시 Node.js `fs` 모듈을 사용하는 Server Component여야 한다.
   - B. 로더 파일은 `'use client'`를 선언해야 하며, URL 문자열을 반환하는 함수를 기본(default) export해야 한다.
   - C. `loaderFile`은 반드시 상대 경로가 아닌 절대 파일 시스템 경로로 지정해야 한다.
   - D. `loaderFile`을 설정하면 `remotePatterns` 설정도 반드시 함께 선언해야 한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: 커스텀 로더 파일은 클라이언트 측에서 함수를 직렬화할 수 있도록 `'use client'` 지시어를 선언해야 하며 `{ src, width, quality }` 객체를 인수로 받아 완전한 이미지 URL 문자열을 반환하는 함수를 기본(default)으로 export해야 한다.
</details>

2. Next.js 16의 이미지 최적화 보안 규칙에 대한 설명 중 가장 적절한 것은 무엇인가?
   - A. `domains` 옵션을 사용하여 모든 서브도메인을 와일드카드로 한 번에 허용하는 것이 권장된다.
   - B. SVG 이미지는 보안상 안전하므로 별도의 CSP 설정 없이 항상 내장 최적화가 적용된다.
   - C. `qualities` 배열에 명시되지 않은 임의의 `quality` 파라미터가 이미지 최적화 API로 요청되면 400 Bad Request 에러가 반환된다.
   - D. `remotePatterns`에서 호스트명을 지정하면 모든 프로토콜(http, https, ftp)이 자동으로 안전하게 허용된다.

<details><summary>정답 보기</summary>

정답: **C**
해설: Next.js 16에서는 무차별적인 이미지 변환 요청으로 인한 DoS 공격을 방지하기 위해 `qualities` 설정 배열에 등록된 품질 값만 허용하며 허용되지 않은 품질 파라미터 요청은 400 Bad Request로 즉시 거부한다.
</details>

---

## 챕터 요약

- Next.js의 `images` 설정은 전역 커스텀 이미지 로더 지정과 내장 Image Optimization API 파이프라인 제어라는 두 가지 주요 역할을 한다.
- 외부 CDN(Cloudinary, CloudFront, Imgix 등)을 연동할 때는 `loader: 'custom'`과 `loaderFile`을 선언하고 `'use client'` 기반의 기본 export 로더 함수를 작성한다.
- 내장 최적화 파이프라인에서는 SSRF 공격을 차단하기 위해 `remotePatterns`를 상세하게 구성하고 허용할 이미지 품질 목록을 `qualities` 배열로 엄격하게 관리한다.
- AVIF 및 WebP 등 차세대 이미지 포맷을 `formats` 배열로 정의하면 브라우저의 `Accept` 지원 여부에 따라 최적의 포맷이 자동으로 협상되어 전송된다.
