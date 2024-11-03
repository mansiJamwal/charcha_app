import axios, { AxiosResponse, AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate, Link } from 'react-router-dom'

type CategoryType = {
    id: number,
    category_name: string,
    postId: number
}

type PostInputs = {
    username: string,
    post_val: string,
    sent_time: string,
    id: number,
    heading: string,
    likes: number,
    allCategories: CategoryType[]
}

type CommentInput = {
    id: number,
    postId: number,
    username: string,
    comment_val: string,
    sent_time: string
}


const Comments = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [post, setPost] = useState<PostInputs>({
        username: 'user',
        post_val: 'sample text',
        sent_time: "21/10/2024:18:42:34",
        id: 0,
        heading: "Heading",
        likes: 0,
        allCategories: []
    })
    const [allCategories, setAllCategories] = useState<CategoryType[]>([])

    const [comments, setComments] = useState<CommentInput[]>([])
    const [inputComment, setInputComment] = useState<string>('')
    const [commentError, setCommentError] = useState<boolean>(false)

    async function getPost() {
        console.log(id)
        try {
            const res = await axios.get("http://localhost:8000/posts/post/", {
                params: {
                    postId: id
                }
            })
            if (res.data == post) {
                return
            }
            // console.log('hi')
            setPost(res.data)
            // console.log(res.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    console.log("Post not found. Status code:", error.response.status);
                    navigate("/*")
                } else {
                    console.log("An error occurred:", error.message);
                }
            } else {
                console.log("An unexpected error occurred:", error);
            }
        }


    }

    async function getCategories() {
        const res = await axios.get('http://127.0.0.1:8000/posts/categories/')
        const resCat = res.data;

        setAllCategories(() => {
            const categories = resCat.categories || []
            return categories
        })
    }

    async function getComments() {
        const res = await axios.get("http://localhost:8000/posts/comments/", {
            params: {
                postId: id
            }
        })
        const resComments: CommentInput[] = res.data.comments
        // console.log(res.data)
        setComments(resComments.sort((a, b) =>
            a.sent_time < b.sent_time ? 1 : -1
        ))
    }

    async function submitfunc(event: React.FormEvent) {
        event.preventDefault()
        if (inputComment.length > 0) {
            const res = await axios.post("http://localhost:8000/posts/comments/", {
                username: localStorage.getItem("username"),
                postId: post.id,
                comment_val: inputComment
            })
            const newComment: CommentInput = res.data.comment
            setComments([...comments, newComment].sort((a, b) =>
                a.sent_time < b.sent_time ? 1 : -1
            ))

        } else {
            setCommentError(true)
            setTimeout(() => {
                setCommentError(false)
            }, 2000);
        }
        setInputComment('')
    }



    useEffect(() => {
        if(!localStorage.getItem('token')) navigate('/signup')
        getPost()
        getCategories()
        getComments()
    }, [])
    return (
        <main className="min-h-screen bg-gradient-to-b from-black to-gray-900  flex flex-col w-full  items-center text-white">
             <img src="/gpt2.jpg" alt="" className="fixed top-0 w-full scale-125 opacity-20 z-[0]" />
            <Link to={"/posts"} className=' flex items-center justify-center fixed top-0 left-0 m-8 p-2 px-3 bg-[#bfc8e0] text-black font-medium border border-black rounded-[15px] o '>
            All Posts
            </Link>
            {
                post.id != 0 ?
                    <>
                        <div className=' m-[100px] mb-0 p-6 font-medium text-lg'>{post.sent_time.slice(0, 10)}</div>
                        <PostComponent likes={post.likes} heading={post.heading} allCategories={allCategories} id={post.id} username={post.username} sent_time={post.sent_time} post_val={post.post_val} />

                    </>

                    :
                    <>
                        <div className='w-full h-screen flex justify-center items-center text-xl'>Loading...</div>
                    </>
            }
            <div className='text-2xl z-10'>Comments</div>
            <div className="addcomment z-10  w-[80%] p-4 flex gap-5 items-center justify-center">
                <div className='w-[50%]'>
                    <input type="text" className='w-full bg-slate-200 text-black rounded-[6px] p-2 px-4' placeholder='Enter Comment Here' onChange={(e) => {
                        setInputComment(e.target.value)
                    }} value={inputComment} />
                </div>

                <button onClick={submitfunc} className='bg-[#9ea9c4] p-4 py-2 rounded-[6px] text-black font-medium' type='button'>Add Comment</button>
            </div>
            {commentError && <div className='text-red-600 text-sm'>Comment Box is Empty!</div>}

            {
                (comments.length > 0 && post.id != 0) ?
                    comments.map(comment => {
                        return <CommentComp key={comment.id} postId={post.id} id={comment.id} username={comment.username} sent_time={comment.sent_time} comment_val={comment.comment_val} />

                    })


                    :
                    <>
                        <div className='w-full h-[200px] mb-10 flex justify-center items-center text-xl'>Be the first one to comment!</div>
                    </>
            }

        </main>

    )
}


function PostComponent(props: PostInputs) {

    const [postLikes, setPostLikes] = useState<number>(props.likes)
    const [heartUrl, setHeartUrl] = useState("/notliked.png")
    const [categories, setCategories] = useState<CategoryType[]>([])



    function convertToIST(time: string) {
        const [hour, minute] = time.split(':').map(Number);

        // Create a Date object for the current date in UTC
        const date = new Date();
        date.setUTCHours(hour, minute);

        // Add 5 hours and 30 minutes for IST
        date.setMinutes(date.getMinutes() + 330);

        // Format the new time in HH:MM format
        const istHour = date.getUTCHours().toString().padStart(2, '0');
        const istMinute = date.getUTCMinutes().toString().padStart(2, '0');

        return `${istHour}:${istMinute}`;
    }

    async function toggleLike() {
        if (heartUrl === "/notliked.png") {
            setHeartUrl("/liked.png")
            setPostLikes(postLikes + 1)
            await axios.post(`http://127.0.0.1:8000/posts/like/`,
                {
                    username: localStorage.getItem('username'),
                    postId: props.id,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                })
        } else {
            setHeartUrl("/notliked.png")
            setPostLikes(postLikes - 1)
            await axios.delete(`http://127.0.0.1:8000/posts/like/`, {
                params: {
                    username: localStorage.getItem('username'),
                    postId: props.id,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
        }
    }
    useEffect(() => {
        async function checkLike() {
            const res = await axios.get(`http://127.0.0.1:8000/posts/like/`, {
                params: {
                    username: localStorage.getItem('username'),
                    postId: props.id,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            // console.log(res.data.message, props.id)
            if (res.data.message === "Liked") {
                setHeartUrl('/liked.png')
            } else {
                setHeartUrl('/notliked.png')
            }
        }
        checkLike()
        console.log(postLikes)
    }, [])

    useEffect(() => {
        let filteredCategories = props.allCategories.filter((category) => {
            if (category.postId === props.id) return category
        })

        setCategories(filteredCategories)

    }, [props.allCategories])

    // Example usage



    // Example usage

    return (
        <li className=" w-[70%] mb-10 bg-[#0f1117e8] rounded-[8px]  relative  flex flex-col items-center p-5 border border-white border-opacity-10 hover:border-opacity-75">
            {/* <div className="heading flex justify-between"> */}
            <div className="user absolute top-0 left-0 m-[30px]">By {props.username},</div>
            <div className="date absolute top-0 right-0 m-6  flex gap-2 items-center">
                {
                    categories.length ?
                        categories.map(category => {
                            return <div key={category.id} className='bg-gray-800 p-1 px-3 rounded-2xl'>{category.category_name}</div>
                        })
                        :
                        <></>
                }
                {convertToIST((props.sent_time).slice(11, 16))} Hrs
            </div>
            {/* </div> */}
            <h1 className='text-center text-[28px] mt-8 pt-4 font-medium'> {props.heading} </h1>
            <div className="content m-12 mt-6 p-5 w-full font-normal">
                {props.post_val}
            </div>
            <div className="info absolute right-0 items-center justify-center bottom-0 m-4 flex gap-2">
                {postLikes}
                <div onClick={toggleLike} className='w-[22px] cursor-pointer'>
                    <img src={heartUrl} alt="" />
                </div>
            </div>
            <Link to={"/posts/" + props.id.toString()} className="info absolute left-0 bottom-0 m-6 w-[25px] flex gap-2">
                <img src="/icons8-comment-96.png" alt="" />
            </Link>
        </li>
    )
}


function CommentComp(props: CommentInput) {
    function convertToIST(time: string) {
        const [hour, minute] = time.split(':').map(Number);

        // Create a Date object for the current date in UTC
        const date = new Date();
        date.setUTCHours(hour, minute);

        // Add 5 hours and 30 minutes for IST
        date.setMinutes(date.getMinutes() + 330);

        // Format the new time in HH:MM format
        const istHour = date.getUTCHours().toString().padStart(2, '0');
        const istMinute = date.getUTCMinutes().toString().padStart(2, '0');

        return `${istHour}:${istMinute}`;
    }

    return (
        <li className=" m-2 w-[70%] rounded-[8px] bg-[#0f1117e8]  relative  flex flex-col items-center p-5 border border-white border-opacity-20 hover:border-opacity-75">
            {/* <div className="heading flex justify-between"> */}
            <div className="user absolute top-0 left-0 m-[20px] ">By {props.username},</div>
            <div className="date absolute top-0 right-0 m-4  flex gap-2 items-center">
                {(props.sent_time).slice(0, 10)}, &nbsp;
                {convertToIST((props.sent_time).slice(11, 16))} Hrs
            </div>
            <div className="content p-5 pt-10 w-full font-normal">
                {props.comment_val}
            </div>

        </li>
    )
}

export default Comments