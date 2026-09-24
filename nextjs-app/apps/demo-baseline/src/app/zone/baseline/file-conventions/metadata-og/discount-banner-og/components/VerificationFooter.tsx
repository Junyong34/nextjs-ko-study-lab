'use client'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { evaluateChannel, expectsRegeneration } from '../evaluate'
import { OG_IMAGE, TWITTER_IMAGE } from '../image-config'
import type { Inspection, MetaTagRow } from '../types'

const isDev = process.env.NODE_ENV === 'development'
const mode = isDev ? 'next dev' : 'next build + start'

function Lines({ lines }: { lines: string[] }) {
  return <div className="whitespace-pre-wrap">{lines.join('\n')}</div>
}

export function VerificationFooter({
  htmlMeta,
  probes,
  hasRun,
}: {
  htmlMeta: MetaTagRow[]
  probes: Inspection['probes']
  hasRun: boolean
}) {
  const og = hasRun ? evaluateChannel('og', probes.og, htmlMeta, isDev) : null
  const tw = hasRun ? evaluateChannel('twitter', probes.twitter, htmlMeta, isDev) : null
  const regen = (b: boolean) => (b ? '요청마다 재생성' : '빌드 결과 재사용')

  const expected = (
    <Lines
      lines={[
        `실행 모드: ${mode}`,
        `• og:image → .../opengraph-image?<hash>, width ${OG_IMAGE.size.width}, height ${OG_IMAGE.size.height}, type ${OG_IMAGE.contentType}, alt 주입`,
        `• twitter:image → .../twitter-image?<hash>, ${TWITTER_IMAGE.size.width}x${TWITTER_IMAGE.size.height}, alt 주입`,
        '• 두 이미지 모두 200 · image/png, 이미지 속 할인율 = 생성 시각 기준 원본 할인율',
        `• og (connection()): ${regen(expectsRegeneration('og', isDev))}`,
        `• twitter (정적): ${regen(expectsRegeneration('twitter', isDev))}`,
      ]}
    />
  )

  const actual = !hasRun ? (
    <Lines lines={['• 대기 중 (상단 버튼으로 HTML 파싱과 이미지 요청을 실행하세요)']} />
  ) : (
    <Lines lines={['[og:image]', ...(og?.lines ?? []), '', '[twitter:image]', ...(tw?.lines ?? [])]} />
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="head 메타 태그 주입 + 이미지 생성 시점 실측"
        expected={expected}
        actual={actual}
        isMatched={og && tw ? og.isMatched && tw.isMatched : undefined}
        description="이 페이지 HTML 원문의 <head>를 파싱해 파일 기반 이미지 메타 태그를 확인하고, 그 URL을 실제로 두 번씩 요청해 응답 헤더(x-demo-generated-at, x-demo-discount-rate)와 데이터 원본(discount-source 라우트)을 대조합니다."
      />
      <DemoDeepDiveCard title="opengraph-image / twitter-image와 ImageResponse">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 파일 하나 = 이미지 라우트 + head 태그</h5>
            <p>
              세그먼트에 <code>opengraph-image.tsx</code>를 두면 Next.js는 이를 특수 Route Handler(<code>/…/opengraph-image?&lt;hash&gt;</code>)로
              등록하고, 같은 세그먼트 페이지의 <code>&lt;head&gt;</code>에 <code>og:image</code>와 <code>alt</code>·<code>size</code>·<code>contentType</code>
              export에서 나온 <code>og:image:alt/width/height/type</code>을 자동으로 넣습니다. <code>twitter-image.tsx</code>는 <code>twitter:image*</code>를 만듭니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 생성 시점은 파일 안의 데이터 접근 방식이 정한다</h5>
            <p>
              공식 문서: 생성 이미지는 Request-time API나 캐시되지 않는 데이터를 쓰지 않으면 기본적으로 빌드 시 정적 최적화됩니다.
              이 데모의 <code>opengraph-image.tsx</code>는 <code>await connection()</code> 뒤에 할인율을 읽어 요청마다 새 PNG를 만들고,
              <code>twitter-image.tsx</code>는 같은 데이터를 그냥 읽기만 해서 <code>next build</code> 시점의 할인율이 PNG에 고정됩니다.
              <code>next dev</code>는 두 파일 모두 요청마다 다시 실행하므로 정적/동적 차이는 프로덕션 빌드에서만 보입니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 주의: 같은 세그먼트의 metadata.openGraph.images</h5>
            <p>
              <code>generateMetadata</code> 문서는 &quot;파일 기반 메타데이터가 우선한다&quot;고 하지만, Next.js 16.3.2의 병합 로직(<code>mergeStaticMetadata</code>)은
              <strong>같은 세그먼트</strong>의 <code>metadata.openGraph</code>/<code>twitter</code>에 <code>images</code> 키가 있으면 파일 기반 이미지를 적용하지 않습니다.
              이 페이지는 공용 <code>getDemoMetadata()</code> 결과에서 <code>images</code>만 제거해 파일 기반 이미지가 주입되게 했습니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. metadataBase와 절대 URL</h5>
            <p>
              OG 이미지 URL은 절대 URL이어야 합니다. 파일 기반 이미지의 경우 Next.js 16.3.2는 <code>next dev</code>에서{' '}
              <code>http://localhost:&lt;PORT&gt;</code>를, 프로덕션에서는 루트 layout의 <code>metadataBase</code>(Vercel Preview 배포에서는 Preview URL)를
              앞에 붙입니다(<code>getSocialImageMetadataBaseFallback</code>). 그래서 프로덕션 빌드를 로컬에서 띄워도 태그에는 배포 도메인이 찍히며,
              이 데모는 같은 라우트를 실측하려고 태그 URL에서 경로와 쿼리(<code>?&lt;hash&gt;</code>)만 떼어 현재 서버에 요청합니다.
              <code>metadataBase</code> 없이 프로덕션 빌드하면 대체 URL을 쓴다는 경고가 출력됩니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. ImageResponse 제약</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>flexbox와 CSS 일부만 지원합니다(<code>display: grid</code> 불가). 자식이 여럿인 요소에는 <code>display: flex</code>가 필요합니다.</li>
              <li>폰트는 ttf/otf/woff만 지원합니다. 기본 폰트에 없는 한글 글리프는 런타임에 외부에서 내려받아야 하므로 이미지 안 텍스트는 영문·숫자로 두었습니다.</li>
              <li><code>headers</code> 옵션으로 응답 헤더를 붙일 수 있어, 생성 시각과 할인율을 헤더로도 내보내 실측에 사용합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
