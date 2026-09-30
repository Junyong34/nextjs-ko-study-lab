'use client'
import React, { useEffect, useState } from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { ROLE_COOKIE, toRole, type Role } from '../roleCookie'
import { MEASURE_EVENT } from '../measure'
import { ConceptSummary } from './ConceptSummary'

interface Measured { cookie: string | undefined; expected: Role; rendered: string | undefined }

function readCookie() {
  const hit = document.cookie.split('; ').find(c => c.startsWith(`${ROLE_COOKIE}=`))
  return hit?.slice(ROLE_COOKIE.length + 1)
}

export function VerificationFooter() {
  const [m, setM] = useState<Measured | null>(null)

  useEffect(function observeSlot() {
    let started = false
    const read = () => {
      const root = document.getElementById('slot-observation')
      const cookie = readCookie()
      setM({ cookie, expected: toRole(cookie), rendered: root?.querySelector<HTMLElement>('[data-slot]')?.dataset.slot })
    }
    const onMeasure = () => { started = true; read() }
    const observer = new MutationObserver(() => { if (started) read() })
    // 슬롯 교체 시 컨테이너 요소가 다시 만들어질 수 있어 body 전체를 관찰한다.
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener(MEASURE_EVENT, onMeasure)
    return () => { observer.disconnect(); window.removeEventListener(MEASURE_EVENT, onMeasure) }
  }, [])

  const matched = m ? m.rendered === m.expected : undefined
  const expected = m ? `쿠키 ${ROLE_COOKIE}=${m.cookie ?? '(없음)'} → @${m.expected} 슬롯` : `쿠키를 읽어 @admin 또는 @user 중 하나가 그려져야 합니다.`
  const actual = !m
    ? '상호작용 대기 중입니다. 위의 역할 버튼을 눌러 주세요.'
    : `화면에 그려진 슬롯(DOM data-slot): ${m.rendered ? `@${m.rendered}` : '(없음)'}${matched ? '' : '\n쿠키와 화면이 다릅니다. 서버가 아직 새 쿠키로 layout을 다시 그리지 않았습니다. 새로고침하면 맞춰집니다.'}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="쿠키의 역할과 화면에 그려진 슬롯 대조"
        expected={<span className="whitespace-pre-line">{expected}</span>}
        actual={<span className="whitespace-pre-line">{actual}</span>}
        isMatched={matched}
        description="기대값은 브라우저 쿠키에서, 실제값은 서버가 그려 준 화면의 슬롯 요소에서 읽습니다."
      />
      <ConceptSummary />
    </div>
  )
}
