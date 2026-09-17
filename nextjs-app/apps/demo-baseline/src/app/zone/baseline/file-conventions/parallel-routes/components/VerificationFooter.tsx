'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
export function VerificationFooter() {
  const pathname = usePathname()
  const analytics = useSelectedLayoutSegment('analytics')
  const team = useSelectedLayoutSegment('team')
  const previous = useRef(pathname)
  const [soft, setSoft] = useState(false)
  const [screens, setScreens] = useState<Record<string, string>>({})
  useEffect(function observeSlots() {
    if (previous.current !== pathname) setSoft(true)
    previous.current = pathname
    const root = document.getElementById('parallel-observation')
    if (!root) return
    function read() {
      setScreens(Object.fromEntries(Array.from(root!.querySelectorAll<HTMLElement>('[data-slot]')).map(el => [el.dataset.slot!, el.dataset.screen!])))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { childList: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [pathname])
  const details = pathname.endsWith('/details')
  const expectedOther = details && !soft ? 'default' : 'home'
  const expectedAnalytics = details ? 'details' : 'home'
  const loaded = Object.keys(screens).length === 3
  return <>
    <ExpectedActualPanel title="실제 슬롯 화면 확인" expected={<span>{`analytics: ${expectedAnalytics}\nteam: ${expectedOther}\nchildren: ${expectedOther}`}</span>}
      actual={<span className="break-all">{loaded ? `실습 내부 경로: ${pathname}\nanalytics: ${screens.analytics}\nteam: ${screens.team}\nchildren: ${screens.children}\n선택된 세그먼트: analytics=${analytics ?? '(루트)'}, team=${team ?? '(루트)'}` : '화면을 읽는 중입니다.'}</span>}
      isMatched={loaded ? screens.analytics === expectedAnalytics && screens.team === expectedOther && screens.children === expectedOther : undefined}
      description="화면의 식별값을 실제 DOM에서 읽습니다. 메모 유지 여부는 운영팀 입력에서 직접 확인하세요." />
    <DemoDeepDiveCard title="같은 경로에서도 새로고침 결과가 다른 이유">
      <p>layout.tsx는 children, analytics, team을 각각 전달받습니다. @로 시작하는 폴더 이름은 URL에 나타나지 않습니다.</p>
      <p>Link 이동은 일치하지 않는 슬롯의 이전 화면을 유지합니다. 전체 새로고침에는 그 기록이 없어 default.tsx를 표시합니다. children도 기본 화면이 필요한 슬롯입니다.</p>
      <p>이 예제는 화면 조합과 이동 방식을 비교합니다. 슬롯별 로딩이나 오류 격리는 여기서 검증하지 않습니다.</p>
    </DemoDeepDiveCard>
  </>
}
