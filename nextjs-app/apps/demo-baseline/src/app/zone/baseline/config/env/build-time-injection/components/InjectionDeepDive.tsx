import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400'

export function InjectionDeepDive() {
  return (
    <DemoDeepDiveCard title="next.config env 필드의 빌드 타임 인라인">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            <code>next.config</code>의 <code>env</code>에 선언한 키는 서버와 브라우저에서 <code>process.env.KEY</code>로 읽으면 선언값이 나왔고, 같은 키를 <code>process.env[key]</code>로 읽으면 <code>undefined</code>였습니다.
            브라우저가 내려받은 JS 청크를 다시 fetch해 보면 선언값 문자열이 코드 안에 직접 들어 있고, <code>process.env.KEY</code> 식별자는 남아 있지 않습니다. 번들러가 컴파일하면서 그 식별자를 문자열 리터럴로 바꿨기 때문입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. NEXT_PUBLIC_ 없이도 노출된다</h5>
          <p>
            <code>.env</code> 파일에서는 <code>NEXT_PUBLIC_</code> 접두사가 브라우저 노출 여부를 정합니다(<code>guides/environment-variables</code> 데모). 하지만 <code>env</code> 필드는 접두사와 무관하게 <strong>선언한 키 전부</strong>를 번들에 넣습니다.
            이 데모의 키는 접두사가 없는데도 청크에서 발견됐습니다. 그래서 비밀번호·API 시크릿은 절대 <code>env</code>에 선언하지 않습니다. 이 데모의 값은 노출돼도 상관없는 학습용 문자열입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 치환되는 것과 안 되는 것</h5>
          <ul className={list}>
            <li>치환 대상은 소스에 <code>process.env.KEY</code>처럼 완전한 식별자로 적힌 곳뿐입니다. <code>process.env[key]</code>, <code>const &#123; KEY &#125; = process.env</code>, <code>const e = process.env</code> 뒤 접근은 치환되지 않습니다.</li>
            <li>치환된 값은 실제 <code>process.env</code>에 들어가지 않습니다. 서버에서도 동적 접근은 <code>undefined</code>였습니다. 반대로 런타임에 바뀌는 서버 환경변수는 점 접근이든 동적 접근이든 요청 시점 값을 읽는 <code>runtime-env</code> 데모의 방식입니다.</li>
            <li>선언하지 않은 키는 점 접근도 치환되지 않아 <code>undefined</code>입니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>4. 값을 바꾸려면</h5>
          <p>
            값은 컴파일 시점에 코드에 박히므로 설정을 고친 뒤 <code>next dev</code> 재시작(운영은 <code>next build</code> 재실행)이 필요합니다. 재시작 없이는 서버 컴포넌트가 읽는 설정 모듈의 새 값과 번들에 박힌 옛 값이 달라 이 화면에서 불일치가 표시됩니다.
            런타임에 바꿔야 하는 값은 <code>env</code> 필드가 아니라 서버에서 <code>process.env[name]</code>로 읽는 환경변수를 씁니다. 새로 시작하는 프로젝트에서는 <code>.env</code> 파일과 <code>NEXT_PUBLIC_</code> 접두사가 먼저 고려할 방식입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>5. 이 실습으로 확인할 수 없는 것</h5>
          <p>
            <code>next dev</code>의 청크는 압축되지 않은 개발용 빌드입니다. 프로덕션 번들에서 값이 어떤 모양으로 남는지(상수 접기·압축)는 <code>next build</code> 후에 봐야 하며 이 데모에서는 확인하지 않습니다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
