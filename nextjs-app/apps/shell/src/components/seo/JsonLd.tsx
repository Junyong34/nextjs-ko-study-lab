export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // 데이터는 항상 이 앱이 생성한 구조화 데이터이지만, `</script>` 시퀀스로 인한 파싱 이슈를 막기 위해 이스케이프한다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
