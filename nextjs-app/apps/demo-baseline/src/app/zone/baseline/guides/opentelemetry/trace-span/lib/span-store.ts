import type { OtelDemoStore } from '@/lib/otel-setup'

// otel-setup.ts(instrumentation 번들)가 globalThis에 둔 링버퍼를 Route Handler 번들에서 읽는다.
// otel-setup.ts를 값으로 import하지 않는다 — 그러면 @vercel/otel이 Route Handler 번들에도 들어간다.
export function getSpanStore(): OtelDemoStore | undefined {
  return globalThis.__guidesOtelTraceSpanStore
}
