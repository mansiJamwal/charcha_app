import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

type PostInputs = {
    username: string,
    post_val: string,
    sent_time: string,
    id: number
}

const Comments = () => {
    const { id } = useParams()
    useEffect(() => {
        console.log("hyello")
    }, [])
    return (
        <main className="h-screen bg-gradient-to-b  from-black to-gray-800 font-semibold flex flex-col w-full justify-center items-center text-white">
            {id &&
                <PostComponent id={parseInt(id)} username={"Adi"} sent_time={"21/10/2024:18:42:34"} post_val={"Hello wassup"} key={id} />
            }
        </main>
    )
}


function PostComponent(props: PostInputs) {

    

    // Example usage

    return (
        <li className=" rounded-[8px] w-[60%] relative  flex flex-col items-center p-5 border border-white border-opacity-10 hover:border-opacity-75">
            {/* <div className="heading flex justify-between"> */}
            <div className="user absolute top-0 left-0 m-[30px]">By {props.username},</div>
            <div className="date absolute top-0 right-0 m-6">{(props.sent_time).slice(11, 16)} Hrs</div>
            {/* </div> */}
            <h1 className='text-center text-3xl mt-5 font-medium'> Heading</h1>
            <div className="content m-16 p-5 w-full font-normal">
                {props.post_val} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore nostrum, magni magnam voluptates repellendus, eos a ab voluptas repudiandae sed perspiciatis. Placeat, saepe neque. Adipisci rem doloremque iste, quasi laborum sunt eligendi beatae alias praesentium nesciunt, temporibus consequuntur quam voluptatem maxime? Architecto expedita iste nostrum, eius nisi eaque incidunt temporibus accusantium, eum iusto amet quod deserunt quo libero ipsum quas, vel eos ducimus facilis possimus. Reprehenderit, eos ab consectetur aperiam itaque fugit facilis praesentium possimus ipsam, commodi eum quia dolorem perferendis nisi voluptatibus in voluptates? Ad, pariatur delectus tenetur excepturi totam perspiciatis magni asperiores corrupti ipsum omnis id, temporibus maiores.
            </div>
            <div className="info absolute right-0 bottom-0 m-6 w-[25px] flex gap-2">
                <img src="icons8-heart-96.png" alt="" />
            </div>
            <div className="info absolute left-0 bottom-0 m-6 w-[25px] flex gap-2">
                <img src="icons8-comment-96.png" alt="" />
            </div>
        </li>
    )
}

export default Comments