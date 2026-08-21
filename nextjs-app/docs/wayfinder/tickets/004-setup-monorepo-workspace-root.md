# [T04] 모노레포 워크스페이스 루트 및 @study/docs 패키지 뼈대 구성

- **라벨**: `wayfinder:task`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Open (Frontier)
- **차단 중**:
  - [T05. @study/demos 패키지 구성 및 유효성 검사기 구현](./005-setup-packages-demos.md)
  - [T06. @study/ui 및 @study/docs-render 패키지 구현](./006-setup-shared-ui-and-render-packages.md)
  - [T07. apps/shell 앱 생성 및 라우팅/rewrites 결합](./007-setup-apps-shell.md)

## Question

모노레포의 루트 파일들과 `nextjs-docs` 패키지화 작업을 표준 절차([01. 3-1])에 따라 정확히 구성할 수 있는가?

### 작업 목록
1. **저장소 루트 `package.json`**: `private: true`, `packageManager: "pnpm@10.33.0"`, turbo scripts
2. **저장소 루트 `pnpm-workspace.yaml`**:
   - `packages`: `nextjs-docs`, `nextjs-app/apps/*`, `nextjs-app/packages/*`
   - `catalog`: `next: 16.3.1`, `react: 19.2.8`, `react-dom: 19.2.8`, `@types/react: ^19.2.0`, `@types/react-dom: ^19.2.0`
3. **저장소 루트 `turbo.json`**:
   - `build` (`dependsOn: ["^build"]`, `outputs`, `env: ["ZONE_*_URL"]`)
   - `dev` (`cache: false`, `persistent: true`)
   - `lint`, `check-types`
4. **`nextjs-docs/package.json` 및 `scripts/build-manifest.mjs`**:
   - name: `@study/docs`
   - 전체 291개 md 문서를 스캔하여 목차 트리(`docs-manifest.json`)를 생성하는 빌드 태스크 구현
