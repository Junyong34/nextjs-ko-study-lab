# E2E Test Infra: nextjs-ko-study-lab Demo Remediation

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.
- Multi-tier validation: Type Safety, Route & Component Resolution, Dynamic State & Regression Verification, E-Commerce Workflows.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|----------------------|:------:|:------:|:------:|:------:|
| 1 | Dead Code & Mount Verification | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 2 | Doc Wiring & Manifest Integrity | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 3 | DeepDive Card Content Polish | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 4 | Route Handlers (`route.ts`) | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 5 | Dynamic Segments (`[id]`, `[...slug]`) | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 6 | Route Groups & Parallel Routes (`@slot`) | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 7 | Intercepting Routes (`(..)`) | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 8 | Special Boundaries & Metadata Files | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 9 | Proxy & Instrumentation Hooks | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 10 | Next.js APIs & Components Integration | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 11 | Dynamic `ExpectedActualPanel` Verification | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 12 | 8 Outliers E-Commerce Scenarios | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner Commands**:
  - Full Typecheck: `pnpm check-types`
  - Demo Manifest & Lint: `pnpm --filter @study/demos lint`
  - Static `isMatched={true}` Zero-Literal Linter: `pnpm test:no-static-matched` / automated static audit script.
  - Dynamic Verification & Route Crawler: Automated integration test runner verifying all 241 demo endpoints.
- **Pass / Fail Semantics**:
  - Exit code 0 on complete pass across all monorepo workspaces (`apps/shell`, `apps/demo-baseline`, `apps/demo-cache-components`, `packages/demos`, `packages/demo-kit`).
  - Zero TypeScript compiler errors.
  - Zero hardcoded `isMatched={true}` literals in demo `VerificationFooter.tsx` files.
  - All 241 demo manifest URLs resolve to valid on-disk routes.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | E-Commerce Instant Checkout Flow | Server Actions, Closure Capture, useTransition, Dynamic Verification | High |
| 2 | Catalog Filtering & Deep Linking | useSearchParams, useRouter, Suspense, Dynamic Route Segments | High |
| 3 | Multi-Instance Shared Flash Sale | use-cache, Redis remote cache, cacheTag, revalidateTag | High |
| 4 | Product Detail Modal Interception | Intercepting Routes `(..)`, Parallel Routes `@modal`, Hard Reload Fallback | High |
| 5 | Live Stock & Telemetry Stream | Route Handlers `route.ts`, `ReadableStream` SSE, after() background DW logging | High |

## Coverage Thresholds
- Tier 1: ≥5 test cases per feature (60+ cases)
- Tier 2: ≥5 test cases per feature covering boundaries & error states (60+ cases)
- Tier 3: Pairwise coverage across feature interactions (12+ combinations)
- Tier 4: ≥5 realistic e-commerce application scenarios
- Tier 5: White-box adversarial stress tests
