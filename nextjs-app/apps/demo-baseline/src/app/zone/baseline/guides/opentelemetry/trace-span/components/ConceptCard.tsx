import { DemoDeepDiveCard } from '@study/demo-kit'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="Trace, Span, 컨텍스트 전파">
      <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          <strong>trace</strong>는 한 요청이 지나간 전체 경로이고, <strong>span</strong>은 그 안의 작업 구간입니다. 모든 span은
          같은 <code>traceId</code>를 공유하고, 자신을 연 span의 <code>spanId</code>를 부모로 기록합니다. Next.js는 tracer
          provider가 등록되면 <code>GET /경로</code>(root), <code>render route (app)</code>, <code>resolve page components</code>,
          <code>start response</code>, <code>executing api route (app)</code> 같은 span을 스스로 만듭니다.
        </p>
        <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`// src/instrumentation.ts → src/lib/otel-setup.ts (nodejs 런타임에서만)
registerOTel({
  serviceName: 'study-demo-baseline',
  spanProcessors: [new DemoRingBufferProcessor(store)], // 메모리 링버퍼(최대 200개)
  instrumentationConfig: { fetch: { ignoreUrls: [/데모 경로가 아닌 URL/] } },
})

// lib/probe.ts — 서버 컴포넌트 안에서
tracer.startActiveSpan('demo.child', async (span) => {
  try {
    await fetch(echoUrl, { opentelemetry: { propagateContext: true } })
  } finally {
    span.end() // 실패해도 반드시 종료
  }
})`}</pre>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            <strong>부모 관계.</strong> <code>startActiveSpan</code>은 지금 활성 span(서버 컴포넌트를 렌더링하는{' '}
            <code>render route (app)</code>)을 부모로 삼고, 콜백 동안 자신을 활성 span으로 바꿉니다. 그래서 그 안의 fetch span은
            demo.child의 자식이 됩니다. <code>router.refresh()</code> 같은 RSC 요청에서는 렌더링 span 없이 root{' '}
            <code>RSC GET /경로</code>가 활성 span이었습니다(이 데모에서 실측).
          </li>
          <li>
            <strong>전파.</strong> fetch 계측이 W3C <code>traceparent</code> 헤더(<code>00-traceId-부모spanId-01</code>)를 붙이고,
            echo 쪽 Next 서버는 이 헤더로 root span의 부모를 원격 컨텍스트로 이어 붙입니다. 브라우저에서 직접 부르면 헤더가 없어
            새 trace가 시작됩니다.
          </li>
          <li>
            <strong>fetch span의 주인.</strong> <code>@vercel/otel</code>의 fetch 계측은 <code>NEXT_OTEL_FETCH_DISABLED=1</code>을
            설정해 Next 기본 fetch span을 끄고 자기 span으로 대체합니다. 기본값은 Vercel 배포 URL(로컬은 http://localhost)에만
            traceparent를 붙이므로 다른 호스트는 <code>propagateContextUrls</code>나 호출 단위 옵션으로 허용합니다.
          </li>
          <li>
            <strong>이 데모의 한계.</strong> collector가 없어 span은 이 서버 프로세스 메모리에서만 읽습니다(서버리스 인스턴스가
            여러 개면 다른 인스턴스의 span은 보이지 않음). 운영에서는 <code>spanProcessors: [&apos;auto&apos;]</code>나 OTLP
            exporter로 collector·관측 백엔드에 보냅니다. edge 런타임은 계측하지 않았고, 다른 데모에 영향을 주지 않도록 데모 경로
            요청의 trace만 저장하며 fetch 계측도 데모 URL로 제한했습니다.
          </li>
          <li>
            <strong>dev HMR 주의.</strong> <code>next dev</code>는 서버 코드를 HMR할 때 <code>globalThis.fetch</code>를 부팅 시점 값으로
            되돌립니다. <code>register()</code>는 다시 호출되지 않으므로 그 뒤로는 tracer provider는 남고 fetch 계측(traceparent
            주입)만 빠집니다. 이 경우 검증이 불일치가 되며, dev 서버를 재시작하면 돌아옵니다.
          </li>
          <li>
            <strong>더 많은 span.</strong> <code>NEXT_OTEL_VERBOSE=1</code>이면 Next가 기본보다 많은 내부 span을 내보냅니다(이
            데모에서는 켜지 않았습니다).
          </li>
        </ul>
      </div>
    </DemoDeepDiveCard>
  )
}
