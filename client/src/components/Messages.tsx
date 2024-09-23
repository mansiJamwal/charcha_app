// import React from 'react'
// import { NavLink } from "react-router-dom"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { memo, useEffect, useState } from "react"

interface UserDetails {
  user_name: string;
  user_id: number;

}

interface UserComponent extends UserDetails {
  setVal: React.Dispatch<React.SetStateAction<number>>;
}

export const Messages = () => {
  const [currentChat, setCurrentChat] = useState<number>(0)
  const [contacts, setContacts] = useState<UserDetails[]>([
    {
      user_name: 'Aaditya',
      user_id: 1
    },
    {
      user_name: 'Mansi',
      user_id: 2
    },
    {
      user_name: 'Sahil',
      user_id: 3
    },
  ])

  useEffect(() => {

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
            return <ContactComponent setVal={setCurrentChat} key={contact.user_id} user_name={contact.user_name} user_id={contact.user_id} />
          })}
          {/* <ContactComponent key={1} user_name="Aaditya" user_id={2} /> */}
        </ul>
      </div>
      <div className="messageScreen w-full">
        {currentChat ?
          <MessageWindow />
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
      props.setVal(props.user_id)
    }} className="hover:bg-[#1f2229] w-full flex justify-center hover:cursor-pointer">
      <div className="border-b-[0.5px] p-5 text-lg py-6 w-[90%] border-opacity-15 border-white">
        {props.user_name}
      </div>
    </li>
  )
})

const MessageWindow = memo(function MessageWindow() {
  return (
    <div className="bg-gradient-to-bl from-gray-950 to-gray-900 h-full flex flex-col">
      <h1 className="h-[100px] border border-red-500">Friend Name</h1>
      <div className="h-full">your messages will appear here</div>
      <div className="h-[100px] border border-red-500">search</div>
    </div>
  )
})