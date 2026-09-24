import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { getProduct, INJECTION_MARKER } from './product-data'
import { buildProductJsonLd, PRODUCT_SCRIPT_ID, serializeJsonLdSafe } from './json-ld'
import { ProductDetail } from './components/ProductDetail'
import { JsonLdLab } from './components/JsonLdLab'
import { JsonLdConceptCard } from './components/JsonLdConceptCard'

/** 서버 컴포넌트: 상품 데이터로 JSON-LD를 만들어 이 페이지 HTML에 직접 렌더한다. */
export default async function DemoPage() {
  const product = await getProduct('KB-104')
  const jsonLd = buildProductJsonLd(product)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Schema.org Product 구조화 데이터 (JSON-LD)"
        concept="page.tsx(서버 컴포넌트)가 렌더한 <script type=&quot;application/ld+json&quot;>은 첫 HTML 응답에 그대로 들어가 JS 없이도 크롤러가 읽는다. 단, 본문은 HTML 파서가 먼저 보므로 상품 데이터 속 '<'를 이스케이프하지 않으면 </script>에서 경계가 끊긴다."
        steps={[
          {
            step: 1,
            title: '[HTML 원문 다시 받아 JSON-LD 검사] 클릭',
            description:
              '이 페이지 HTML을 cache: no-store로 다시 받아 DOMParser로 파싱하고, #product-jsonld의 위치와 JSON.parse 결과를 서버 상품 레코드와 필드별로 대조합니다.',
            actionBadge: 'SSR 실측',
            observe: 'body 안 위치, offers.price 149000, 날것 < 0개와 이스케이프 개수',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[치환 전/후 파싱 대조] 클릭',
            description:
              '같은 상품 객체를 치환 없이/치환해서 직렬화한 뒤 격리된 DOMParser 문서에서 파싱합니다. 치환 전에는 description의 </script>에서 script가 닫히고 주입 요소가 생깁니다.',
            actionBadge: '이스케이프 대조',
            observe: '치환 전 JSON.parse 실패·주입 요소 1개, 치환 후 파싱 성공·주입 0개',
            observeAt: 'verification',
          },
        ]}
      />

      <JsonLdLab product={product} jsonLd={jsonLd} injectionMarker={INJECTION_MARKER}>
        <section aria-label="상품 상세">
          {/* 공식 가이드 방식: page에서 네이티브 script로 렌더 + '<' 이스케이프 */}
          <script
            id={PRODUCT_SCRIPT_ID}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(jsonLd) }}
          />
          <ProductDetail product={product} />
        </section>
      </JsonLdLab>

      <JsonLdConceptCard />
    </DemoContainer>
  )
}
