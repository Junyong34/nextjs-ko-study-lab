import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const CODE =
  'overflow-x-auto rounded bg-zinc-900 p-2.5 font-mono text-[11px] leading-relaxed text-zinc-200 dark:bg-zinc-950'

export function StrategyDeepDive() {
  return (
    <DemoDeepDiveCard title="대량 링크의 prefetch 비용과 전략 선택">
      <div className="space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. 비용은 &quot;화면에 보인 링크 수&quot;에 비례한다</h5>
          <p>
            production에서 <code>{'<Link>'}</code>는 뷰포트에 들어오는 순간 목적지 라우트를 prefetch합니다. Next.js가
            작업 큐로 순서를 조절하지만(뷰포트 → hover/touch 의도 → 새 링크 우선 → 화면 밖으로 나간 링크는 폐기), 카탈로그를
            끝까지 스크롤하면 결국 링크마다 요청이 하나씩 쌓입니다. 이 데모의 목적지 <code>item/[mode]/[sku]</code>는
            <code> connection()</code>으로 고정한 동적 라우트라서, 기본값은 <code>loading.tsx</code> 경계까지만 가져오고
            <code> prefetch={'{'}true{'}'}</code>는 page까지 서버에서 렌더링합니다. 목적지가 정적 라우트였다면 기본값도
            전체 페이지를 가져가므로 두 전략의 바이트 차이가 사라집니다.
          </p>
        </div>

        <div>
          <h5 className={H}>2. 서버 비용은 요청 수와 별개로 봐야 한다</h5>
          <p>
            표의 &quot;서버 layout / page&quot; 열은 목적지 파일이 실제로 실행된 횟수입니다. 기본값도 loading 경계 바깥의
            <code> layout.tsx</code>는 링크마다 실행하므로, prefetch 중에도 layout·page의 부수 효과(분석 이벤트 기록 등)가
            실행된다는 공식 가이드 Troubleshooting 항목을 그대로 확인할 수 있습니다. 부수 효과는 <code>useEffect</code>나
            Server Action으로 옮겨야 합니다.
          </p>
        </div>

        <div>
          <h5 className={H}>3. 공식 가이드의 hover 기반 prefetch</h5>
          <pre className={CODE}>{`<Link
  href={href}
  prefetch={active ? null : false}
  onMouseEnter={() => setActive(true)}
>`}</pre>
          <p className="mt-1.5">
            처음에는 <code>prefetch={'{'}false{'}'}</code>로 뷰포트 prefetch를 막고, 마우스를 올린 링크만{' '}
            <code>null</code>(기본 동작)로 되돌립니다. 스크롤만 하면 0건, hover한 링크 수만큼만 요청이 생깁니다. 이 패턴은 <code>onMouseEnter</code>만 의도 신호로
            쓰므로, 마우스 hover가 없는 입력 방식에서는 클릭 전에 prefetch가 거의 일어나지 않을 수 있습니다.
          </p>
        </div>

        <div>
          <h5 className={H}>4. prefetch={'{'}false{'}'}의 대가</h5>
          <p>
            요청은 0건이지만, 공식 가이드 설명대로 정적 라우트는 클릭해야 받아오고 동적 라우트는 서버 렌더가 끝날 때까지
            이동을 기다립니다. 무한 스크롤 테이블·푸터처럼 클릭 확률이 낮은 링크에 쓰고, 주요 CTA에는 기본값을 유지합니다.
          </p>
        </div>

        <div>
          <h5 className={H}>5. Partial Prefetching이 바꾸는 상한 (이 zone에서는 비활성)</h5>
          <p>
            <code>cacheComponents</code>와 <code>partialPrefetching</code>을 켜면 기본 <code>{'<Link>'}</code>는 라우트마다
            App Shell 하나를 공유해 prefetch하므로 비용 상한이 &quot;보이는 링크 수&quot;가 아니라 &quot;라우트 수&quot;가
            됩니다. 반대로 그 환경의 <code>prefetch={'{'}true{'}'}</code>는 링크마다 서버 호출이 생기므로 URL 데이터가
            필요하고 클릭 가치가 큰 링크에만 씁니다. 이 데모가 속한 baseline zone은 Cache Components를 켜지 않아 위 표의
            수치는 &quot;링크마다 1요청&quot; 모델의 실측값입니다.
          </p>
        </div>

        <div>
          <h5 className={H}>6. 측정값을 읽을 때 주의할 점</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <code>next dev</code>에서는 뷰포트 prefetch가 실행되지 않아 모든 전략이 0건입니다. <code>next build</code> 후{' '}
              <code>next start</code>로 확인하세요.
            </li>
            <li>
              <code>transferSize</code>는 헤더를 포함한 전송 바이트, <code>encodedBodySize</code>는 압축된 본문 크기입니다.
              브라우저 캐시에서 응답하면 0으로 기록됩니다.
            </li>
            <li>
              서버 카운터는 서버 프로세스 메모리 값입니다. 여러 인스턴스로 요청이 나뉘는 서버리스 배포에서는 인스턴스마다 따로
              셉니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
