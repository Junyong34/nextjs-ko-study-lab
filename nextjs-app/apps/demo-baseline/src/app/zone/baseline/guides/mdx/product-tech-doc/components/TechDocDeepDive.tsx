import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function TechDocDeepDive() {
  return (
    <DemoDeepDiveCard title="@next/mdx가 .mdx를 React 컴포넌트로 바꾸는 과정">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            <code>content/spec.mdx</code>를 <code>page.tsx</code>에서 <code>import</code>하자 컴포넌트처럼 렌더됐고, <code>#</code>·<code>-</code>·<code>1.</code>·<code>&gt;</code>·백틱·<code>[]()</code>가 각각 <code>h1</code>·<code>ul</code>·<code>ol</code>·<code>blockquote</code>·<code>code</code>·<code>a</code> 요소가 됐습니다.
            같은 파일을 <code>spec-sheet/page.mdx</code>가 import하면 MDX 파일 자체가 라우트가 되고, 그 파일의 <code>export const metadata</code>가 <code>&lt;title&gt;</code>로 들어갑니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 설정 세 가지</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li><code>next.config.ts</code>: <code>createMDX()</code>로 감싸고 <code>pageExtensions</code>에 <code>md</code>·<code>mdx</code>를 넣어야 <code>page.mdx</code>가 라우트로 인식됩니다.</li>
            <li><code>src/mdx-components.tsx</code>: App Router에서 <code>@next/mdx</code>를 쓰려면 필수입니다. 이 zone에서는 h1·h2·p·a·code에 class만 더하는 전역 매핑이 들어 있어 태그 종류는 그대로입니다.</li>
            <li>frontmatter는 기본 지원이 없어 <code>export const specMeta</code>처럼 JS export로 대신합니다. <code>@types/mdx</code>는 default export만 선언하므로 named export는 타입을 직접 알려 줘야 합니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. 이 실습의 한계 — 표가 안 되는 이유</h5>
          <p>
            MDX 기본 문법은 CommonMark라서 파이프 표·취소선·자동 링크 같은 GFM 확장이 없습니다. 표가 필요하면 <code>remark-gfm</code>을 <code>createMDX({'{'} options: {'{'} remarkPlugins: [&apos;remark-gfm&apos;] {'}'} {'}'})</code>에 넣어야 하는데,
            Turbopack에서는 플러그인을 문자열 이름과 직렬화 가능한 옵션으로만 넘길 수 있습니다. 이 프로젝트는 플러그인을 설치하지 않았으므로 JSX <code>&lt;table&gt;</code>로 대신했습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 주의할 점</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li>pageExtensions에 md·mdx를 넣으면 app 안의 모든 <code>.mdx</code> 파일이 라우트 후보가 됩니다. 콘텐츠 파일은 <code>page.mdx</code>가 아닌 이름으로 두세요.</li>
            <li>MDX 안의 <code>{'{'}</code>, <code>&lt;</code>는 JS·JSX로 해석됩니다. 글자 그대로 쓰려면 백틱이나 이스케이프가 필요합니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
