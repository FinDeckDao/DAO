import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes'
import { useAgent } from "@ic-reactor/react"

const App = () => {
  const agent = useAgent()
  console.log(agent)

  return (
    <RouterProvider router={router} />
  )
}

export default App
