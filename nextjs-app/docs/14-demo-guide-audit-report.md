# Demo Guide Consistency Audit Report (M0 Baseline)

- **Generated**: 2026-08-23T12:57:02.010Z
- **Total Demos Scanned**: 241
- **Valid (Fully Compliant)**: 0 (0.0%)

## 1. Rule Summary Matrix

| Rule ID | Rule Name | Severity | Violations | Passed | Pass Rate | Target (M5) |
|---|---|---|---:|---:|---:|---|
| **GC01** | 템플릿 지문 금지 | `error` | 201 | 40 | **16.6%** | 100% (0 errors) |
| **GC02** | 스텝 제목 중복 금지 | `error` | 201 | 40 | **16.6%** | 100% (0 errors) |
| **GC03** | UI 라벨 인용 | `warn` | 181 | 60 | **24.9%** | >= 90% |
| **GC04** | 마지막 스텝 관찰 명시 | `error` | 241 | 0 | **0.0%** | 100% (0 errors) |
| **GC05** | 문자열/엔티티 유출 방지 | `error` | 0 | 241 | **100.0%** | 100% (0 errors) |
| **GC06** | 스텝 수 적정성 | `error` | 0 | 241 | **100.0%** | 100% (0 errors) |
| **GC07** | 구체값/식별자 포함 | `error` | 66 | 175 | **72.6%** | 100% (0 errors) |

## 2. Category Breakdown

| Category | Total | Passed | GC01 | GC02 | GC03 | GC04 | GC05 | GC06 | GC07 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `1-getting-started` | 25 | 0 | 0 | 0 | 16 | 25 | 0 | 0 | 1 |
| `2-guides` | 77 | 0 | 71 | 71 | 58 | 77 | 0 | 0 | 47 |
| `3-api-reference` | 135 | 0 | 127 | 127 | 103 | 135 | 0 | 0 | 17 |
| `5-architecture` | 4 | 0 | 3 | 3 | 4 | 4 | 0 | 0 | 1 |

## 3. GC05 String & HTML Entity Leak Status

**Total GC05 Violations**: 0 (100% Clean in Milestone M0)