'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'

const base = '/zone/baseline/file-conventions/default/hard-reload-restore'

export function VerificationFooter() {
  const pathname = usePathname()
  const previous = useRef(pathname)
  const [soft, setSoft] = useState(false)
  const [screens, setScreens] = useState<Record<string, string>>({})

  useEffect(
    function observeSlots() {
      if (previous.current !== pathname) setSoft(true)
      previous.current = pathname
      const root = document.getElementById('hard-reload-observation')
      if (!root) return
      function read() {
        setScreens(
          Object.fromEntries(
            Array.from(root!.querySelectorAll<HTMLElement>('[data-slot]')).map((el) => [
              el.dataset.slot!,
              el.dataset.screen!,
            ]),
          ),
        )
      }
      read()
      const observer = new MutationObserver(read)
      observer.observe(root, { childList: true, subtree: true, attributes: true })
      return () => observer.disconnect()
    },
    [pathname],
  )

  const onDetail = pathname === `${base}/preview-detail`
  // 하드 리로드(soft=false)로 상세 URL에 도착했을 때만 children이 default.tsx로 복구된다.
  // 소프트 내비게이션(soft=true)으로 이동했을 때는 children이 이전 화면(home)을 유지한다.
  const expectedChildren = onDetail && !soft ? 'default' : 'home'
  const expectedPreview = onDetail ? 'detail' : 'home'
  const loaded = Object.keys(screens).length === 2
  const isMatched = loaded
    ? screens.children === expectedChildren && screens.preview === expectedPreview
    : undefined

  return (
    <>
      <ExpectedActualPanel
        title="children 슬롯 vs preview 슬롯 실제 화면 대조"
        expected={
          <span>{`children: ${expectedChildren}\npreview: ${expectedPreview}`}</span>
        }
        actual={
          loaded ? (
            <span className="break-all">
              {`경로: ${pathname}\n탐색 방식: ${soft ? '소프트 내비게이션(Link)' : '하드 리로드/최초 로드'}\nchildren: ${screens.children}\npreview: ${screens.preview}`}
            </span>
          ) : (
            <span>화면을 읽는 중이다.</span>
          )
        }
        isMatched={isMatched}
        description="data-slot / data-screen 값을 실제 DOM에서 읽어 대조한다. 이 라우트를 벗어나면(다른 데모로 이동) 값이 초기화된다."
      />
      <DemoDeepDiveCard title="같은 URL, 다른 결과 — default.tsx가 필요한 이유">
        <div>
          <h5 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">1. 핵심 메커니즘</h5>
          <p>
            이 세그먼트의 <code>layout.tsx</code>는 <code>children</code>(암시적 슬롯)과 <code>preview</code>(
            <code>@preview</code> 폴더, 명명된 슬롯) 두 개를 동시에 전달받는다. <code>@</code>로 시작하는 폴더 이름은
            URL 경로에 나타나지 않는다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">2. 소프트 내비게이션 vs 하드 리로드</h5>
          <p>
            <code>&lt;Link href=&quot;{base}/preview-detail&quot;&gt;</code>로 이동하면 라우터는 <code>preview</code> 슬롯의
            활성 상태를 <code>preview-detail/page.tsx</code>로 갱신하면서, 그 URL에 대응하는 페이지가 없는{' '}
            <code>children</code> 슬롯은 직전에 렌더링해 둔 상태(home)를 클라이언트 메모리에서 그대로 유지한다.
            브라우저 새로고침은 이 메모리를 지우므로, 서버는 <code>children</code>에 대해 다시 <code>/preview-detail</code>과
            일치하는 페이지를 찾다가 없으면 <code>default.tsx</code>를 렌더링한다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">3. 실무 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              병렬 라우트를 쓰는 모든 세그먼트는 명명된 슬롯뿐 아니라 <code>children</code>에도 각자의{' '}
              <code>default.tsx</code>가 필요하다. 없으면 그 슬롯 경로는 새로고침 시 404가 된다.
            </li>
            <li>
              이전의 404 동작을 유지하고 싶다면 <code>default.tsx</code>에서 <code>notFound()</code>를 호출하면 된다.
            </li>
          </ul>
        </div>
      </DemoDeepDiveCard>
    </>
  )
}
