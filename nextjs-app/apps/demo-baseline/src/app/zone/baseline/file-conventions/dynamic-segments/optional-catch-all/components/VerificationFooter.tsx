'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentSlug?: string[]
  isDocsRoute?: boolean
}

export function VerificationFooter({
  currentSlug,
  isDocsRoute = false,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="[[...slug]] 선택적 포괄 세그먼트 검증 결과"
        expected="• docs/[[...slug]] 폴더 컨벤션에 매칭되어 루트(/docs) 접근 시 undefined, 하위 경로(/docs/a/b) 접근 시 string[] 주입\n• 단일 page.tsx에서 루트 인덱스와 N단계 서브 페이지 일원화 처리"
        actual={
          isDocsRoute
            ? currentSlug && currentSlug.length > 0
              ? `• [하위 경로 감지] params.slug = [${currentSlug.map(s => `"${s}"`).join(', ')}] (길이: ${currentSlug.length})\n• docs/[[...slug]] 서브 문서 렌더링 완료`
              : '• [루트 경로 감지] params.slug = undefined\n• docs/[[...slug]] 루트 인덱스 렌더링 완료'
            : '• 문서 네비게이션 대기 중 (위 링크를 클릭하여 [[...slug]] 라우트로 이동하세요)'
        }
        isMatched={isDocsRoute ? true : undefined}
        description="Next.js App Router의 [[...folderName]] 컨벤션을 통해 파라미터가 없는 루트 경로와 가변 하위 경로를 단일 컴포넌트에서 처리하는 동작을 검증합니다."
      />
      <DemoDeepDiveCard title="[[...slug]] 선택적 포괄 동적 세그먼트 (Optional Catch-all)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              이중 대괄호(<code>[[...folderName]]</code>)는 <b>Optional Catch-all Segments</b>로 동작합니다. 일반 포괄 세그먼트(<code>[...slug]</code>)와 달리 파라미터가 아예 없는 루트 경로(<code>/docs</code>)까지 매칭되며, 이때 <code>params.slug</code>는 <code>undefined</code>로 전달됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>docs/[[...slug]]</code> 라우트를 통해 <code>/docs</code> 접근 시 루트 인덱스 문서를 렌더링하고, <code>/docs/guide/installation</code> 접근 시 <code>slug = ['guide', 'installation']</code>을 읽어 서브 문서를 렌더링하는 일원화된 뷰어를 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>중복 파일 제거</strong>: <code>docs/page.tsx</code>와 <code>docs/[...slug]/page.tsx</code>를 따로 만들 필요 없이 <code>docs/[[...slug]]/page.tsx</code> 1개 파일로 루트와 서브 경로를 일원화합니다.</li>
              <li><strong>일관된 레이아웃 및 뷰어 공유</strong>: 루트 홈과 깊은 하위 페이지가 동일한 렌더러와 사이드바 컨텍스트를 자연스럽게 공유합니다.</li>
              <li><strong>헤드리스 CMS 연동 극대화</strong>: CMS의 동적 페이지 트리를 루트부터 말단 리프 노드까지 유연하게 매핑합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>통합 개발자 기술 문서 및 API 레퍼런스 포털 (<code>/docs</code> 및 <code>/docs/*</code>)</li>
              <li>다국어 글로벌 사이트 (<code>/kr</code>, <code>/kr/products</code>, <code>/kr/company/about</code>)</li>
              <li>카테고리 메인 홈 및 세부 상품 필터링 일체형 뷰어</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>undefined 조건 분기 처리</strong>: 루트 경로 접근 시 <code>slug</code>가 <code>undefined</code>이므로, <code>if (!slug || slug.length === 0)</code> 형태로 루트 뷰를 분기 처리해야 런타임 TypeError를 방지할 수 있습니다.</li>
              <li><strong>라우트 우선순위(Specificity)</strong>: 정적 라우트(<code>docs/special</code>)가 명시적으로 선언되어 있으면 해당 정적 라우트가 <code>[[...slug]]</code>보다 우선 매칭됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
