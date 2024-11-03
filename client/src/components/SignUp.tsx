import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
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
import { useState, useEffect } from "react"
import axios from 'axios';



export function SignUp() {
    const  navigate = useNavigate();
    const [username, setUserName]=useState<string>('');
    const [email, setEmail]=useState<string>('');
    const [password, setPassword]=useState<string>('');
    const [activeError, setActiveError]=useState<boolean>(false);
    const [errorval,setErrorVal]=useState<string>('');

    const user={
        username:username,
        email:email,
        password:password
    }

    async function submitfunc(event: React.FormEvent){
        event.preventDefault(); 
        try{
        const response=await axios.post('http://127.0.0.1:8000/signup',user)
        console.log(response);
        const data= await response.data;
        console.log(data);
        if (data.hasOwnProperty('token')) {
            localStorage.setItem('token',data.token);
            console.log(data.token);
            setActiveError(false);
            localStorage.setItem('username', data.user.username)
            navigate('/messages')
        }
        else{
            setActiveError(true);
            setErrorVal("error");
        }
        }catch(e){
            if (axios.isAxiosError(e) && e.response) {
                // Check if the status code is 400
                if (e.response.status === 400 && e.response.data.detail) {
                    setActiveError(true);
                    setErrorVal("This email id already has an account. Login or Sign up with different credentials");
                } else {
                    setActiveError(true);
                    setErrorVal("The username already exists. Please enter another username");
                    console.log("Error: ", e.response.data);
                }
            } else {
                setActiveError(true);
                setErrorVal("An unexpected error occurred");
                console.log("An unexpected error occurred:", e);
            }
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('token')) navigate('/posts')
    },[])
    return (
        <>
            <main className="h-screen flex justify-center items-center  bg-gradient-to-bl from-black to-gray-900">

                <Card className="mx-auto w-[370px]">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={submitfunc}>
                        <div className="grid gap-4">
                            <div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Username</Label>
                                    <Input id="last-name" placeholder="John Doe" required  onChange={(e)=>{
                                        setUserName(e.target.value);
                                    }} />
                                </div>
                            </div>
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
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password"  onChange={(e)=>{
                                    setPassword(e.target.value);
                                }} />
                            </div>

                        {
                             activeError ? <div className="text-red-500 text-sm" >{errorval}</div> : <></>
                        }
                            <Button type="submit" className="w-full" >
                                Create an account
                            </Button>
                        </div>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to={"/signin"} className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                    
                </Card>
            </main>

        </>
    )
}
