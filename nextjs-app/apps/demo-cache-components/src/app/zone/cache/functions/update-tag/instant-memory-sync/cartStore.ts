let updateTagCartQty = 3
let revalidateTagCartQty = 3

export function getUpdateTagCartQty(): number {
  return updateTagCartQty
}

export function incrementUpdateTagCartQty(): number {
  updateTagCartQty += 1
  return updateTagCartQty
}

export function getRevalidateTagCartQty(): number {
  return revalidateTagCartQty
}

export function incrementRevalidateTagCartQty(): number {
  revalidateTagCartQty += 1
  return revalidateTagCartQty
}
