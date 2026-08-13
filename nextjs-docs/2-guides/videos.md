# Videos

- 공식 문서: [Videos](https://nextjs.org/docs/app/guides/videos)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `<video>` 태그와 `<iframe>` 태그로 비디오를 임베드하는 방법과, 각 방식이 적합한 상황을 구분한다.
- `<video>`, `<iframe>`의 주요 속성과 접근성·자동 재생 관련 제약을 안다.
- 외부 플랫폼 비디오를 Server Component와 React Suspense로 스트리밍하는 패턴을 구현한다.
- Vercel Blob으로 비디오를 self-host하고, 자막을 함께 제공하는 방법을 안다.
- self-hosting과 비디오 호스팅 서비스(YouTube, Vimeo 등) 중 요구 사항에 맞는 방식을 선택할 수 있다.

## 핵심 개념 및 설명

이 챕터는 성능에 영향을 주지 않으면서 비디오 파일을 저장하고 화면에 표시하는 방법을 다룬다.

### `<video>`와 `<iframe>` 사용하기

비디오는 직접 서빙되는 파일이면 HTML **`<video>`** 태그로, 외부 플랫폼이 호스팅하는 비디오면 **`<iframe>`** 태그로 페이지에 임베드할 수 있다.

#### `<video>`

HTML [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 태그는 self-host하거나 직접 서빙되는 비디오 콘텐츠를 임베드할 수 있고, 재생과 화면 표시를 완전히 제어할 수 있다.

```tsx
export function Video() {
  return (
    <video width="320" height="240" controls preload="none">
      <source src="/path/to/video.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  )
}
```

#### 자주 쓰는 `<video>` 태그 속성

| 속성 | 설명 | 예시 값 |
| --- | --- | --- |
| `src` | 비디오 파일의 소스를 지정한다. | `<video src="/path/to/video.mp4" />` |
| `width` | 비디오 플레이어의 너비를 설정한다. | `<video width="320" />` |
| `height` | 비디오 플레이어의 높이를 설정한다. | `<video height="240" />` |
| `controls` | 있으면 기본 재생 컨트롤을 표시한다. | `<video controls />` |
| `autoPlay` | 페이지 로드 시 비디오를 자동으로 재생한다. 브라우저마다 autoplay 정책이 다르다는 점에 유의한다. | `<video autoPlay />` |
| `loop` | 비디오 재생을 반복한다. | `<video loop />` |
| `muted` | 기본적으로 오디오를 mute한다. 보통 `autoPlay`와 함께 사용한다. | `<video muted />` |
| `preload` | 비디오를 미리 로드하는 방식을 지정한다. 값: `none`, `metadata`, `auto`. | `<video preload="none" />` |
| `playsInline` | iOS 기기에서 인라인 재생을 활성화한다. iOS Safari에서 autoplay가 동작하려면 필요한 경우가 많다. | `<video playsInline />` |

> **알아두면 좋은 점**: `autoPlay` 속성을 사용할 때는 대부분의 브라우저에서 비디오가 자동으로 재생되도록 `muted` 속성을 함께 포함하고, iOS 기기와의 호환을 위해 `playsInline` 속성도 함께 포함해야 한다.

전체 비디오 속성 목록은 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attributes)를 참고한다.

#### 비디오 모범 사례

- **대체 콘텐츠**: `<video>` 태그를 쓸 때는 비디오 재생을 지원하지 않는 브라우저를 위한 대체 콘텐츠를 태그 안에 포함한다.
- **자막 또는 캡션**: 청각 장애가 있거나 소리를 듣기 어려운 사용자를 위해 자막이나 캡션을 포함한다. 캡션 파일 소스를 지정하려면 `<video>` 엘리먼트에 [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) 태그를 함께 사용한다.
- **접근 가능한 컨트롤**: 키보드 내비게이션과 스크린 리더 호환을 위해 표준 HTML5 비디오 컨트롤을 권장한다. 더 고급 기능이 필요하면 [react-player](https://github.com/cookpete/react-player)나 [video.js](https://videojs.com/) 같은 서드파티 플레이어를 검토한다. 이들은 접근 가능한 컨트롤과 일관된 브라우저 경험을 제공한다.

#### `<iframe>`

HTML `<iframe>` 태그를 사용하면 YouTube나 Vimeo 같은 외부 플랫폼의 비디오를 임베드할 수 있다.

```tsx
export default function Page() {
  return (
    <iframe src="https://www.youtube.com/embed/19g66ezsKAg" allowFullScreen />
  )
}
```

#### 자주 쓰는 `<iframe>` 태그 속성

| 속성 | 설명 | 예시 값 |
| --- | --- | --- |
| `src` | 임베드할 페이지의 URL이다. | `<iframe src="https://example.com" />` |
| `width` | iframe의 너비를 설정한다. | `<iframe width="500" />` |
| `height` | iframe의 높이를 설정한다. | `<iframe height="300" />` |
| `allowFullScreen` | iframe 콘텐츠를 전체 화면으로 표시할 수 있게 한다. | `<iframe allowFullScreen />` |
| `sandbox` | iframe 안의 콘텐츠에 추가적인 제약을 건다. | `<iframe sandbox />` |
| `loading` | 로딩 동작을 최적화한다(예: lazy loading). | `<iframe loading="lazy" />` |
| `title` | 접근성을 위해 iframe의 제목을 제공한다. | `<iframe title="Description" />` |

전체 iframe 속성 목록은 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attributes)를 참고한다.

#### 비디오 임베드 방식 선택하기

Next.js 애플리케이션에 비디오를 임베드하는 방법은 두 가지다.

- **Self-host 또는 직접 서빙되는 비디오 파일**: 플레이어의 기능과 화면을 세밀하게 제어해야 하는 상황이라면 `<video>` 태그로 self-host 비디오를 임베드한다. 이 방식은 Next.js 안에서 비디오 콘텐츠를 커스터마이즈하고 제어할 수 있게 해준다.
- **YouTube, Vimeo 등 비디오 호스팅 서비스 사용**: 비디오 호스팅 서비스를 쓴다면 `<iframe>` 태그로 그 서비스의 iframe 기반 플레이어를 임베드한다. 이 방식은 플레이어에 대한 제어권은 일부 제한되지만, 그 플랫폼이 제공하는 편의성과 기능을 그대로 누릴 수 있다.

애플리케이션의 요구 사항과 전달하려는 사용자 경험에 맞는 임베드 방식을 선택한다.

#### 외부 호스팅 비디오 임베드하기

외부 플랫폼의 비디오를 임베드할 때는 Next.js로 비디오 정보를 가져오고, 로딩 중 대체 상태를 처리하기 위해 React Suspense를 사용할 수 있다.

**1. 비디오 임베드용 Server Component 만들기**

첫 단계는 비디오를 임베드할 iframe을 생성하는 [Server Component](../1-getting-started/server-and-client-components.md)를 만드는 것이다. 이 컴포넌트는 비디오의 소스 URL을 가져와 iframe을 렌더링한다.

```tsx
export default async function VideoComponent() {
  const src = await getVideoSrc()

  return <iframe src={src} allowFullScreen />
}
```

**2. React Suspense로 비디오 컴포넌트 스트리밍하기**

비디오를 임베드하는 Server Component를 만든 다음에는, [React Suspense](https://react.dev/reference/react/Suspense)를 사용해 그 컴포넌트를 [스트리밍](../3-api-reference/3.1-file-conventions/loading.md)한다.

```tsx
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>Loading video...</p>}>
        <VideoComponent />
      </Suspense>
      {/* 페이지의 다른 콘텐츠 */}
    </section>
  )
}
```

> **알아두면 좋은 점**: 외부 플랫폼의 비디오를 임베드할 때는 다음 모범 사례를 고려한다.
>
> - 비디오 임베드가 반응형으로 동작하도록 만든다. CSS로 iframe이나 비디오 플레이어가 다양한 화면 크기에 맞춰지도록 한다.
> - 특히 데이터 요금제가 제한된 사용자를 위해 네트워크 상황에 따른 [비디오 로딩 전략](https://yoast.com/site-speed-tips-for-faster-video/)을 적용한다.

이 방식을 사용하면 사용자 경험이 개선된다. 페이지가 차단되지 않으므로, 비디오 컴포넌트가 스트리밍되는 동안에도 사용자가 페이지와 상호작용할 수 있기 때문이다.

더 나은 로딩 경험을 제공하려면, 단순한 로딩 메시지 대신 비디오 플레이어와 비슷한 모양의 로딩 스켈레톤을 fallback UI로 사용할 수 있다.

```tsx
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'
import VideoSkeleton from '../ui/VideoSkeleton.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<VideoSkeleton />}>
        <VideoComponent />
      </Suspense>
      {/* 페이지의 다른 콘텐츠 */}
    </section>
  )
}
```

### Self-host 비디오

비디오를 self-host하는 편이 나은 경우는 다음과 같은 이유 때문이다.

- **완전한 제어와 독립성**: self-hosting은 재생부터 화면 표시까지 비디오 콘텐츠를 직접 관리할 수 있게 해준다. 외부 플랫폼의 제약 없이 완전한 소유권과 제어권을 갖는다.
- **특수한 요구에 맞는 커스터마이즈**: 다이나믹한 배경 비디오처럼 독특한 요구 사항에 적합하다. 디자인과 기능 요구에 맞춰 원하는 대로 커스터마이즈할 수 있다.
- **성능과 확장성 고려**: 늘어나는 트래픽과 콘텐츠 크기를 효과적으로 지원하려면 성능이 좋고 확장 가능한 스토리지 솔루션을 선택한다.
- **비용과 통합**: 스토리지·대역폭 비용과, Next.js 프레임워크 및 더 넓은 기술 생태계에 쉽게 통합해야 한다는 필요 사이에서 균형을 맞춘다.

#### Vercel Blob으로 비디오 호스팅하기

[Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)은 Next.js와 잘 맞는 확장 가능한 클라우드 스토리지 솔루션으로, 비디오를 효율적으로 호스팅하는 방법을 제공한다. Vercel Blob으로 비디오를 호스팅하는 방법은 다음과 같다.

**1. Vercel Blob에 비디오 업로드하기**

Vercel 대시보드에서 "Storage" 탭으로 이동해 [Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 스토어를 선택한다. Blob 테이블 오른쪽 위에 있는 "Upload" 버튼을 찾아 클릭한 뒤, 업로드하려는 비디오 파일을 선택한다. 업로드가 끝나면 비디오 파일이 Blob 테이블에 나타난다.

또는 Server Action으로 비디오를 업로드할 수도 있다. 자세한 방법은 Vercel 문서의 [서버 사이드 업로드](https://vercel.com/docs/vercel-blob/server-upload)를 참고한다. Vercel은 [클라이언트 사이드 업로드](https://vercel.com/docs/vercel-blob/client-upload)도 지원하며, 이 방식이 더 적합한 경우도 있다.

**2. Next.js에서 비디오 표시하기**

비디오가 업로드되어 저장되면 Next.js 애플리케이션에서 그 비디오를 표시할 수 있다. 다음은 `<video>` 태그와 React Suspense를 사용하는 예시다.

```tsx
import { Suspense } from 'react'
import { list } from '@vercel/blob'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <VideoComponent fileName="my-video.mp4" />
    </Suspense>
  )
}

async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  })
  const { url } = blobs[0]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
```

이 방식에서는 페이지가 비디오의 `@vercel/blob` URL을 사용해 `VideoComponent`로 비디오를 표시한다. React Suspense는 비디오 URL을 가져와 비디오가 표시될 준비가 될 때까지 fallback을 보여주는 데 사용된다.

#### 비디오에 자막 추가하기

비디오에 자막이 있다면 `<video>` 태그 안에 `<track>` 엘리먼트를 사용해 쉽게 추가할 수 있다. 비디오 파일과 비슷한 방식으로 [Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)에서 자막 파일을 가져올 수 있다. 자막을 포함하도록 `<VideoComponent>`를 갱신하는 방법은 다음과 같다.

```tsx
async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 2,
  })
  const { url } = blobs[0]
  const { url: captionsUrl } = blobs[1]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      <track src={captionsUrl} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  )
}
```

이 방식을 따르면 Next.js 애플리케이션에 비디오를 효과적으로 self-host하고 통합할 수 있다.

### 참고 자료

비디오 최적화와 모범 사례를 더 배우려면 다음 자료를 참고한다.

- **비디오 포맷과 코덱 이해하기**: 호환성이 필요하면 MP4, 웹 최적화가 필요하면 WebM처럼 비디오 목적에 맞는 포맷과 코덱을 선택한다. 자세한 내용은 [Mozilla의 비디오 코덱 가이드](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)를 참고한다.
- **비디오 압축**: FFmpeg 같은 도구로 품질과 파일 크기의 균형을 맞춰 비디오를 효과적으로 압축한다. 압축 기법은 [FFmpeg 공식 사이트](https://www.ffmpeg.org/)에서 확인한다.
- **해상도와 비트레이트 조정**: 시청 플랫폼에 맞춰 [해상도와 비트레이트](https://www.dacast.com/blog/bitrate-vs-resolution/#:~:text=The%20two%20measure%20different%20aspects,yield%20different%20qualities%20of%20video)를 조정하고, 모바일 기기에는 더 낮은 값을 설정한다.
- **CDN(Content Delivery Network)**: CDN을 활용하면 비디오 전송 속도를 높이고 높은 트래픽을 관리할 수 있다. Vercel Blob 같은 일부 스토리지 솔루션을 사용하면 CDN 기능이 자동으로 처리된다. CDN과 그 장점은 [여기](https://vercel.com/docs/cdn?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)에서 더 알아본다.

Next.js 프로젝트에 비디오를 통합할 수 있는 다음 비디오 스트리밍 플랫폼도 참고할 만하다.

**오픈소스 next-video 컴포넌트**

- Next.js용 `<Video>` 컴포넌트를 제공하며, [Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website), S3, Backblaze, Mux 등 다양한 호스팅 서비스와 호환된다.
- 여러 호스팅 서비스와 함께 `next-video.dev`를 사용하는 방법은 [상세 문서](https://next-video.dev/docs)를 참고한다.

**Cloudinary 통합**

- Next.js와 Cloudinary를 함께 사용하는 공식 [문서와 통합 가이드](https://next.cloudinary.dev/)를 제공한다.
- [드롭인 비디오 지원](https://next.cloudinary.dev/cldvideoplayer/basic-usage)을 위한 `<CldVideoPlayer>` 컴포넌트를 포함한다.
- [Adaptive Bitrate Streaming](https://github.com/cloudinary-community/cloudinary-examples/tree/main/examples/nextjs-cldvideoplayer-abr)을 포함해 Next.js와 Cloudinary를 통합하는 [예제](https://github.com/cloudinary-community/cloudinary-examples/?tab=readme-ov-file#nextjs)를 확인할 수 있다.
- Node.js SDK를 포함한 다른 [Cloudinary 라이브러리](https://cloudinary.com/documentation)도 제공된다.

**Mux Video API**

- Mux는 Mux와 Next.js로 비디오 강좌를 만드는 [스타터 템플릿](https://github.com/muxinc/video-course-starter-kit)을 제공한다.
- Next.js 애플리케이션에 [고성능 비디오를 임베드하기](https://www.mux.com/for/nextjs) 위한 Mux의 권장 사항을 확인할 수 있다.
- Mux와 Next.js를 함께 사용하는 [예제 프로젝트](https://with-mux-video.vercel.app/)를 살펴볼 수 있다.

**Fastly**

- Next.js에 [주문형 비디오(VOD)](https://www.fastly.com/products/streaming-media/video-on-demand)와 스트리밍 미디어를 통합하는 Fastly의 솔루션을 더 알아본다.

**ImageKit.io 통합**

- Next.js와 ImageKit을 통합하는 [공식 퀵스타트 가이드](https://imagekit.io/docs/integration/nextjs)를 확인한다.
- [매끄러운 비디오 지원](https://imagekit.io/docs/integration/nextjs#rendering-videos)을 제공하는 `<IKVideo>` 컴포넌트를 포함한다.
- Node.js SDK 등 다른 [ImageKit 라이브러리](https://imagekit.io/docs)도 살펴볼 수 있다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 같은 비디오를 `<video>` self-host 방식과 `<iframe>` 외부 호스팅 방식으로 나란히 두고, 로딩 전략(`preload`, Suspense fallback)과 제어권 차이를 비교한다.
- 사용자가 확인할 화면과 상호작용: `<video>`에는 `controls`, `preload="none"`, `autoPlay`+`muted`+`playsInline` 조합을 적용해보고, `<iframe>`에는 `loading="lazy"`를 적용해 Network 탭에서 요청 시점이 달라지는지 확인한다. Server Component가 비디오 소스를 가져오는 동안 Suspense fallback(로딩 스켈레톤)이 표시되는지도 확인한다.
- 예제에서 관찰할 결과: self-host 비디오는 플레이어 제어와 자막(`<track>`)을 세밀하게 다룰 수 있는 대신 스토리지·대역폭 비용이 따르고, iframe 임베드는 설정이 단순한 대신 플레이어 제어가 제한된다는 것.

## 연습 문제

**Q1. (단일 선택) 외부 플랫폼(YouTube, Vimeo 등)이 호스팅하는 비디오를 임베드할 때 사용하는 HTML 태그는?**

1. `<video>`
2. `<iframe>`
3. `<embed>`
4. `<object>`

<details>
<summary>정답 보기</summary>

**정답: 2** — 외부 플랫폼이 호스팅하는 비디오는 그 플랫폼의 iframe 기반 플레이어를 `<iframe>` 태그로 임베드한다. self-host 비디오 파일은 `<video>` 태그를 사용한다.

</details>

**Q2. (단일 선택) `<video autoPlay>`로 대부분의 브라우저에서 자동 재생이 정상 동작하게 하려면 반드시 함께 지정해야 하는 속성은?**

1. `loop`
2. `controls`
3. `muted`
4. `preload`

<details>
<summary>정답 보기</summary>

**정답: 3** — `autoPlay` 속성을 사용할 때는 대부분의 브라우저에서 자동 재생이 동작하도록 `muted` 속성을 함께 지정해야 하며, iOS 호환을 위해 `playsInline`도 함께 지정하는 것이 좋다.

</details>

**Q3. (복수 선택) 외부 플랫폼 비디오를 Server Component와 React Suspense로 스트리밍하는 방식에 대한 설명 중 옳은 것을 모두 고르시오.**

- [ ] Server Component가 비디오 소스 URL을 가져와 iframe을 렌더링한다.
- [ ] `<Suspense>`의 `fallback`으로 로딩 스켈레톤을 사용할 수 있다.
- [ ] 이 방식은 비디오 컴포넌트가 준비될 때까지 페이지 전체의 상호작용을 차단한다.
- [ ] Vercel Blob에서 비디오와 자막 파일을 함께 가져올 수 있다.

<details>
<summary>정답 보기</summary>

**정답: Server Component가 비디오 소스 URL을 가져와 iframe을 렌더링한다, `<Suspense>`의 `fallback`으로 로딩 스켈레톤을 사용할 수 있다, Vercel Blob에서 비디오와 자막 파일을 함께 가져올 수 있다** — Suspense로 스트리밍하면 비디오 컴포넌트가 로드되는 동안에도 사용자가 페이지와 상호작용할 수 있으므로, 페이지 전체를 차단한다는 설명은 옳지 않다.

</details>

## 챕터 요약

- 비디오는 self-host 파일이면 `<video>` 태그로, 외부 플랫폼(YouTube, Vimeo 등)이 호스팅하면 `<iframe>` 태그로 임베드한다.
- `<video>`는 `controls`, `autoPlay`(+`muted`, `playsInline`), `preload` 등의 속성으로 재생을 제어하며, `<track>`으로 자막을 추가할 수 있다.
- 외부 호스팅 비디오는 Server Component에서 소스 URL을 가져와 iframe을 렌더링하고, React Suspense로 스트리밍해 페이지 전체를 차단하지 않고 로딩 상태를 보여줄 수 있다.
- Self-hosting은 완전한 제어와 커스터마이즈가 가능한 대신 스토리지·대역폭 비용이 따르며, Vercel Blob 같은 스토리지 솔루션으로 비디오와 자막 파일을 함께 호스팅할 수 있다.
- next-video, Cloudinary, Mux, Fastly, ImageKit 등 서드파티 서비스를 활용하면 비디오 최적화와 통합을 더 쉽게 처리할 수 있다.
