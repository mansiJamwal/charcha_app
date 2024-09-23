// import React from 'react'
// import { NavLink } from "react-router-dom"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
// import React from "react"

export const Posts = () => {
    return (
        <main className="h-screen bg-gradient-to-bl from-black to-gray-900 font-semibold flex flex-col  items-center text-white">
            <div className=" text-3xl mt-20">Share Your Thoughts, Ideas, and Stories with the Community!</div>
            {/* <div>Page Not Found</div> */}
            <div className="flex w-[60%] gap-3  items-center m-4 my-8">
                <Input className="w-full rounded-[6px] p-5 border-opacity-25 hover:border-opacity-100" type="email" placeholder="Search for Users, Categories" />
                <Button className="p-6 text-[16px] px-8 rounded-[6px]" type="submit">Search</Button>
            </div>
            <div className="messages w-[55%] flex justify-center  h-[65vh] ">
                <ul className="font-normal flex flex-col p-2 items-center gap-5 overflow-auto h-[65vh] ">
                    <PostComponent/>
                    <PostComponent/>
                    <PostComponent/>
                    <PostComponent/>
                    <PostComponent/>
                </ul>
            </div>
            {/* <div className="text-md font-normal text-xl p-4">:</div> */}
        </main>
    )
}


function PostComponent() {
    return (
        <li className=" rounded-[8px] w-full relative text-center p-5 border border-white border-opacity-10 hover:border-opacity-75">
            <div className="heading flex justify-between"> 
                <div className="user">Aaditya</div>
                <div className="date">27/06</div>
            </div>
            <div className="content p-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non impedit debitis libero illum asperiores adipisci repellendus ipsum hic corporis commodi.
            </div>
            <div className="info absolute right-2 bottom-2 ">Like</div>
        </li>
    )
}