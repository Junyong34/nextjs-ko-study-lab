import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function SlotDeepDive() {
  return (
    <DemoDeepDiveCard title="MDX 안의 JSX·props·컴포넌트 매핑과 서버/클라이언트 경계">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            <code>guide.mdx</code>는 서버 컴포넌트인 <code>page.tsx</code>가 렌더하므로 MDX 본문의 JS 표현식은 서버에서 실행됐습니다(<code>server</code>). 문서 안에서 import한 <code>AddToCartButton</code>은 <code>&apos;use client&apos;</code> 파일이라
            경계가 되어 브라우저에서 하이드레이션됐고, 그 코드만 JS 파일에서 발견됐습니다. 문서 문구는 HTML·RSC 페이로드로만 왔습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. MDX 안에서 쓸 수 있는 것</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li><code>import</code>/<code>export</code>: 컴포넌트를 가져오고 <code>export const product</code>처럼 값을 내보냅니다.</li>
            <li><code>{'{표현식}'}</code>: <code>product.price.toLocaleString()</code>처럼 아무 JS 식이나 씁니다.</li>
            <li><code>props</code>: <code>&lt;Guide cartCount={'{n}'} /&gt;</code>로 넘긴 값을 본문에서 <code>props.cartCount</code>로 읽습니다. 버튼이 <code>router.refresh()</code>하면 서버가 쿠키를 다시 읽어 새 값으로 MDX를 렌더합니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. components prop — 지역 매핑</h5>
          <p>
            <code>&lt;Guide components={'{{ h2, Callout }}'} /&gt;</code>는 전역 <code>mdx-components.tsx</code>와 병합되며 같은 키는 지역이 이깁니다. 그래서 h2에는 전역 class가 없고, 지역에 없는 p에는 전역 class가 그대로 붙었습니다.
            <code>Callout</code>처럼 MDX가 import 없이 이름만 쓰는 컴포넌트를 주입할 수도 있는데, 넘기지 않으면 렌더 시 &quot;Expected component Callout to be defined&quot; 에러가 납니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 주의할 점</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li>MDX 파일에 <code>&apos;use client&apos;</code>를 붙일 수 없습니다. 상호작용은 별도 클라이언트 컴포넌트로 분리해 import하세요.</li>
            <li>클라이언트 컴포넌트에 넘기는 props는 직렬화 가능해야 합니다. 함수(이벤트 핸들러)는 버튼 안에서 정의합니다.</li>
            <li>dev 서버의 JS 파일은 프로덕션 빌드와 나뉘는 방식이 다릅니다. 이 측정은 &quot;문서 문구가 JS에 없다&quot;는 경계만 확인합니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
