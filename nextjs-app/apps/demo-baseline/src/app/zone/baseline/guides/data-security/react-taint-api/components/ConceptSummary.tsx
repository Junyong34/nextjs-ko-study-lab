import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

export function ConceptSummary() {
  return (
    <DemoDeepDiveCard title="Taint API가 막는 것과 막지 못하는 것">
      <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          <code>experimental.taint: true</code>가 켜져 있어야 합니다(<code>next.config.ts</code>). 이 페이지의 <code>getPaymentConfig()</code>는
          <code>experimental_taintObjectReference</code>로 config 객체 참조를, <code>experimental_taintUniqueValue</code>로 <code>secretKey</code> 문자열을 표시합니다.
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li><strong>②</strong> 오염된 객체 참조를 반환하면 React가 Server Action 응답을 직렬화하다 예외를 던지고, 클라이언트의 <code>await</code>가 reject됩니다. 복사본(<code>{'{ ...config }'}</code>)은 다른 참조라 보호되지 않습니다.</li>
          <li><strong>③</strong> 오염된 문자열 값을 그대로 반환해도 같은 방식으로 차단됩니다.</li>
          <li><strong>④</strong> 값을 가공해 만든 새 문자열(템플릿, <code>slice</code> 등)은 추적되지 않아 유출됩니다. Taint는 <em>실수 방지용 추가 방어층</em>일 뿐입니다.</li>
        </ul>
        <p>
          Taint는 DAL에서 필요한 필드만 골라 반환하는 데이터 최소화를 대체하지 않으며, 모듈이 클라이언트에 import되는 것은 <code>import &apos;server-only&apos;</code>로 따로 막습니다(①처럼 마스킹 값만 반환하는 것이 기본 방어선입니다).
        </p>
      </div>
    </DemoDeepDiveCard>
  )
}
