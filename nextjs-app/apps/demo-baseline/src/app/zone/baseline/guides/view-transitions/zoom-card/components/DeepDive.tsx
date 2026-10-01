import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function DeepDive() {
  return (
    <DemoDeepDiveCard title="React ViewTransition과 라우트 전환의 공유 요소 morph">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 동작 원리</h5>
          <p>
            Next.js의 라우트 이동은 React transition이므로 <code>&lt;ViewTransition&gt;</code>이 자동으로 활성화됩니다. 목록 썸네일과 상세 hero가 같은 <code>name</code>을 가지면
            React가 <code>document.startViewTransition</code>을 호출하고, 브라우저가 <code>::view-transition-old/new(name)</code>을 만들어 크기·위치를 보간합니다. 별도 설정은 필요 없습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 파일 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2 text-[11px] dark:bg-zinc-900">{`zoom-card/layout.tsx       ← 전환 계측 (persist, 여기서는 enter/exit 안 일어남)
├─ page.tsx                ← 목록: <Link transitionTypes={['zoom-in']}> + <PhotoArt>
└─ [id]/page.tsx           ← 상세: <PhotoArt> (같은 name) + loading.tsx 없음
components/PhotoArt.tsx    ← <ViewTransition name share default="none">`}</pre>
        </div>
        <div>
          <h5 className={h}>3. 주의사항</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li><code>name</code>은 동시에 렌더링되는 전환마다 고유해야 합니다. 이 데모는 <code>zoom-card-&#123;id&#125;</code>를 씁니다.</li>
            <li>목적지가 Suspense fallback으로 먼저 커밋되면 쌍이 만들어지지 않고 enter 애니메이션만 재생됩니다. 그래서 상세에는 <code>loading.tsx</code>를 두지 않았습니다.</li>
            <li><code>default=&quot;none&quot;</code>을 쓰면 <code>share</code>를 함께 지정해야 morph가 유지됩니다.</li>
            <li>미지원 브라우저에서는 애니메이션 없이 정상 이동합니다. <code>prefers-reduced-motion</code>이면 이 데모는 그룹 애니메이션 시간을 사실상 0으로 줄입니다.</li>
            <li>브라우저 뒤로가기도 같은 name이 있으면 morph되지만 <code>transitionTypes</code>는 전달되지 않습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
