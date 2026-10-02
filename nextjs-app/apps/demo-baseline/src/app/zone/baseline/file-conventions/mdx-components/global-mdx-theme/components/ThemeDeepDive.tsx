import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ThemeDeepDive() {
  return (
    <DemoDeepDiveCard title="mdx-components.tsx — App Router MDX의 전역 컴포넌트 레지스트리">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            같은 <code>sample.mdx</code>가 오른쪽에서는 <code>src/mdx-components.tsx</code>의 매핑을 거쳐 <code>mdx-g</code> class와 기본 타이포를 받았고, 왼쪽은 <code>components</code> prop으로 같은 키를 문자열 태그(<code>&apos;h1&apos;</code> 등)로 덮어써 기본 요소로 렌더됐습니다.
            두 영역 모두 태그 종류는 같았습니다. 강조색은 래퍼에 <code>data-mdx-theme</code>가 있을 때만 켜졌습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 파일 규칙</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li>위치: 프로젝트 루트, <code>src</code>를 쓰면 <code>src/mdx-components.tsx</code> (app과 같은 수준). App Router에서 <code>@next/mdx</code>를 쓰려면 필수입니다.</li>
            <li>export: 인자 없는 <code>useMDXComponents()</code> 하나. 돌려준 객체가 모든 MDX의 기본 매핑이 됩니다.</li>
            <li>우선순위: 개별 렌더의 <code>components</code> prop이 전역 매핑과 병합되고, 같은 키는 prop이 이깁니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. 영향 범위 — 이 zone의 모든 MDX가 받는다</h5>
          <p>
            이 파일을 고치면 <code>guides/mdx/product-tech-doc</code>와 <code>guides/mdx/custom-component-slot</code>의 MDX도 같이 바뀝니다. 그래서 이 zone의 전역 매핑은
            h1·h2·p·a·code에 class만 더하고 태그는 바꾸지 않습니다(다른 데모가 태그 개수를 셉니다). 데모 고유의 대비는 <code>[[data-mdx-theme=store]_&amp;]</code> 변형으로 래퍼 안에만 가뒀습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 주의할 점</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li>매핑 함수는 서버 컴포넌트로 실행됩니다. 상태나 이벤트가 필요한 요소만 별도 <code>&apos;use client&apos;</code> 컴포넌트로 분리하세요.</li>
            <li>공식 예시처럼 <code>img</code>를 <code>next/image</code>로 바꾸면 전역적으로 이미지 동작이 달라집니다. 전역 매핑은 작게 유지하고 데모·페이지별 차이는 <code>components</code> prop으로 줍니다.</li>
            <li>Tailwind는 소스의 class 문자열을 찾아 CSS를 만들기 때문에, 매핑의 class를 문자열 조립으로 만들면 스타일이 생성되지 않습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
