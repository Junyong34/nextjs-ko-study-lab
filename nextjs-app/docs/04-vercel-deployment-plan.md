# 04. Vercel 배포 계획

현재 배포 구성과 운영 절차, 과거 검증 기록, 남은 확인 사항을 구분한다. 2026-09-05 코드·설정과 공식 자료를 대조했다. Vercel 대시보드의 현재 값이나 운영 사이트를 이번에 재검증하지는 않았다.

## 1. 배포 구성 원칙

셸과 두 데모 zone은 각각 별도 프로젝트로 배포하며 셸이 rewrites로 연결한다.

| 코드가 조회하는 프로젝트명 | Root Directory | 역할 |
|---|---|---|
| `study-shell` | `nextjs-app/apps/shell` | 학습자 도메인, 문서, 데모 뷰어 |
| `study-baseline` | `nextjs-app/apps/demo-baseline` | baseline zone |
| `study-cache` | `nextjs-app/apps/demo-cache-components` | cache zone |

각 앱의 `vercel.json`에는 연결 프로젝트 ID가 들어 있다. 프로젝트를 재생성하거나 이름을 변경하면 ID와 `next.config.ts`의 `projectName`을 함께 대조한다. 새 zone 등록은 [05](./05-zone-onboarding-checklist.md)를 따른다.

## 2. 프로젝트별 빌드 설정

워크스페이스 루트는 저장소 루트다. 루트 `package.json`은 pnpm 10.33.0, Node.js `>=22.9.0`을 선언한다.

| 설정 | 확인할 내용 |
|---|---|
| Framework | Next.js |
| Root Directory | 위 표의 앱 디렉토리 |
| 설치 | 루트 lockfile과 `packageManager`를 사용하는지 확인 |
| 빌드 | 기존 배포 계획의 `turbo run build`와 대시보드 실제 Build Command·로그를 대조 |
| 외부 소스 포함 | Root Directory 밖의 공유 패키지와 `nextjs-docs`가 빌드에 포함되는지 확인 |
| 산출물 | 문서 원본·이미지 및 zone CSS/JS가 배포 산출물에서 제공되는지 확인 |

`Ignored Build Step`의 기존 제안은 `npx turbo-ignore --fallback=HEAD^1`이다. 저장소에는 대시보드 적용 증거가 없으므로 현재 설정값이나 자동 기본값으로 단정하지 않는다. 원격 캐시 연결 여부도 실제 빌드 로그로 확인한다.

## 3. 환경변수 배치

### 3-1. 현재 Production 운영 절차

2026-09-01 첫 배포 기록에서는 수동 Production 환경변수를 넣고 재배포해 zone 연결 오류를 해결했다. 현재 코드에서도 이 값들은 `withRelatedProject`의 `defaultHost`로 사용된다.

| 앱 | 변수 | 형식과 용도 |
|---|---|---|
| shell | `ZONE_BASELINE_URL` | baseline 배포 URL. 예: `https://<baseline-host>` |
| shell | `ZONE_CACHE_URL` | cache 배포 URL. 예: `https://<cache-host>` |
| 두 데모 앱 | `PUBLIC_ORIGIN` | 학습자가 접속하는 셸 host. **스킴·경로 없이** 지정. 커스텀 도메인 사용 시 그 host와 대조 |
| 세 앱 | `NEXT_PUBLIC_SITE_URL` | canonical·OG 등에 쓸 공개 사이트 URL. 미지정 시 공유 메타데이터 모듈의 기본값 사용 |

셸은 `ZONE_*_URL`의 스킴을 제거한 뒤 Vercel에서는 `https`, 로컬에서는 `http`를 붙인다. 데모 앱은 `PUBLIC_ORIGIN`을 스킴 제거 없이 `allowedOrigins`에 전달하므로 URL 전체를 넣지 않는다. 환경변수를 수정하면 영향을 받는 앱을 재빌드·재배포한다.

### 3-2. Related Projects와 Preview

코드는 Related Projects의 host 조회를 유지한다. 셸은 두 zone을, 각 zone은 셸을 조회한다. 수동 환경변수는 조회 결과를 강제로 덮어쓰는 값이 아니라 폴백이다.

Vercel은 프로젝트 ID로 연결한 앱 간 Preview·Production 배포 URL 자동 연결을 안내한다. 이 기능 자체가 Production에서 지원되지 않는다는 뜻은 아니다. [공식 발표](https://vercel.com/changelog/sync-projects-with-vercel-related-projects) (확인: 2026-09-05)

이 저장소에서는 Preview의 양방향 연결을 아직 검증하지 않았다. Production URL을 Preview에 그대로 복사해 PR 변경이 연결됐다고 판단하지 않는다. 셸 rewrite 목적지와 두 zone의 허용 origin이 해당 Preview 조합에 맞는지 함께 확인해야 한다.

## 4. 브랜치별 자동 배포 제어

세 앱의 `vercel.json`은 다음 규칙을 가진다.

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview/*": true,
      "**": false
    }
  }
}
```

설정 의도는 `main`과 `preview/*`만 자동 배포하는 것이다. Vercel은 minimatch 패턴을 사용하며, 여러 규칙 중 하나라도 `true`이면 배포한다고 설명한다. 미지정 브랜치는 기본 허용이므로 전체 차단 패턴을 함께 둔다. [Git Configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled) (확인: 2026-09-05)

실제 브랜치 push에 따른 배포·스킵은 아직 확인하지 않았다. 코드 설정과 서비스에서 관찰한 결과를 구분한다.

## 5. 빌드 캐시와 변경 반영

`turbo.json`의 build 작업은 `^build`를 선행 실행하고 `.next`, `dist`, 두 매니페스트를 출력으로 선언한다. `ZONE_*_URL`, `PUBLIC_ORIGIN`, `VERCEL_RELATED_PROJECTS`는 build의 환경변수 목록에 들어 있다.

`NEXT_PUBLIC_SITE_URL`은 이 명시 목록에 없다. 프레임워크 추론을 포함한 실제 캐시 입력과 세 앱의 새 URL 반영은 도메인 변경 배포에서 별도로 확인한다. 캐시 입력을 확인하지 않고 “설정 파일 한 곳을 바꾸면 배포 전체가 즉시 갱신된다”고 설명하지 않는다.

## 6. 배포 검증 절차

1. 프로젝트명·ID·Root Directory와 환경별 변수를 대조한다.
2. zone 두 앱과 셸을 배포하고 빌드 로그·배포 URL·커밋을 기록한다.
3. 문서 본문과 `/docs-assets/*` 이미지, 셸의 `/zone/*` 및 `/demo-static/*` 요청을 확인한다.
4. 각 zone을 직접 요청한 결과와 셸 프록시 결과를 비교한다. 셸의 HTML 응답만으로 iframe 성공을 판정하지 않는다.
5. 실제 학습자 도메인에서 Server Action 요청과 응답을 확인한다.
6. Production과 Preview를 각각 기록한다. SEO 확인은 [07](./07-seo-plan.md)을 따른다.

## 7. 과거 검증 기록

2026-09-01 첫 배포 기록: shell 빌드에 `VERCEL_RELATED_PROJECTS`가 채워지지 않아 `defaultHost`가 `localhost:3001`·`3002`로 떨어졌고, rewrite 요청에서 `DNS_HOSTNAME_RESOLVED_PRIVATE` 404가 발생했다. Production 환경변수를 수동 등록하고 재배포해 해결했다고 기록돼 있다.

이는 저장소에 남은 과거 관찰이다. 당시 자동 주입 실패의 일반 원인이나 현재 서비스 상태까지 확인한 기록으로 확대하지 않는다.

## 8. 남은 리스크 / 다음 확인 사항

- Preview 프로젝트 간 URL 연결과 Server Action origin 정합성
- `main`, `preview/*`, 작업 브랜치의 실제 배포·스킵 결과
- 현재 대시보드 빌드 명령·Ignored Build Step·원격 캐시 설정
- 도메인 변경 시 세 앱의 메타데이터·캐시 반영
- CLI 일괄 연결 절차: 기존에는 대시보드 경로만 검증 기록이 있음

위 항목은 별도 운영 검증에서 닫는다. 이 문서 정비에서는 배포·환경변수 변경·브랜치 push를 수행하지 않았다.
