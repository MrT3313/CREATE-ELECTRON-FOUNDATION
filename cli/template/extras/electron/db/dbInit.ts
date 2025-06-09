import { dbConnect } from './dbConnect'
export const dbInit = async () => {
  await import('./controller/index.ts')
  await dbConnect()
}
