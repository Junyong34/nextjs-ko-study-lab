# 09. 데모 표준 구조 및 4단 레이아웃 패턴

Next.js 학습 랩의 모든 데모(Phase 1 ~ Phase 5, 총 242개)가 **동일한 고품질 UI/UX와 실제 Next.js 동작 원리**를 전달하기 위한 제작 표준 지침이다.

---

## 1. 핵심 제작 철학 (No-Simulation 원칙)

> **"Next.js 학습 랩의 데모는 겉모습만 흉내 내는 가짜 UI가 아니라, 실제 Next.js 파일 컨벤션과 런타임 라우팅이 동작하는 '진짜 Next.js 앱'이어야 한다."**

### ❌ 절대 금지 패턴 (Anti-Patterns)
1. **단일 컴포넌트의 가짜 state 탭 전환**:
   - `useState('tab')`으로 페이지만 바꾼 채 "레이아웃이 유지된다"고 주장하는 것 (React 컴포넌트 내부 상태일 뿐 Next.js의 특징이 아님).
2. **인공지능(AI) 느낌의 과도한 이모지 남발**:
   - 🎉, 💡, ⚡, 🔒, 👟, 👕, 🛍️ 등의 이모지를 남발하여 비전문적으로 보이는 UI.
3. **인위적인 내부 용어 뱃지**:
   - `Page 슬롯 마운트`, `children Slot` 등 실제 서비스와 무관한 잡음성 뱃지 표시.
4. **거대한 카드 그리드 스텝**:
   - 가이드 스텝 1, 2, 3이 화면을 절반 이상 가려 실제 실습 영역을 가리는 것.

### ✅ 필수 준수 패턴 (Authentic Next.js)
1. **실제 파일 시스템 라우팅 (`layout.tsx`, `page.tsx`, subroutes)**:
   - 중첩 레이아웃은 실제 `layout.tsx`와 실제 서브 라우트(`shoes/page.tsx`, `clothing/page.tsx` 등)를 물리적 디렉토리로 생성.
   - 실제 Next.js `<Link href="...">` 및 `useRouter`를 사용하여 브라우저 라우터가 실제로 이동하게 만듦.
2. **실제 Next.js 파일 컨벤션 구현**:
   - `template.tsx`는 실제 `template.tsx` 파일로 생성하여 매 라우팅 시 Next.js 런타임이 리마운트하는 것을 실증.
   - `Route Groups`는 실제 `(shop)`, `(auth)` 폴더로 생성하여 URL에서 괄호가 생략되는 것을 실증.
   - `Server Actions`는 실제 `'use server'` 함수(`actions.ts`)를 호출하여 Network 탭의 POST 요청 실증.

---

## 2. 데모 페이지 4단 표준 레이아웃 패턴

모든 데모 페이지는 반드시 **`fieldset` + `legend` 기반의 4단 구조**를 따른다.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 1단. [가이드] DemoGuideCard                                             │
│   • <legend>[가이드] 데모 제목</legend>                                  │
│   • 핵심 원리: 1초 비유 & 단 하나의 직관적인 핵심 메시지 요약          │
│   • 실행 절차: 1, 2, 3 컴팩트 슬림 수직 타임라인 (이모지 없음)          │
├─────────────────────────────────────────────────────────────────────────┤
│ 2단. [실습 화면] fieldset                                               │
│   • <legend>[실습 화면] 제어 대상 컴포넌트 / 실제 파일 경로</legend>    │
│   • 실제 Next.js 컴포넌트 조작 영역 (GNB, 사이드바, 폼, 데이터 목록)     │
│   • 실제 서비스(쇼핑몰, 대시보드 등)다운 깔끔하고 정갈한 UI             │
│   • 우측 상단/하단에 DemoResetButton (초기화) 배치                      │
├─────────────────────────────────────────────────────────────────────────┤
│ 3단. [검증] ExpectedActualPanel                                         │
│   • <legend>[검증] 검증 주제</legend>                                    │
│   • 상단 상태 뱃지: [검증 완료] / [대기 중] / [불일치]                  │
│   • 2단 대조:                                                           │
│     - 기대 결과 (Expected): Next.js 공식 문서 기준 기대 동작            │
│     - 실제 측정값 (Actual): usePathname, 런타임 타이머, 액션 응답       │
├─────────────────────────────────────────────────────────────────────────┤
│ 4단. [개념 정리] DemoDeepDiveCard                                       │
│   • <legend>[개념 정리] 핵심 개념 및 내부 동작 원리</legend>             │
│   • 1. 핵심 메커니즘 (children 주입, 캐시 키 생성, 스트리밍 등)         │
│   • 2. 컴포넌트 트리 및 파일 래핑 구조 (다이어그램 / 코드 블록)         │
│   • 3. 실무 이점 및 주의사항                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 표준 코드 구조 및 보일러플레이트

모든 데모 디렉토리는 단일 파일 250줄 제한을 준수하며 아래와 같이 모듈 분할을 구성한다:

```text
apps/demo-baseline/src/app/zone/baseline/{category}/{demo-name}/
├── layout.tsx                # 상위 레이아웃 (필요 시)
├── page.tsx                  # 최상위 조립 페이지 (100~150줄 이내)
├── {subroute}/page.tsx       # 실제 서브 라우트 세그먼트 (필요 시)
├── actions.ts                # Server Actions ('use server')
├── types.ts                  # 데모 전용 TypeScript 타입 정의
└── components/               # 쪼개진 하위 컴포넌트들
    ├── FeatureController.tsx # 실습 조작 위젯
    ├── ResultDisplay.tsx     # 결과 뷰어
    └── VerificationCard.tsx  # 하단 검증 & 개념 정리
```

### 표준 `layout.tsx` / `page.tsx` 템플릿

```tsx
'use client'

import React from 'react'
import {
  DemoContainer,
  DemoGuideCard,
  ExpectedActualPanel,
  DemoResetButton,
  DemoDeepDiveCard,
} from '@study/demo-kit'

export default function StandardDemoPage() {
  return (
    <DemoContainer className="space-y-4">
      {/* 1단. 가이드 카드 */}
      <DemoGuideCard
        title="데모 타이틀"
        concept="핵심 원리를 초보자도 바로 이해할 수 있는 1줄 비유와 설명"
        steps={[
          { step: 1, title: '첫 번째 동작', description: '...', actionBadge: '동작 1' },
          { step: 2, title: '두 번째 동작', description: '...', actionBadge: '동작 2' },
          { step: 3, title: '검증 확인', description: '...', actionBadge: '검증 완료' },
        ]}
      />

      {/* 2단. 실습 화면 fieldset */}
      <fieldset className="rounded-lg border border-zinc-300 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <legend className="px-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          [실습 화면] 제어 대상 컴포넌트
        </legend>
        {/* 실제 Next.js 컴포넌트 조작 영역 */}
      </fieldset>

      {/* 3단. 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="기능 동작 검증"
        expected="공식 문서 기준 기대 결과"
        actual="실제 런타임 측정 결과"
        isMatched={true}
        description="검증 상태 요약 설명"
      />

      {/* 4단. 최하단 개념 정리 카드 */}
      <DemoDeepDiveCard title="핵심 원리 및 내부 메커니즘">
        <div className="space-y-2.5">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">1. 동작 원리</h4>
          <p className="leading-relaxed">상세 해설...</p>
        </div>
      </DemoDeepDiveCard>
    </DemoContainer>
  )
}
```
