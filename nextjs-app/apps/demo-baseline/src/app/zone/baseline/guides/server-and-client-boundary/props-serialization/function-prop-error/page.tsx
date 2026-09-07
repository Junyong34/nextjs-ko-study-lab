import { connection } from 'next/server'
import { InvalidValueReceiver } from '../components/InvalidValueReceiver'

function selectProduct() {
  return '스마트워치'
}

export default async function FunctionPropErrorPage() {
  await connection()

  return <InvalidValueReceiver label="일반 함수" value={selectProduct} />
}
