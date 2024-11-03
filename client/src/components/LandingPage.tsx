// import React from 'react'
import { NavLink } from "react-router-dom"
// const LandingPage = () => {
//   return (
//     <main className="h-screen bg-gradient-to-bl from-black to-gray-900 flex gap-[20px] flex-col items-center justify-center text-white ">
//         <div className="text-[40px] ">Welcome to  <span className="font-semibold">Charcha, The Chat App</span></div>
//         <div className="w-[70%] text-center text-xl text-gray-200"> Connect, Chat, and Share in Real-Time
//          <div className="buttons flex justify-center m-8 gap-5">
//             <NavLink to={"/signup"} className="text-black font-medium bg-white p-2 px-4 rounded-[6px]">Sign Up</NavLink>
//             <NavLink to={"/signin"} className="text-black font-medium bg-white p-2 px-4 rounded-[6px]">Sign In</NavLink>
//          </div>
//         </div>
//         <div className="flex justify-between items-end w-full h-full p-5">
//           <img 
//             src="/girl.png" 
//             alt="decorative image" 
//             className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
//           />
//           <img 
//             src="/boy.png" 
//             alt="decorative image" 
//             className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
//           />
//         </div>
//     </main>
   
//   )
// }
const LandingPage = () => {
  return (
    <main className="h-screen bg-gradient-to-bl from-black to-gray-900 flex items-center justify-center text-white relative overflow-hidden">
      <div className="z-10 flex flex-col items-center text-center space-y-6">
        <div className="text-[40px] md:text-[50px]">
          Welcome to <span className="font-semibold">Charcha, The Chat App</span>
        </div>
        <div className="w-[80%] md:w-[60%] text-lg md:text-xl text-gray-200">
          Connect, Chat, and Share in Real-Time
        </div>
        <div className="flex gap-5">
        <NavLink to={"/signup"} className="text-black font-medium bg-white p-2 px-4 rounded-[6px]">Sign Up</NavLink>
        <NavLink to={"/signin"} className="text-black font-medium bg-white p-2 px-4 rounded-[6px]">Sign In</NavLink>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 transform translate-x-[-10%] translate-y-5 md:translate-y-10">
        <img
          src="/girl.png"
          alt="Girl"
          className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]"
        />
      </div>
      <div className="absolute bottom-0 right-0 transform translate-x-[10%] translate-y-5 md:translate-y-10">
        <img
          src="/boy.png"
          alt="Boy"
          className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]"
        />
      </div>
    </main>
  );
};

export default LandingPage