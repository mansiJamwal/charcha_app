// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Button } from "@/components/ui/button"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignUp } from './components/SignUp' 
import { SignIn } from "./components/SignIn"
import { Dashboard } from "./components/Dashboard"


function App() {
  const router = createBrowserRouter([
    {
     path:'/signup',
     element: <><SignUp/></> 
    },
    {
      path:'/signin',
      element: <><SignIn/></> 
     },
    {
      path:'/',
      element: <><Dashboard/></> 
     }
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
