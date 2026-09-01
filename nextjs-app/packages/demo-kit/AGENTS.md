# packages/demo-kit (@study/demo-kit)

데모 zone(`demo-baseline`, `demo-cache-components`) 공통 UI 키트입니다. `DemoContainer`, `DemoGuideCard`, `DemoPlaygroundCard`, `ExpectedActualPanel`, `DemoResetButton`, `DemoDeepDiveCard` 등을 제공한다. 데모 앱에는 shadcn을 넣지 않는다 — 학습자가 읽을 코드다.

## 지켜야 할 것

1. **재사용성을 극대화한다.** `DemoContainer`, `DemoGuideCard`, `ExpectedActualPanel`, `DemoResetButton`, `DemoDeepDiveCard` 등 이 패키지의 공통 컴포넌트를 필수로 활용하여 보일러플레이트 중복을 방지하고, 데모 코드는 핵심 기능에만 집중하도록 컴팩트하게 작성한다. 4단 표준 레이아웃 자체의 정의는 [`../../apps/AGENTS.md`](../../apps/AGENTS.md)를 따른다.
