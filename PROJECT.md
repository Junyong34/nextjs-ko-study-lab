# Project: nextjs-app DemoDeepDiveCard Educational Refactoring (241 Demos)

## Architecture
- **Monorepo Structure**: pnpm workspace managed with Turborepo (`turbo.json`) and pnpm workspaces (`pnpm-workspace.yaml`).
- **Apps & Zones**:
  - `apps/demo-baseline`: Hosts 211 baseline App Router demos under `src/app/zone/baseline/*`.
  - `apps/demo-cache-components`: Hosts 30 `use cache` / cacheLife / revalidation demos under `src/app/zone/cache/*`.
  - `apps/shell`: Host multi-zone proxy & docs shell on Port 3000.
- **Packages**:
  - `packages/demos`: SSOT manifest (`demos.yaml`, `demos-manifest.json`).
  - `packages/demo-kit`: Reusable UI components including `DemoDeepDiveCard.tsx`.
  - `packages/test-suite`: Multi-tier test harness (Tiers 1–5, manifest validator, static literal scanner).

## Code Layout
- **Direct page inclusion (2 demos)**:
  - `apps/demo-baseline/src/app/zone/baseline/server-actions/basic/page.tsx`
  - `apps/demo-cache-components/src/app/zone/cache/caching/basic/page.tsx`
- **VerificationFooter inclusion (239 demos)**:
  - `apps/demo-baseline/src/app/zone/baseline/<url>/components/VerificationFooter.tsx` (210 demos)
  - `apps/demo-cache-components/src/app/zone/cache/<url>/components/VerificationFooter.tsx` (29 demos)

## Standard 5-Section DemoDeepDiveCard Specification
Every DemoDeepDiveCard across all 241 demos contains these 5 semantic sections in order:
1. `1. 핵심 스펙 및 개념 요약`: Accurate Next.js App Router / React 19 API specification and definition.
2. `2. 데모 예제 기반 동작 원리`: Specific interactive mechanism, UI actions, and execution flow in that demo.
3. `3. 실무적 장점 (Why Use This)`: Concrete architectural, performance, DX, or type-safety advantages (bullet points).
4. `4. 주요 활용 상황 (When to Use)`: Practical real-world e-commerce / enterprise production use cases (bullet points).
5. `5. 실무 주의사항 및 핵심 팁 (Caution & Tips)`: Common pitfalls, debugging tips, runtime constraints, cache tag scoping, or bundle leakage prevention (bullet points).

## Feature Inventory
| # | Feature / Scope Area | Description | Milestone | Source | Status |
|---|---|---|---|---|---|
| 1 | Critical Concept Errors (R1) | Fix 6 critical concept errors + 2 technical ambiguities (10 files) | M1 | Survey & Audit 3-3, 3-6 | DONE |
| 2 | Getting Started & Guides Part 1 (R2, R3) | 1-getting-started (25 demos) & 2-guides Caching/Rendering/UI (37 demos) | M2 | Survey & Audit 4-1, 4-2 | DONE |
| 3 | Guides Part 2 & Architecture (R2, R3) | 2-guides Forms/Auth/Security/Ops (39 demos) & 5-architecture (6 demos) | M3 | Survey & Audit 4-1, 4-2 | DONE |
| 4 | File Conventions & Components (R2, R3) | 3-file-conventions (43 demos) & 3-components (10 demos) | M4 | Survey & Audit 4-1, 4-2 | DONE |
| 5 | Functions, Directives, Config & Edge (R2, R3) | 3-functions (49 demos), 3-directives (8 demos), 3-config (22 demos), 3-edge (2 demos) | M5 | Survey & Audit 4-1, 4-2 | DONE |
| 6 | Global 5-Section Audit & Victory Verification | 241 demos 5-section validation, 0 boilerplate check, type-check, tests, build | M6 | Survey & Acceptance Criteria | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Critical Concept Errors Fix | 10 critical demo files in `demo-baseline` | none | DONE |
| M2 | Batch 1: Getting Started & Guides (Part 1) | 62 demos (getting-started + guides caching/rendering/ui) | M1 | DONE |
| M3 | Batch 2: Guides (Part 2) & Architecture | 45 demos (guides forms/auth/security/ops + architecture) | M1 | DONE |
| M4 | Batch 3: File Conventions & Components | 51 demos (file-conventions + components) | M1 | DONE |
| M5 | Batch 4: Functions, Directives, Config & Edge | 76 demos (functions + directives + config + edge) | M1 | DONE |
| M6 | Final Verification & Forensic Audit | Global audit of all 241 demos, type-check, test suite, build | M1, M2, M3, M4, M5 | DONE |

## Interface Contracts
- **Component Wrapper**: `<DemoDeepDiveCard title="...">` from `@study/demo-kit`.
- **Inner Structure**: `<div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">` with 5 semantic sections formatted per `survey_content_spec.md`.
- **Zero Boilerplate**: String `표준 아키텍처 스펙으로` has 0 occurrences across all `.tsx` files.
- **Verification Commands**:
  - `pnpm check-types` (`turbo check-types`): 9/9 packages pass (0 errors).
  - `pnpm test` (`pnpm --filter @study/test-suite test`): 419/419 test cases pass.
  - `pnpm build` (`turbo build`): 5/5 package targets pass (812 pages in shell).
