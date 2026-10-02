'use client'
import type { ReactNode } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { BundleMarkers } from '../types'
import { useSlotProbe } from '../hooks/useSlotProbe'
import { VerificationFooter } from './VerificationFooter'

const btn =
  'cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'

export function SlotLab({ markers, children }: { markers: BundleMarkers; children: ReactNode }) {
  const s = useSlotProbe(markers)
  const m = s.measurement
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="MDX 문서 안에 클라이언트 장바구니 버튼 넣기"
        concept="MDX 문서는 서버 컴포넌트로 렌더되고, 그 안에서 import한 'use client' 버튼만 브라우저에서 동작한다. 문서 본문은 HTML로만 오고, 버튼 코드만 JS 번들에 실린다."
        steps={[
          { step: 1, title: '문서 안 버튼으로 장바구니 담기', description: '[+]/[−]로 수량을 고르고 [장바구니 담기]를 누릅니다. 버튼이 api/cart에 POST한 뒤 router.refresh()로 서버 렌더를 다시 요청합니다.', actionBadge: '클릭', observe: 'POST 상태와 "장바구니 수량" 줄의 숫자', observeAt: 'playground' },
          { step: 2, title: '[경계 측정]', description: 'MDX 본문이 실행된 곳, 버튼 하이드레이션, 지역 매핑(h2·Callout), 그리고 이 페이지가 받은 JS 파일에 문서 문구와 버튼 코드가 들어 있는지 셉니다.', actionBadge: '측정', observe: '측정 결과 표', observeAt: 'playground' },
          { step: 3, title: '검증 패널 확인', description: '수량을 담은 뒤 측정해야 통과합니다. 담기 직후 측정이 refresh보다 빠르면 다시 측정합니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="content/guide.mdx (서버) + components/AddToCartButton.tsx ('use client')">
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2 border-b pb-3 dark:border-zinc-800">
            <button type="button" onClick={s.measure} disabled={s.isPending} className={btn}>
              {s.isPending ? '측정 중...' : '경계 측정'}
            </button>
            <DemoResetButton onReset={s.reset} label="장바구니 비우기 (DELETE)" />
          </div>
          <div ref={s.docRef} className="rounded border border-zinc-200 bg-white p-4 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
          <div className="space-y-1 rounded bg-zinc-950 p-3 font-mono text-xs text-zinc-300">
            {m ? (
              <>
                <div>측정 {m.measuredAt} · MDX 본문 실행 위치 <b className="text-emerald-400">{m.mdxEnv}</b> · 버튼 하이드레이션 {m.buttonHydrated ? '완료' : '안 됨'}</div>
                <div>장바구니: GET api/cart {m.serverCartCount}개 / MDX가 props로 렌더한 값 {m.domCartCount ?? '-'}개</div>
                <div>h2 {m.h2Total}개 중 지역 매핑 {m.h2Local}개, 전역 class(mdx-g-h2) {m.h2Global}개 · 전역 class가 붙은 p {m.pGlobal}개 · Callout {m.calloutCount}개</div>
                <div>JS 파일 {m.scriptsScanned}개 조사 → 버튼 문자열 포함 <b className="text-sky-400">{m.buttonMarkerHits}</b>개, 문서 문구 포함 <b className="text-amber-400">{m.proseMarkerHits}</b>개</div>
              </>
            ) : (
              <div className="text-zinc-500">[경계 측정] 전입니다.</div>
            )}
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter m={m} />
    </DemoContainer>
  )
}
