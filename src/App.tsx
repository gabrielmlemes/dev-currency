import { router } from "./router"
import { Outlet, RouterProvider } from "react-router-dom"

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
