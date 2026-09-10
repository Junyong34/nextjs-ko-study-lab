export interface ManifestSeoSourceDocument {
  path: string
  title: string
  content: string
}

export interface ManifestSeoDocument extends ManifestSeoSourceDocument {
  seoTitle: string
  description: string
}

export function normalizeInlineMarkdown(value: string): string
export function deriveDocumentSeo(docs: ManifestSeoSourceDocument[]): ManifestSeoDocument[]
