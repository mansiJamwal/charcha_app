import { useEffect, useState, useRef } from 'react'
// import { NavLink } from "react-router-dom"
// import { Input } from "./ui/input"
import { Calendar } from "./ui/calendar"

// import { Button } from "./ui/button"
// import React from "react"
type PostInputs = {
    message: string,
}
export const Posts = () => {
   

    const wsRef = useRef<WebSocket | null>(null)


    const [posts, setPosts] = useState<PostInputs[]>([
        {
            message: "sample post 1 awidiwuaohd aowdiaoi wd awoihdoiaw doaw hdoiaw hdoiawhoidhawoidhaoih doiawh doiawhd aoiwdhawoid "
        },
        {
            message: "sample post 2"
        }
    ])
    

    useEffect(() => {
        wsRef.current = new WebSocket(
            'ws://'
            + '127.0.0.1:8000'
            + '/ws/posts/public/'
        )
        wsRef.current.onopen = () => console.log("ws opened")

        wsRef.current.onclose = () => console.log("ws closed")

        wsRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data)
            setPosts((p)=>{
                return [...p, {
                    message: data.message
                }]
            })
            
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    useEffect(()=>{
        console.log(posts)
    },[posts])

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [addPostActive, setAddPostActive] = useState<boolean>(false)
    const [postval, setPostVal]=useState<string>('');

    function submitfunc(){
        console.log(postval)
        if(wsRef.current) {
            wsRef.current.send(JSON.stringify({
                'message': postval
            }));
        }
        // setPosts([...posts, { message: data.message }])
        setAddPostActive(false)
        setPostVal('');
    }

    return (
        <>

            <main className="h-screen bg-gradient-to-b from-black to-gray-950 font-semibold flex flex-col  items-center text-white">
                <div className=" text-3xl mt-16">Share Your Thoughts, Ideas, and Stories with the Community!</div>
                <div className="flex justify-around bg-gradient-to-b from-black to-gray-800 w-full  h-full items-center">
                    <div className="flex flex-col  gap-5  m-4 my-8">
                        <h1 className='text-2xl'>Filter by:</h1>
                        <div className="user flex items-center gap-4">
                            <label htmlFor="user">User:</label>
                            <select name='user' id='user' className='  bg-black p-2 w-[60%] border-[0.1px] rounded-[5px] border-opacity-25 border-white ' >
                                <option value="Aaditya">Aaditya</option>
                                <option value="Mansi">Mansi</option>
                                <option value="Sahil">Sahil</option>
                            </select>
                        </div>
                        <div className="category flex items-center gap-4">
                            <label htmlFor="category">Category</label>
                            <select name='category' id='category' className='  bg-black p-2 w-[60%] border-[0.1px] rounded-[5px] border-opacity-25 border-white'>
                                <option value="entertainment">Entertainment</option>
                            </select>
                        </div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border "
                        />
                        {/* <Button className="p-6 text-[16px] px-8 rounded-[6px]" type="submit">Search</Button> */}
                    </div>
                    <div className="messages w-[50%]  h-[70vh] ">
                        <h1 className='text-[26px]'>Community Chat</h1>
                        <ul className="font-normal flex flex-col p-2 items-center gap-5 overflow-auto h-[70vh] ">
                            {posts.map(post => {
                                return <PostComponent message={post.message} key={post.message} />
                            })}
                            {/* <PostComponent message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Non impedit debitis libero illum asperiores adipisci repellendus ipsum hic corporis commodi."} /> */}
                        </ul>
                    </div>
                    <button onClick={() => {
                        setAddPostActive(true)

                    }} className='addPost flex items-center justify-center fixed bottom-0 right-0 m-8 w-[60px] h-[60px] rounded-[15px] overflow-hidden border-[4px] border-black opacity-80 '>
                        <img className='scale-125' src="post.png" alt="" />
                    </button>

                </div>

                {/* <div className="text-md font-normal text-xl p-4">:</div> */}
            </main>

            {
                addPostActive
                    ?
                    <div className="addPost top-0 left-0 fixed z-10 flex justify-center items-center h-screen w-screen bg-black bg-opacity-70 ">
                        <div className="cross fixed top-0 right-0" onClick={() => {
                            setAddPostActive(false)
                        }}>
                            <img src="icons8-cross-96.png " className='w-[30px] m-4' alt="" />
                        </div>
                        <div className='bg-[#242424]  w-[40%] h-[55vh] rounded-xl flex justify-center items-center '>

                            <form className='w-[90%]   h-[90%] flex flex-col justify-around  items-center' >
                                <textarea onChange={(e)=>{
                                    setPostVal(e.target.value);
                                }} className='bg-[#151515] rounded-[10px] w-full p-4 h-[80%] text-white ' placeholder='Express your thoughts here...' name="message" id="message" />
                                <button className='bg-[#131313]  text-white p-3 px-5 rounded-[5px]' onClick={submitfunc} >Post</button>
                            </form>
                        </div>
                    </div>
                    :
                    <></>
            }


        </>
    )
}


function PostComponent({ message }: {
    message: string
}) {
    return (
        <li className=" rounded-[8px] w-full relative  flex items-center p-5 border border-white border-opacity-10 hover:border-opacity-75 min-h-[150px]">
            {/* <div className="heading flex justify-between"> */}
            <div className="user absolute top-0 left-0 m-6">Aaditya</div>
            <div className="date absolute top-0 right-0 m-6">Time: 2:00 IST</div>
            {/* </div> */}
            <div className="content m-10 p-5 w-full ">
                {message}
            </div>
            <div className="info absolute right-0 bottom-0 m-6">Like</div>
        </li>
    )
}