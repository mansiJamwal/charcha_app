// import React from 'react'
// import { NavLink } from "react-router-dom"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { memo, useEffect, useState } from "react"

interface UserDetails {
  username: string;
  user_id: number;
  email: string
}

interface UserComponent extends UserDetails {
  setVal: React.Dispatch<React.SetStateAction<UserDetails>>;
}

export const Messages = () => {
  const [currentChat, setCurrentChat] = useState<UserDetails>({
    user_id: 0,
    username: '',
    email: ''
  })
  const [contacts, setContacts] = useState<UserDetails[]>([
    {
      username: 'Aaditya',
      user_id: 1,
      email: "agarwal.aaditya2765@gmail.com"
    },
    {
      username: 'Mansi',
      user_id: 2,
      email: "mansi@gmail.com"
    },
    {
      username: 'Sahil',
      user_id: 3,
      email: "sahil@gmail.com"
    },
  ])

  useEffect(() => {
    console.log(currentChat)
  }, [currentChat])

  return (
    <main className="h-screen bg-gradient-to-bl from-black to-gray-900 flex  text-white">
      <div className="sidebar bg-gradient-to-r from-black to-gray-950 w-[500px] border-r-[0.2px] border-white border-opacity-25">
        <h1 className="text-[28px] pt-10 px-6 ">My Friends</h1>
        <div className="flex  gap-3  items-center m-5 mb-5">
          <Input className="w-full rounded-[6px] p-5 border-opacity-25 hover:border-opacity-100" type="email" placeholder="Search for Users, Friends" />
          <Button className="py-[20px] px-2 text-[16px] rounded-[6px]" type="submit"><img src="search.svg" alt="" className="w-[30px]" /></Button>
        </div>
        <ul className="contacts h-[70vh] w-full flex flex-col  items-center overflow-auto  ">
          {contacts.map(contact => {
            return <ContactComponent setVal={setCurrentChat} key={contact.user_id} email={contact.email} username={contact.username} user_id={contact.user_id} />
          })}
          {/* <ContactComponent key={1} user_name="Aaditya" user_id={2} /> */}
        </ul>
      </div>
      <div className="messageScreen w-full">
        {(currentChat.user_id != 0) ?
          <MessageWindow user={currentChat} />
          :
          <div className="nouser w-full h-full flex justify-center items-center text-3xl">
            Select a Contact to Start Texting
          </div>
        }

      </div>
    </main>
  )
}

//  default Messages



const ContactComponent = memo(function ContactComponent(props: UserComponent) {
  return (
    <li onClick={() => {
      props.setVal({
        username: props.username,
        user_id: props.user_id,
        email: props.email
      })
    }} className="hover:bg-[#1f2229] w-full flex justify-center hover:cursor-pointer">
      <div className="border-b-[0.5px] p-5 text-lg py-6 w-[90%] border-opacity-15 border-white">
        {props.username}
      </div>
    </li>
  )
})

interface textType {
  message_val: string,
  message_id: number,
  sent_time: string,
  user_id: number,
  friend_id: number
}

const MessageWindow = memo(function MessageWindow({ user }: {
  user: UserDetails
}) {

  const [myTexts, setMyTexts] = useState<textType[]>([
    {
      message_val: "hello",
      message_id: 1,
      sent_time: "27/06/2024:13:25:00",
      user_id: 4,
      friend_id: 2
    }
  ])
  const [friendTexts, setFriendTexts] = useState<textType[]>([
    {
      message_val: "hi",
      message_id: 1,
      sent_time: "27/06/2024:13:30:00",
      user_id: 2,
      friend_id: 4
    }
  ])

  const [allTexts, setAllTexts] = useState<textType[]>([])

  useEffect(() => {
    setAllTexts([...myTexts, ...friendTexts].sort((a,b)=> (a.sent_time > b.sent_time)?1:-1))
    
  }, [myTexts, friendTexts])

  return (
    <div className="bg-gradient-to-bl from-gray-950 to-gray-800 h-full flex flex-col">
      <h1 className="h-[12%] bg-gradient-to-r from-black to-gray-950 flex items-center justify-center text-2xl border-white border-b-[0.5px] border-opacity-25 ">{user.username} </h1>
      <div className="h-[78%]  relative flex flex-col  p-8 ">
        {allTexts.map((text) => (
          <MessageComp textVal={text} />
        ))}
      </div>
      <div className="h-[10%] bg-gradient-to-b  from-gray-950 to-gray-950 p-2 flex items-center justify-center text-2xl border-white border-t-[0.5px] border-opacity-25">
        <div className="flex w-[95%] gap-3 items-center justify-center">
          <Input className="w-full bg-[#171e28] rounded-[6px] p-5 border-opacity-25 hover:border-opacity-100" type="email" placeholder="Enter Message" />
          <Button className="py-[20px] px-2 text-[16px] rounded-[6px]" type="submit"><img src="search.svg" alt="" className="w-[30px]" /></Button>
        </div>
      </div>

    </div>
  )
})



const MessageComp = memo(function messageComp({ textVal}: {textVal: textType}) {
  return (
    <>
      {
        textVal.user_id.toString() == localStorage.getItem("id")
          ?
          <div className=" p-2 flex justify-end ">
            <div className="max-w-[60%] bg-cyan-800 rounded-xl  p-3 px-7">
            {textVal.message_val}
            </div>
            
          </div>
          :
          <div className=" p-2 flex justify-start ">
            <div className="max-w-[60%] bg-cyan-950 rounded-xl  p-3 px-7">
            {textVal.message_val}
            </div>
            
          </div>
      }

    </>
  )
})