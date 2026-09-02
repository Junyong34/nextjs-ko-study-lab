'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import type { SerializablePayload } from '../types'
import { VerificationFooter } from './VerificationFooter'

interface ServerActionResponse {
  success: boolean
  inputMessage: string
  serverTimestamp: string
  serverTime: string
  serverRuntime: string
  actionId: string
  result: string
}

interface SerializationViewerClientProps {
  payload: SerializablePayload
  serverAction: (input: string) => Promise<ServerActionResponse>
}

type SimulationType =
  | 'primitive'
  | 'plain-object'
  | 'date'
  | 'server-action'
  | 'arrow-fn'
  | 'class-instance'
  | 'circular-ref'
  | 'symbol-bigint'

interface TypeSimulationItem {
  id: SimulationType
  label: string
  category: 'valid' | 'invalid'
  statusBadge: string
  codeSnippet: string
  explanation: string
  resultPreview: string
  isError: boolean
}

export function SerializationViewerClient({
  payload,
  serverAction,
}: SerializationViewerClientProps) {
  const [activeViewTab, setActiveViewTab] = useState<'structured' | 'raw-json'>('structured')
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationType>('primitive')
  const [inputMessage, setInputMessage] = useState('나이키 알파 러닝화 재고 및 쿠폰 적용 확인')
  const [actionResponse, setActionResponse] = useState<ServerActionResponse | null>(null)
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const [showErrorSim, setShowErrorSim] = useState(false)
  const [isPending, startTransition] = useTransition()

  // 1. 실시간 런타임 JSON 직렬화 검증 (하드코딩 방지)
  const serializationAudit = useMemo(() => {
    try {
      const rawString = JSON.stringify(payload, null, 2)
      const byteSize = new TextEncoder().encode(rawString).length
      return {
        isValid: true,
        byteSize,
        fieldCount: Object.keys(payload).length,
        rawJson: rawString,
        error: null,
      }
    } catch (err: any) {
      return {
        isValid: false,
        byteSize: 0,
        fieldCount: 0,
        rawJson: '',
        error: err.message,
      }
    }
  }, [payload])

  // 2. 타입별 직렬화 가능 vs 불가능 시뮬레이션 프리셋
  const simulationMap: Record<SimulationType, TypeSimulationItem> = {
    primitive: {
      id: 'primitive',
      label: '원시값 (String, Number, Boolean, null)',
      category: 'valid',
      statusBadge: '✅ 직렬화 100% 가능 (JSON Primitives)',
      codeSnippet: `const props = {
  title: "Next.js App Router",
  version: 2026,
  isActive: true,
  metadata: null
}`,
      explanation:
        '문자열, 숫자, 불리언, null은 JSON 표준의 기본 타입으로 데이터 손실이나 변형 없이 RSC 경계를 완벽하게 통과합니다.',
      resultPreview: JSON.stringify(
        { title: 'Next.js App Router', version: 2026, isActive: true, metadata: null },
        null,
        2
      ),
      isError: false,
    },
    'plain-object': {
      id: 'plain-object',
      label: '순수 객체 & 배열 (Plain Object & Array)',
      category: 'valid',
      statusBadge: '✅ 직렬화 가능 (Plain Object Tree)',
      codeSnippet: `const props = {
  product: { sku: "NIKE-ALPHA-001", stock: 48 },
  tags: ["러닝화", "카본플레이트", "인기"]
}`,
      explanation:
        '프로토타입이나 커스텀 메서드가 없는 순수 객체({ ... })와 배열([ ... ])은 RSC의 React Flight 포맷으로 안전하게 직렬화됩니다.',
      resultPreview: JSON.stringify(
        {
          product: { sku: 'NIKE-ALPHA-001', stock: 48 },
          tags: ['러닝화', '카본플레이트', '인기'],
        },
        null,
        2
      ),
      isError: false,
    },
    date: {
      id: 'date',
      label: 'Date 객체 / ISO 문자열 (Date)',
      category: 'valid',
      statusBadge: '✅ 직렬화 지원 (ISO 8601 변환 권장)',
      codeSnippet: `// 1. Date 객체 직접 전달
const dateObj = new Date();
// 2. ISO 문자열 변환 전달 (타임존 불일치 방지 권장)
const dateString = new Date().toISOString();`,
      explanation:
        'Next.js RSC는 Date 객체를 지원하지만, 서버와 클라이언트 간 타임존 차이로 인한 Hydration Mismatch를 방지하기 위해 .toISOString() 문자열로 전달하는 것이 실무 표준입니다.',
      resultPreview: JSON.stringify(
        { dateString: new Date().toISOString(), timestamp: Date.now() },
        null,
        2
      ),
      isError: false,
    },
    'server-action': {
      id: 'server-action',
      label: "'use server' Server Action 함수",
      category: 'valid',
      statusBadge: "✅ 참조 직렬화 가능 (Action ID 바인딩)",
      codeSnippet: `// actions.ts
'use server'
export async function executeServerTask(input: string) { ... }

// page.tsx (Server Component)
<ClientComponent onAction={executeServerTask} />`,
      explanation:
        "일반 함수는 직렬화할 수 없지만, 'use server'로 선언된 함수는 Next.js가 빌드 타임에 고유한 Action ID(해시값)를 부여하여 클라이언트로 안전하게 참조를 직렬화 전달합니다.",
      resultPreview: `[Server Action Reference]
$$typeof: Symbol(react.action.id)
$$id: "a1b2c3d4e5f6...#executeServerTask"
bound: null`,
      isError: false,
    },
    'arrow-fn': {
      id: 'arrow-fn',
      label: '일반 클로저 / 화살표 함수 (() => {})',
      category: 'invalid',
      statusBadge: '❌ 직렬화 불가 (런타임 에러 발생)',
      codeSnippet: `// ❌ page.tsx (서버 컴포넌트에서 일반 함수 전달 시도)
<ClientComponent 
  onClick={() => console.log('서버 메모리 함수')} 
/>`,
      explanation:
        '일반 자바스크립트 함수와 클로저 스코프는 네트워크 경계를 넘어 직렬화(Serialization)할 수 없습니다. 대신 클라이언트 컴포넌트 내부에서 함수를 정의하거나 Server Action을 사용해야 합니다.',
      resultPreview: `Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".
  <ClientComponent onClick={function}>
                            ^^^^^^^^`,
      isError: true,
    },
    'class-instance': {
      id: 'class-instance',
      label: '커스텀 Class 인스턴스 (new User())',
      category: 'invalid',
      statusBadge: '❌ 직렬화 불가 (메서드 손실 및 경고)',
      codeSnippet: `class User {
  constructor(public name: string) {}
  getGreeting() { return \`Hello \${this.name}\`; }
}
// ❌ 클래스 인스턴스 전달 시도
<ClientComponent user={new User('홍길동')} />`,
      explanation:
        '클래스 인스턴스의 프로토타입 메서드(getGreeting 등)는 JSON으로 직렬화되지 않고 유실됩니다. 순수 데이터 객체({ name: "홍길동" })로 변환(DTO)하여 전달해야 합니다.',
      resultPreview: `Warning: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or other objects with methods are not supported.
  { user: User { name: '홍길동' } }`,
      isError: true,
    },
    'circular-ref': {
      id: 'circular-ref',
      label: '순환 참조 객체 (Circular Reference)',
      category: 'invalid',
      statusBadge: '❌ 직렬화 불가 (순환 참조 에러)',
      codeSnippet: `const a: any = { name: "노드 A" };
const b: any = { name: "노드 B", parent: a };
a.child = b; // ❌ A가 B를 참조하고, B가 A를 참조 (순환 구조)
<ClientComponent node={a} />`,
      explanation:
        '객체 그래프에 순환 참조가 존재하면 JSON 직렬화기가 무한 루프에 빠져 TypeError를 던집니다. 트리 구조를 단방향으로 정규화해야 합니다.',
      resultPreview: `TypeError: Converting circular structure to JSON
  --> starting at object with constructor 'Object'
  |     property 'child' -> object with constructor 'Object'
  --- property 'parent' closes the circle`,
      isError: true,
    },
    'symbol-bigint': {
      id: 'symbol-bigint',
      label: 'Symbol & BigInt',
      category: 'invalid',
      statusBadge: '❌ 직렬화 불가 (데이터 누락 / 타입 에러)',
      codeSnippet: `const props = {
  id: Symbol("unique_id"), // ❌ JSON 직렬화 시 누락됨
  largeAmount: 9007199254740991n // ❌ BigInt는 JSON 미지원
};`,
      explanation:
        'Symbol은 JSON.stringify 시 키/값에서 완전히 제거되며, BigInt는 JSON 표준 명세에 없어 직렬화 시 TypeError가 발생합니다. BigInt는 문자열로 변환하여 전달해야 합니다.',
      resultPreview: `TypeError: Do not know how to serialize a BigInt
(Symbol properties are omitted from JSON payload)`,
      isError: true,
    },
  }

  const currentSim = simulationMap[selectedSimulation]

  const handleCallAction = () => {
    setShowErrorSim(false)
    const start = performance.now()
    startTransition(async () => {
      const res = await serverAction(inputMessage || '테스트 요청')
      const duration = Math.max(1, Math.round(performance.now() - start))
      setLatencyMs(duration)
      setActionResponse(res)
    })
  }

  const handleTriggerErrorSimulation = () => {
    setActionResponse(null)
    setShowErrorSim(true)
  }

  return (
    <div className="space-y-8">
      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="RSC Props 직렬화 인스펙터 & 유효성 시뮬레이터" className="space-y-8">
        
        {/* ========================================================= */}
        {/* [섹션 1] 서버에서 수신된 Props 런타임 직렬화 검증 패널 */}
        {/* ========================================================= */}
        <div className="space-y-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/20 p-5 sm:p-6 dark:border-emerald-700/60 dark:bg-emerald-950/20 shadow-xs mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-3 dark:border-emerald-800/80">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
                1. RSC 수신 Props 런타임 직렬화 검증기
              </span>
            </div>

            {/* 실시간 런타임 검증 뱃지 */}
            <div className="flex items-center gap-2">
              {serializationAudit.isValid ? (
                <span className="rounded-md bg-emerald-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-emerald-500">
                  ✅ 런타임 JSON 직렬화 검증 통과 ({serializationAudit.byteSize} bytes, {serializationAudit.fieldCount}개 필드)
                </span>
              ) : (
                <span className="rounded-md bg-rose-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-2xs">
                  ❌ 직렬화 실패: {serializationAudit.error}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            서버 컴포넌트(<code>page.tsx</code>)에서 생성된 데이터를 <code>'use client'</code> 컴포넌트로 전달할 때, Next.js는 RSC 경계선에서 데이터를 JSON 직렬화합니다. 아래는 브라우저가 실제로 수신한 데이터입니다.
          </p>

          {/* 뷰 전환 탭 버튼 */}
          <div className="flex items-center gap-2 pt-2 mb-2">
            <button
              type="button"
              onClick={() => setActiveViewTab('structured')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeViewTab === 'structured'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              📦 구조화된 카드 뷰
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('raw-json')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeViewTab === 'raw-json'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              📄 RSC 원시 JSON 페이로드 (Raw JSON)
            </button>
          </div>

          {/* 탭 1: 구조화된 카드 뷰 */}
          {activeViewTab === 'structured' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
              <div className="rounded-xl border border-emerald-200/80 bg-white p-4 sm:p-5 dark:border-emerald-900/60 dark:bg-zinc-900 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  기본 원시값 (Primitives):
                </span>
                <div className="font-mono text-xs space-y-1.5 text-zinc-800 dark:text-zinc-200 pt-1">
                  <div>• String: <strong className="text-emerald-700 dark:text-emerald-400">"{payload.primitiveString}"</strong></div>
                  <div>• Number: <strong className="text-emerald-700 dark:text-emerald-400">{payload.primitiveNumber}</strong></div>
                  <div>• Boolean: <strong className="text-emerald-700 dark:text-emerald-400">{payload.primitiveBoolean ? 'true' : 'false'}</strong></div>
                  <div>• Null: <strong className="text-zinc-500">null</strong></div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200/80 bg-white p-4 sm:p-5 dark:border-emerald-900/60 dark:bg-zinc-900 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  평탄한 객체 & 배열 (Plain Object):
                </span>
                <div className="font-mono text-xs space-y-1.5 text-zinc-800 dark:text-zinc-200 pt-1">
                  <div>• SKU: <strong>{payload.plainObject.sku}</strong> (재고: {payload.plainObject.stock}개)</div>
                  <div>• 카테고리 태그: <strong>[{payload.arrayData.join(', ')}]</strong></div>
                  <div>• ISO 날짜 문자열: <strong className="text-[11px] text-zinc-600 dark:text-zinc-400">{payload.dateString}</strong></div>
                </div>
              </div>
            </div>
          ) : (
            /* 탭 2: RSC 원시 JSON 뷰 */
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-mono text-zinc-500">
                실제 RSC 페이로드로 전송된 JSON 직렬화 문자열:
              </div>
              <pre className="overflow-x-auto rounded-xl border border-zinc-300 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 dark:border-zinc-800">
                {serializationAudit.rawJson}
              </pre>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* [섹션 2] 타입별 직렬화 가능 vs 불가능 대조 시뮬레이터 */}
        {/* ========================================================= */}
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
            <div>
              <h4 className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
                2. 타입별 직렬화 가능(Serializable) vs 불가능(Non-Serializable) 대조 시뮬레이터
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                각 데이터 타입을 클릭하여 직렬화 성공/실패 결과와 Next.js 런타임 동작 차이를 비교해 보세요.
              </p>
            </div>
            <span className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              인터랙티브 검사기
            </span>
          </div>

          {/* 시뮬레이션 타입 선택 버튼 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 mb-2">
            {(Object.keys(simulationMap) as SimulationType[]).map((key) => {
              const item = simulationMap[key]
              const isSelected = selectedSimulation === key
              const isVal = item.category === 'valid'
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSimulation(key)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? isVal
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 dark:border-emerald-600 shadow-2xs'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 dark:border-rose-600 shadow-2xs'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded mb-1.5 ${
                    isVal ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                  }`}>
                    {isVal ? 'PASS' : 'FAIL'}
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {item.label.split('(')[0]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 선택된 타입 상세 분석 카드 */}
          <div className={`space-y-3.5 rounded-xl border p-4 sm:p-5 shadow-2xs mt-4 ${
            currentSim.isError
              ? 'border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
              : 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/20'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/60 pb-3 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {currentSim.label}
              </span>
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded ${
                currentSim.isError
                  ? 'bg-rose-600 text-white dark:bg-rose-500'
                  : 'bg-emerald-600 text-white dark:bg-emerald-500'
              }`}>
                {currentSim.statusBadge}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              {currentSim.explanation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  코드 예시:
                </span>
                <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[11px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                  {currentSim.codeSnippet}
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  {currentSim.isError ? 'Next.js 런타임 에러 출력:' : '직렬화 결과 출력:'}
                </span>
                <pre className={`overflow-x-auto rounded-lg border p-3 font-mono text-[11px] ${
                  currentSim.isError
                    ? 'border-rose-300 bg-rose-950 text-rose-300 dark:border-rose-800'
                    : 'border-emerald-300 bg-zinc-950 text-emerald-400 dark:border-emerald-800'
                }`}>
                  {currentSim.resultPreview}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* [섹션 3] 'use server' Server Action 함수 Prop 전달 및 실시간 RPC 통신 파이프라인 */}
        {/* ========================================================= */}
        <div className="space-y-4 rounded-2xl border-2 border-indigo-500/50 bg-indigo-50/20 p-5 sm:p-6 dark:border-indigo-700/60 dark:bg-indigo-950/20 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/80 pb-3 dark:border-indigo-800/80">
            <div>
              <span className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
                3. 'use server' 함수 Prop 전달 & RPC 통신 파이프라인
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                함수는 직렬화할 수 없지만, 'use server' 함수는 Action ID(참조)로 직렬화되어 클라이언트에서 서버 원격 호출(RPC)이 가능합니다.
              </p>
            </div>
            <span className="rounded bg-indigo-600 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-indigo-500">
              Action ID 참조 바인딩
            </span>
          </div>

          {/* 사용자 정의 입력창 */}
          <div className="space-y-2 pt-1">
            <label htmlFor="server-input" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              서버로 전송할 테스트 파라미터 (Input Message):
            </label>
            <input
              id="server-input"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="서버 액션으로 보낼 텍스트를 입력하세요..."
              className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* 액션 실행 및 에러 대조 버튼 그룹 */}
          <div className="flex flex-wrap items-center gap-3 pt-2 mb-2">
            <button
              type="button"
              onClick={handleCallAction}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? '서버 통신 중 (POST)...' : '✅ 전달받은 Server Action Props 실행 (RPC 요청)'}
            </button>

            <button
              type="button"
              onClick={handleTriggerErrorSimulation}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 transition cursor-pointer"
            >
              <span>❌ 일반 서버 함수 Props 전달 시도 (에러 시뮬레이션)</span>
            </button>
          </div>

          {/* 에러 시뮬레이션 출력 */}
          {showErrorSim && (
            <div className="rounded-xl border border-rose-300 bg-rose-950/90 p-4 text-xs font-mono text-rose-200 shadow-2xs space-y-2.5 animate-in fade-in duration-200 mt-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold border-b border-rose-800 pb-2">
                <span>⚠️ Next.js 빌드/런타임 직렬화 위반 에러 발생</span>
              </div>
              <p className="leading-relaxed">
                Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".<br />
                &nbsp;&nbsp;&lt;SerializationViewerClient serverAction=&#123;function executeTask&#125;&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^^^^^^^^^^^^^^^^^^^^
              </p>
              <p className="text-[11px] text-zinc-400 border-t border-rose-900/60 pt-2">
                💡 <strong>해결 방법</strong>: 함수의 맨 첫 줄에 <code>'use server'</code>를 추가하면 Next.js가 Action ID를 생성하여 클라이언트로 안전하게 Props 전달할 수 있게 됩니다.
              </p>
            </div>
          )}

          {/* 성공 시 실시간 RPC 통신 파이프라인 시각화 */}
          {actionResponse && (
            <div className="space-y-3.5 rounded-xl border border-indigo-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-indigo-900/60 dark:bg-zinc-900 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5 dark:border-zinc-800">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  📡 실시간 RPC 통신 파이프라인 (Client ➔ Server ➔ Client)
                </span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  HTTP POST 200 OK ({latencyMs}ms 소요)
                </span>
              </div>

              {/* 4단계 파이프라인 플로우 */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs pt-1">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] block mb-1">
                    1. 클라이언트 호출
                  </span>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    Props.serverAction("{actionResponse.inputMessage}")
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] block mb-1">
                    2. 네트워크 RPC 전송
                  </span>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-mono">
                    Next-Action ID: #executeServerTask
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] block mb-1">
                    3. 서버 런타임 실행
                  </span>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    {actionResponse.serverRuntime} ({actionResponse.serverTime})
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] block mb-1">
                    4. 반환값 수신
                  </span>
                  <p className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                    화면 상태 갱신 완료
                  </p>
                </div>
              </div>

              {/* 서버 응답 JSON 프리뷰 */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  서버에서 직렬화되어 반환된 JSON 데이터:
                </span>
                <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-950 p-3 font-mono text-[11px] text-emerald-400 dark:border-zinc-800">
                  {JSON.stringify(actionResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        actionResult={actionResponse?.result || null}
        selectedSimulation={selectedSimulation}
      />
    </div>
  )
}
