import type { LearningInventory } from './types.ts'

interface InventoryDoc {
  path: string
  url: string
  title: string
  slug: string[]
}

interface InventoryTreeNode {
  title: string
  path: string
  url: string
  children?: InventoryTreeNode[]
}

interface InventoryDemo {
  url: string
  title: string
  doc: string
  status: string
}

export interface LearningInventoryManifest {
  docs: InventoryDoc[]
  tree: InventoryTreeNode[]
}

function isCategoryHome(path: string): boolean {
  return path === 'README.md' || path.endsWith('/README.md')
}

function findDocument(
  docs: InventoryDoc[],
  node: InventoryTreeNode,
): InventoryDoc | undefined {
  return docs.find((doc) => doc.path === node.path && doc.url === node.url)
}

export function createLearningInventory(
  manifest: LearningInventoryManifest,
  demos: readonly InventoryDemo[],
): LearningInventory {
  const documents: LearningInventory['documents'] = []
  const seenDocumentKeys = new Set<string>()

  const visit = (node: InventoryTreeNode, category: string) => {
    if (!isCategoryHome(node.path)) {
      const doc = findDocument(manifest.docs, node)
      if (doc && !seenDocumentKeys.has(doc.path)) {
        seenDocumentKeys.add(doc.path)
        documents.push({
          kind: 'document',
          key: doc.path,
          title: doc.title,
          url: doc.url,
          category,
        })
      }
    }

    for (const child of node.children ?? []) visit(child, category)
  }

  for (const rootNode of manifest.tree) {
    if (rootNode.path === 'README.md') continue
    visit(rootNode, rootNode.title)
  }

  const demosInInventory = demos
    .filter((demo) => demo.status === 'done')
    .map((demo) => {
      const connectedDocument = documents.find(
        (doc) => doc.key === demo.doc || doc.key.endsWith(demo.doc),
      )
      return {
        kind: 'demo' as const,
        key: demo.url,
        title: demo.title,
        url: `/demo/${demo.url}`,
        category: connectedDocument?.category ?? '기타',
        docPath: demo.doc,
      }
    })

  return { documents, demos: demosInInventory }
}
