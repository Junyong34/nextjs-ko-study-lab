'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected: React.ReactNode
  actual?: React.ReactNode
}

export function VerificationFooter({ isMatched, expected, actual }: VerificationFooterProps) {
  const actualContent = actual ?? '• 상호작용 대기 중 (상단 실습 화면에서 원클릭 즉시 구매를 실행해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="컴포넌트 내부 인라인 'use server' 클로저 액션 검증 결과"
        expected={expected}
        actual={actualContent}
        isMatched={isMatched}
        description="선택한 상품의 클로저 캡처값(productId, price)과 실제 Server Action 응답값이 일치하는지 비교합니다. 클라이언트는 이 값을 인자로 보낸 적이 없습니다."
      />
      <DemoDeepDiveCard title="컴포넌트 내부 인라인 'use server' 클로저 액션 & 스코프 바인딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Server Component 함수 본문 내부에서 비동기 함수 첫 줄에 <code>'use server'</code>를 선언하면, 상위 Server Component
              스코프의 변수를 클로저(Closure)로 캡처하는 인라인 Server Action이 생성됩니다. 이 함수는 Client Component에
              prop으로 전달하거나 <code>{'<'}form action={'{'}...{'}'}{'>'}</code>에 바인딩해 실행할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모는 <code>page.tsx</code>(Server Component)가 상품 목록을 <code>.map()</code>으로 순회하며, 각 반복마다{' '}
              <code>async function buyProductAction() {'{'} 'use server'; ... {'}'}</code>를 선언합니다. 이 함수는 인자를
              하나도 받지 않지만 반복 중이던 <code>product.id</code>, <code>product.name</code>, <code>product.price</code>를
              클로저로 캡처합니다. 상품마다 서로 다른 값을 캡처한 별도의 Server Action이 만들어지고, 이 참조가{' '}
              <code>{'<InlineActionClosureDemo items={...} />'}</code>의 prop으로 Client Component에 전달되어 버튼 클릭 시
              직접 호출됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>명시적 인자 노출 없이 값 전달</strong>: 클라이언트 코드에 productId·price를 직접 넘기는 코드가 없어도, 클로저 캡처만으로 서버가 올바른 값을 알고 있습니다.</li>
              <li><strong>클로저 데이터 자동 직렬화</strong>: Next.js가 캡처된 스코프 변수를 컴파일된 Server Action의 바인딩 인자로 직렬화해 전송하며, 클라이언트는 이 값을 조작할 수 없습니다.</li>
              <li><strong>코드 응집도 향상</strong>: 목록을 렌더링하는 로직과 그 항목 전용 액션을 같은 위치(같은 반복문)에 작성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록 각 카드의 즉시구매/즉시결제 버튼</li>
              <li>댓글 목록의 개별 댓글 좋아요 토글 및 신고 액션</li>
              <li>주문 상세 화면의 개별 품목 반품 신청 액션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Client Component 내부 인라인 선언 불가</strong>: 인라인 <code>'use server'</code>는 반드시 Server Component 함수 본문 내부에서만 선언할 수 있습니다. Client Component(<code>'use client'</code> 파일)에서는 이 문법을 쓸 수 없고, 별도 파일 최상단에 <code>'use server'</code>를 선언한 모듈(파일 레벨 액션)을 import해야 합니다.</li>
              <li><strong>실측 검증 방법</strong>: 브라우저 개발자 도구 Network 탭에서 이 페이지 URL로 가는 POST 요청과 <code>Next-Action</code> 요청 헤더를 확인하면, 이 호출이 실제 컴파일된 Server Action RPC임을 직접 확인할 수 있습니다. 요청 본문에는 상품 정보가 평문으로 보이지 않고, 서버만 해독 가능한 암호화된 클로저 토큰 하나만 담겨 있습니다.</li>
              <li><strong>위변조 방지 확인</strong>: 이 암호화된 클로저 토큰의 문자를 단 하나만 바꿔서 재전송하면 서버가 <code>Cipher job failed</code> 오류로 요청을 거부합니다 — 클라이언트가 productId·price 값을 조작할 수 없다는 뜻입니다.</li>
              <li><strong>암호화 오버헤드 고려</strong>: 너무 큰 객체를 클로저로 캡처하면 직렬화 페이로드 크기가 커지므로 ID 등 필수 식별자만 캡처하는 것이 좋습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
