import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import axios from 'axios'

export function SignIn() {
    const navigate = useNavigate();
    const [email,setEmail]=useState<string>('');
    const [password,setPassword]=useState<string>('');
    const [activeError, setActiveError]=useState<boolean>(false);
    const [errorval,setErrorVal]=useState<string>('');

    const user={
        email:email,
        password:password
    }

    async function signinfunc(event: React.FormEvent){
        event.preventDefault(); 
        try{
            const response=await axios.post('http://127.0.0.1:8000/signin',user)
            // console.log(response);
            const data= await response.data;
            console.log(data);
            if (data.hasOwnProperty('token')) {
                localStorage.setItem('token',data.token);
                localStorage.setItem('username', data.user.username)
                console.log(data.token);
                setActiveError(false);
                navigate('/messages')
            } else {
                setActiveError(true);
                setErrorVal("error") ;              
            }
        }catch(e){
            if (axios.isAxiosError(e) && e.response) { 
                setActiveError(true);
                setErrorVal(e.response.data.detail || "something went wrong");
                
            } else {
                setActiveError(true);
                setErrorVal("An unexpected error occurred:");
                console.log(e);
            }
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('token')) navigate('/posts')
    },[])

    return (
        <>
            <main className="flex justify-center items-center h-screen  bg-gradient-to-bl from-black to-gray-900 ">
                <Card className="mx-auto max-w-sm ">
                    <CardHeader className="flex flex-col justify-center items-center pb-10">
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                  
                        <div className="grid gap-4">
                        <form onSubmit={signinfunc} >
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(e)=>{
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required  onChange={(e)=>{
                                    setPassword(e.target.value);
                                }}/>
                            </div>

                           {

                            activeError ? <div className="text-red-500 text-sm" >{errorval}</div> : <></>

                           }

                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            {/* <Button variant="outline" className="w-full">
                                Login with Google
                            </Button> */}
                            </form>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to={"/signup"} className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
