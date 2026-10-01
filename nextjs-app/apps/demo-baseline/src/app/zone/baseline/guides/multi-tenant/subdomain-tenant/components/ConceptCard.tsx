import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="서브도메인 기반 테넌트 판별">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 흐름</h5>
          <p>
            Route Handler(<code>api/tenant/route.ts</code>)는 <code>(await headers()).get(&apos;host&apos;)</code> 에서 포트를 떼고 첫 라벨을 테넌트로 해석합니다.
            <code>acme.localhost</code> 는 <code>acme</code>, 라벨이 하나뿐인 <code>localhost</code> 는 테넌트 없음입니다.
            같은 코드가 Host 만 달라져 다른 테넌트를 돌려주는 것이 서브도메인 멀티 테넌시의 핵심입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 왜 서버에서 호출했나</h5>
          <p>
            브라우저는 <code>Host</code> 를 forbidden header 로 취급해 바꿀 수 없습니다. 그래서 Server Action 이 서버에서 같은 앱을 호출했고,
            그 과정에서 Node 의 <code>fetch</code>(undici)는 <code>Host</code> 덮어쓰기를 무시하지만 <code>node:http</code> 는 그대로 전송한다는 차이가 실측으로 드러났습니다.
            프록시 환경의 규약인 <code>x-forwarded-host</code> 는 <code>fetch</code> 로도 전달됩니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 주의사항</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>
              <code>x-forwarded-host</code> 는 클라이언트가 보내면 그대로 들어옵니다. 신뢰하는 프록시가 덮어쓰는 환경이 아니면 위조할 수 있으니, 테넌트 판별에 쓰기 전에 허용 목록으로 검증해야 합니다.
            </li>
            <li>Host 를 읽는 순간 해당 라우트는 요청 시점에 렌더링됩니다. 테넌트별 정적 최적화가 필요하면 <code>proxy.ts</code> 에서 경로를 rewrite 해 <code>[tenant]</code> 세그먼트로 넘기는 구성을 씁니다.</li>
            <li>운영에서는 <code>*.example.com</code> 와일드카드 도메인 연결과 TLS 가 필요하고, 로컬은 <code>*.localhost</code> 가 루프백으로 해석되는 브라우저 동작에 기대는 개발용 방법입니다.</li>
            <li>이 데모는 셸 iframe 안에서 호스트가 셸 호스트로 보이는 한계가 있어 Host 해석을 서버 호출로만 시연합니다. 배포 환경의 자기 호출은 검증하지 않았습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
