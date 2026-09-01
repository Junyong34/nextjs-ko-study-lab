'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• 컴포넌트 내부 인라인 'use server' 클로저 액션의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="컴포넌트 내부 인라인 'use server' 클로저 액션 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="컴포넌트 내부 인라인 'use server' 클로저 액션 & 스코프 바인딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Server Component 함수 본문 내부에서 비동기 함수 첫 줄에 <code>'use server'</code>를 선언하면, 상위 서버 컴포넌트 스코프의 변수(예: <code>item.id</code>)를 클로저(Closure)로 캡처하여 <code>{'<'}form action={'{'}...{'}'}{'>'}</code>에 바인딩할 수 있는 인라인 Server Action이 생성됩니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 컴포넌트 목록 매핑 중 각 상품 아이템의 <code>productId</code>를 클로저로 캡처하는 인라인 <code>async function deleteItem() {'{'} 'use server'; await db.delete(productId); {'}'}</code>를 선언하고, 삭제 폼 버튼의 action으로 바인딩하여 안전하게 실행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>히든 인풋(hidden input) 제거</strong>: <code>{'<'}input type="hidden" name="id" value={'{'}item.id{'}'} /{'>'}</code> 없이도 클로저 암호화 바인딩을 통해 안전하게 파라미터를 전달합니다.</li>
              <li><strong>클로저 데이터 자동 암호화</strong>: Next.js가 캡처된 스코프 변수를 암호화된 토큰 형태로 전송하여 클라이언트의 값 위변조를 방지합니다.</li>
              <li><strong>코드 응집도 향상</strong>: 서버 컴포넌트의 렌더링 로직과 해당 데이터의 변경 액션을 단일 위치에 밀접하게 작성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록 각 행(Row)의 단일 상품 삭제/품절 처리 버튼</li>
              <li>댓글 목록의 개별 댓글 좋아요 토글 및 신고 액션</li>
              <li>주문 상세 화면의 개별 품목 반품 신청 액션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Client Component 내부 인라인 선언 불가</strong>: 인라인 <code>'use server'</code>는 반드시 Server Component 내부에서만 선언할 수 있으며, Client Component에서는 파일 레벨 액션을 임포트해야 합니다.</li>
              <li><strong>암호화 오버헤드 고려</strong>: 너무 큰 객체를 클로저로 캡처하면 암호화 페이로드 크기가 커지므로 ID 등 필수 식별자만 캡처하거나 <code>.bind()</code>를 활용하는 것이 좋습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
