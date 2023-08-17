import { createContext } from 'react'
import { clientDi } from './container'

const ContainerContext = createContext<typeof clientDi>({})
export default ContainerContext
