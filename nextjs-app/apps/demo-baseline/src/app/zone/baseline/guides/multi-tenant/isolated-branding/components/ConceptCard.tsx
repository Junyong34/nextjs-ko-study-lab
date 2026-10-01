import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="테넌트별 브랜딩 주입과 격리">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 흐름</h5>
          <p>
            URL 의 <code>[tenant]</code> 세그먼트가 테넌트를 정합니다. <code>[tenant]/layout.tsx</code> 는 <code>await params</code> 로 값을 받아
            설정을 조회하고, 래퍼 요소의 <code>style</code> 에 <code>--brand-primary</code>·<code>--brand-accent</code> 를 넣습니다.
            하위 서버 컴포넌트와 인라인 SVG 로고는 색을 하드코딩하지 않고 <code>var(--brand-primary)</code> 만 참조하므로, 같은 컴포넌트가 테넌트마다 다른 색으로 렌더링됩니다.
            같은 설정이 <code>generateMetadata</code> 로도 흘러 <code>document.title</code> 이 테넌트별로 달라집니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 격리는 어디서 보장되는가</h5>
          <p>
            변수가 <strong>래퍼 요소의 스타일</strong>에 걸려 있어 그 하위에서만 유효합니다. 요청마다 자기 <code>params</code> 로 설정을 조회하므로 한 요청이 다른 테넌트 값을 읽을 경로가 없습니다.
            <code>&lt;html&gt;</code>·<code>:root</code> 에 변수를 걸면 한 문서 안에서 테넌트가 섞일 때 충돌하므로, 테넌트 단위 문서라면 괜찮지만 이 데모처럼 한 화면에서 비교할 때는 래퍼가 안전합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 주의사항</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>이 데모는 경로 세그먼트로 테넌트를 식별합니다. 쿠키·헤더·서브도메인으로 식별하면 <code>cookies()</code>·<code>headers()</code> 를 읽는 순간 동적 렌더링이 되어 정적 프리렌더링과 CDN 캐시를 잃습니다.</li>
            <li><code>generateStaticParams</code> 로 등록 테넌트를 미리 만들어도, 목록 밖 값은 요청 시 렌더링되어 <code>notFound()</code> 로 404 가 됩니다. 검사를 빼면 임의 경로가 빈 테넌트로 열립니다.</li>
            <li>데모 앱은 <code>public/</code> 을 둘 수 없어 로고를 인라인 SVG 로 만들었습니다. 실제 서비스에서는 테넌트별 로고 URL 을 설정에 담는 편이 일반적입니다.</li>
            <li>격리 검증은 테넌트 영역 안의 HTML 만 대상으로 합니다. 이 데모의 내비게이션은 모든 테넌트 링크를 가지므로 영역 밖까지 검사하면 항상 실패합니다.</li>
            <li>테넌트 설정에 비밀 값이 섞이지 않게 합니다. 서버 컴포넌트가 읽은 값이 props 로 클라이언트에 내려가면 모든 방문자에게 노출됩니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
