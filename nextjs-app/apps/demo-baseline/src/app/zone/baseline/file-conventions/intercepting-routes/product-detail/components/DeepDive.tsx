import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ProductDeepDive() {
  return (
    <DemoDeepDiveCard title="가로채기(Intercepting Route)로 만드는 상품 상세">
      <div className="space-y-3.5 leading-relaxed">
        <div>
          <h5 className={H}>1. 쉬운 말로 먼저</h5>
          <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <b>앱 안에서 이동(소프트 내비게이션)</b> — 링크를 눌러 이동. 페이지를 새로 받지 않는다.
            </li>
            <li>
              <b>주소로 직접 진입·새로고침(하드 내비게이션)</b> — 브라우저가 이 주소의 문서를 새로 요청한다.
            </li>
            <li>
              <b>가로채기(Intercepting Route)</b> — 같은 주소라도 앱 안에서 이동했을 때만 다른 화면(모달)으로
              바꿔치는 Next.js 기능. 직접 진입하면 원래 페이지가 나온다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={H}>2. 파일 구조 — 같은 주소, 두 개의 파일</h5>
          <pre className="whitespace-pre-wrap break-words rounded bg-zinc-100 p-3 font-mono text-[11px] dark:bg-zinc-900">{`product-detail/
├─ @modal/(.)products/[id]/page.tsx   ← 소프트 내비게이션이면 이 파일 (모달)
├─ products/[id]/page.tsx             ← 하드 내비게이션이면 이 파일 (정식)
└─ layout.tsx                         ← children + modal 슬롯을 나란히 렌더`}</pre>
          <p className="mt-1.5">
            <code>(.)</code>는 같은 레벨의 <code>products</code> 세그먼트를 가로챈다는 뜻이다. <code>@modal</code>은
            슬롯 이름이라 레벨 계산에 들어가지 않는다(<code>(.)products</code>가 <code>@modal</code> 안에
            있어도 <code>product-detail</code> 옆의 <code>products</code>와 같은 레벨).
          </p>
        </div>

        <div>
          <h5 className={H}>3. 모달: 요약은 즉시, 본문만 따로</h5>
          <p>
            목록 카드가 이미 가진 요약(이름·카테고리·가격)을 눌렀을 때 Context에 담아 두고, 모달이 그 요약으로
            첫 화면을 바로 그린다. 서버에서는 요약에 없는 상세만 받는다. 가로챈 쪽에서 서버 조회를 기다리면 그
            응답이 올 때까지 이동이 막히기 때문에, 이 구조는 “첫 화면은 이미 가진 데이터로, 나머지는 뒤에서”를
            택한다. (이 판단은 설명이며, 검증 패널은 요약→상세 도착 순서와 간격만 실측한다.)
          </p>
        </div>

        <div>
          <h5 className={H}>4. 정식 페이지: 메타데이터와 스트리밍</h5>
          <p>
            정식 페이지는 <code>generateMetadata</code>로 서버에서 <code>&lt;title&gt;</code>·OG를 만들고,
            느린 상세 조회는 <code>&lt;Suspense&gt;</code> 안에 둔다. 스켈레톤(fallback)이 먼저 도착하고 본문은
            조회가 끝난 뒤 이어서 스트리밍된다. 검증 패널은 HTML 응답 수신 시간으로 이 스트리밍을 실측하고,
            탭 제목에 상품명이 들어갔는지 읽는다.
          </p>
        </div>

        <div>
          <h5 className={H}>5. 한계</h5>
          <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>요약(seed)은 메모리에만 있다. 모달에서 새로고침하면 사라지고 정식 페이지가 서버에서 다시 조회한다.</li>
            <li>2초 지연은 학습용 <code>setTimeout</code>이다. 실제 서비스의 응답 시간이 아니다.</li>
            <li>요약을 어디에 보관할지(Context, 목록 캐시 등)는 서비스마다 다르며 Next.js 기능이 아니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
