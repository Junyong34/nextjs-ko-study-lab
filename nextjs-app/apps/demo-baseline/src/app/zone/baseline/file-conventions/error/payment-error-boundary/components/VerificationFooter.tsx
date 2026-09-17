'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  isErrorCaught?: boolean
}

export function VerificationFooter({ isErrorCaught = false }: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="결제 세그먼트 error.tsx 에러 바운더리 검증 결과"
        expected="• checkout/error.tsx 파일이 세그먼트 에러 바운더리로 등록\n• 런타임 오류 발생 시 상위 레이아웃을 파괴하지 않고 에러 카드 및 reset() 복구 기능 제공"
        actual={
          isErrorCaught
            ? '• [에러 포착] checkout/error.tsx 활성화 · checkout/layout.tsx 진행 배너는 마운트 ID가 바뀌지 않은 채 그대로 표시됨'
            : '• 결제 세그먼트 정상 동작 대기 중 (/checkout 진입 후 에러를 발생시키세요)'
        }
        isMatched={isErrorCaught ? true : undefined}
        description="checkout/error.tsx가 같은 세그먼트의 page.tsx만 감싸고 layout.tsx는 감싸지 않는다는 것을, 에러 발생 전후 layout.tsx 배너의 마운트 ID가 동일한지로 직접 대조합니다."
      />
      <DemoDeepDiveCard title="checkout/error.tsx는 왜 Client Component여야 하며, 무엇을 감싸는가">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. error.tsx가 &apos;use client&apos;여야 하는 이유</h5>
            <p>
              Next.js가 세그먼트마다 만드는 에러 경계는 내부적으로 <code>getDerivedStateFromError</code>/<code>componentDidCatch</code> 생명주기를 가진 React 클래스 컴포넌트(<code>ErrorBoundaryHandler</code>)입니다. 이 생명주기는 브라우저에서 커밋되는 렌더 트리 위에서만 동작하는 React 클라이언트 기능이라, 그 fallback으로 넘겨줄 <code>error.tsx</code> 자신도 클라이언트에서 인스턴스화될 수 있어야 합니다. 또한 <code>reset()</code>은 <code>onClick</code>으로 즉시 실행되는 이벤트 핸들러라 서버 컴포넌트는 가질 수 없는 상호작용입니다. <code>'use client'</code>를 빼면 Next.js가 빌드/개발 서버 단계에서 즉시 에러로 막습니다(아래 5번 참고).
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. error.tsx가 감싸는 범위 — layout.tsx는 밖에 있다</h5>
            <p>
              같은 폴더 안에서 특수 파일이 렌더링되는 순서는 <code>layout.js → template.js → error.js → loading.js → not-found.js → page.js(또는 하위 layout.js)</code>입니다. <code>error.tsx</code>는 이 순서에서 자기보다 뒤에 오는 <code>page.tsx</code>와 그 하위 트리만 React Error Boundary로 감싸며, 자기보다 앞에 있는 <strong>같은 세그먼트의 <code>layout.tsx</code>·<code>template.tsx</code>는 감싸지 않습니다</strong>. 이 데모의 <code>checkout/layout.tsx</code>가 렌더링하는 진행 배너가 그 증거입니다 — <code>checkout/page.tsx</code>가 던진 에러로 <code>checkout/error.tsx</code>가 활성화돼도 배너의 마운트 ID는 그대로입니다. layout.tsx가 에러 바운더리 밖에서 별도로 렌더링되고 있다는 뜻입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 의미</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>세그먼트 단위 격리</strong>: 결제 폼 렌더링이 실패해도 같은 세그먼트의 내비게이션·진행 표시줄 같은 layout.tsx 요소는 리마운트 없이 그대로 유지됩니다.</li>
              <li><strong>layout.tsx 자체의 에러는 못 잡는다</strong>: <code>checkout/layout.tsx</code>가 렌더링 중 던지는 에러는 <code>checkout/error.tsx</code> 밖에서 발생하므로 이 파일이 잡지 못하며, 상위 세그먼트의 <code>error.tsx</code>가 처리해야 합니다.</li>
              <li><strong>보안 다이제스트</strong>: 프로덕션에서는 서버 컴포넌트가 던진 에러의 상세 메시지 대신 <code>error.digest</code> 해시만 클라이언트로 전달됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 이 실습의 범위</h5>
            <p>
              <code>reset()</code>이 내부적으로 무엇을 다시 렌더링하는지, <code>retry()</code>와 어떻게 다른지는 같은 파일 컨벤션의 다른 실습(<code>reset-recovery</code>)에서 다룹니다. 이 페이지는 &quot;에러가 세그먼트 밖으로 전파되지 않고 격리된다&quot;는 격리 자체에만 집중합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실제로 확인한 사실</h5>
            <p>
              이 실습 페이지를 만들며 <code>checkout/error.tsx</code>에서 <code>&apos;use client&apos;</code>를 잠시 지우고 <code>next dev</code>로 직접 재현해봤습니다. Next.js(Turbopack)가 즉시 컴파일을 중단시키고{' '}
              <code>&quot;checkout/error.tsx must be a Client Component. Add the &apos;use client&apos; directive the top of the file to resolve this issue.&quot;</code>{' '}
              에러를 던졌습니다 — 공식 문서가 예제 코드마다 <code>{"// Error boundaries must be Client Components"}</code> 주석을 붙여 강조하는 이유를 실제 빌드 에러로 확인한 것입니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
