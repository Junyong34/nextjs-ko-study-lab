'use server'

export interface DemoItem {
  id: string
  text: string
  createdAt: string
  serverTimestamp: number
}

// In-memory store for baseline demo server action
let itemsStore: DemoItem[] = []

export async function getItems(): Promise<DemoItem[]> {
  return itemsStore
}

export async function addItem(
  formData: FormData,
): Promise<{ success: boolean; items: DemoItem[]; error?: string }> {
  const text = formData.get('itemText')?.toString().trim()

  if (!text) {
    return {
      success: false,
      items: itemsStore,
      error: '항목 내용을 입력해주세요.',
    }
  }

  // Artificial short delay to simulate server mutation processing
  await new Promise((resolve) => setTimeout(resolve, 60))

  const newItem: DemoItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    createdAt: new Date().toLocaleTimeString('ko-KR'),
    serverTimestamp: Date.now(),
  }

  itemsStore = [newItem, ...itemsStore]
  return { success: true, items: itemsStore }
}

export async function resetItems(): Promise<{ success: boolean; items: DemoItem[] }> {
  itemsStore = []
  return { success: true, items: itemsStore }
}
