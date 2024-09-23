// import React from 'react'
import { NavLink } from "react-router-dom"

const NotFound = () => {
  return (
    <main className="h-screen bg-gradient-to-bl from-black to-gray-900  text-[40px] font-semibold flex flex-col justify-center items-center text-white">
        <div>Error 404</div>
        <div>Page Not Found</div>
        <div className="text-md font-normal text-xl p-4">Click <NavLink to={"/"} className="text-xl text-blue-400"> Here</NavLink> to visit the Home Page</div>
    </main>
  )
}

export default NotFound