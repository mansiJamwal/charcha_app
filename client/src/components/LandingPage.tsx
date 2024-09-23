// import React from 'react'
import { NavLink } from "react-router-dom"
const LandingPage = () => {
  return (
    <main className="h-screen bg-gradient-to-bl from-black to-gray-900 flex gap-[20px] flex-col items-center justify-center text-white ">
        <div className="text-[40px] ">Welcome to  <span className="font-semibold">Charcha, The Chat App</span></div>
        <div className="w-[70%] text-center text-xl text-gray-200">This is a social media application, where you can interact with all the Users on this Platform.
         <div className="buttons flex justify-center m-8 gap-5">
            <NavLink to={"/signup"} className="text-black font-medium bg-white p-2 px-4 rounded-[6px]">Sign Up</NavLink>
            <NavLink to={"/signin"} className="text-black font-medium bg-white p-2 px-4 rounded-[6px]">Sign In</NavLink>
         </div>
        </div>
    </main>
   
  )
}

export default LandingPage