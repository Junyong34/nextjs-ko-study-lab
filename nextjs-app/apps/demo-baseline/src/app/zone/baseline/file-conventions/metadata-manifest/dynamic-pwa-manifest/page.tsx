import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataManifestDemo } from './components/MetadataManifestDemo'
import { DEFAULT_PRESET_ID, MANIFEST_ENDPOINT, MANIFEST_THEME_COOKIE } from './theme-presets'

// Metadata API의 `manifest` 필드에 이 데모의 실제 엔드포인트를 넣으면 Next.js가
// 이 페이지의 <head>에 <link rel="manifest" href="..."> 를 실제로 주입한다
// (node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts의 manifest 필드 참고).
export const metadata: Metadata = {
  ...getDemoMetadata('baseline', 'file-conventions/metadata-manifest/dynamic-pwa-manifest'),
  manifest: MANIFEST_ENDPOINT,
}

export default async function DemoPage() {
  // 이 페이지 자체도 request-time API(cookies())를 읽어 초기 화면을 서버에서 채운다 —
  // 클라이언트에서 useState 기본값으로 흉내 내지 않는다.
  const cookieStore = await cookies()
  const initialPresetId = cookieStore.get(MANIFEST_THEME_COOKIE)?.value ?? DEFAULT_PRESET_ID

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="manifest.ts 동적 PWA 웹 매니페스트"
        concept="manifest.ts는 MetadataRoute.Manifest 객체를 반환하는 특수 파일이지만, Next.js는 이를 app 루트에서만 라우팅한다. 이 데모는 같은 세그먼트의 실제 Route Handler가 그 함수를 그대로 호출해 응답하게 만들고, 테마 프리셋을 고르면 쿠키(request-time API)를 거쳐 실제 JSON 응답의 theme_color가 바뀌는 과정을 fetch로 실측한다."
        steps={[
          {
            step: 1,
            title: '[테마 프리셋] 버튼 클릭',
            description:
              'Server Action(actions.ts)이 실행돼 cookies().set()으로 실제 Set-Cookie 응답 헤더를 보낸다. 화면의 state가 아니라 브라우저 쿠키 저장소에 값이 남는다.',
            actionBadge: 'Server Action',
          },
          {
            step: 2,
            title: '[manifest.webmanifest 다시 요청] 클릭',
            description:
              '실제 GET 요청이 manifest.webmanifest/route.ts로 전송된다. 이 라우트는 manifest.ts의 함수를 그대로 호출하고, 그 함수는 cookies()로 방금 저장한 프리셋을 읽어 theme_color/background_color를 계산한다.',
            actionBadge: '실제 요청',
            observe: '응답 JSON의 theme_color/background_color가 고른 프리셋과 일치하는지',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '개발자 도구 Network 탭에서 대조',
            description:
              '주소창 상단 배지의 실제 엔드포인트 URL을 새 탭으로 열거나 Network 탭에서 확인하면, 이 화면이 보여준 JSON과 동일한 원본 응답을 볼 수 있다.',
            actionBadge: '실측 교차검증',
          },
        ]}
      />
      <DemoPlaygroundCard title={`manifest.ts → ${MANIFEST_ENDPOINT}`}>
        <MetadataManifestDemo initialPresetId={initialPresetId} />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
