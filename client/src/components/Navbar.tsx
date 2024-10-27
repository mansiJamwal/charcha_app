import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import { friendnameRecoil } from '@/atoms/friendname';
import { errorRecoil } from '@/atoms/error';
interface UserDetails {
    username: string;
    id: number;
    email: string
  }

interface NotificationDetails{
    id:number
    username:string,
    friendname:string,
    notification_type:string,
    notification_val:string
}

const Navbar = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [notifications,setNotifications]=useState<NotificationDetails[]>([]);
    const token = localStorage.getItem('token');
    const [user,setUser]=useState<UserDetails|null>(null)
    const [friendnamerecoil,setFriendnameRecoil]=useRecoilState(friendnameRecoil);
    const [errorrecoil,seterrorrecoil]=useState(errorRecoil)
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };
    async function verifytoken(token: string | null) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/test_token", {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,  // Use the variable for the token
            },
          })
          const data = await response.data
          return data
        }
        catch (error) {
          console.error('Error:', error);
        }
      }
    
      //function to run every time the token changes 
      useEffect(() => {
        async function fetchUser() {
          if (token) {
            const fetchedUser = await verifytoken(token);
            setUser(fetchedUser);
          }
        }
        fetchUser();
      }, [token]);
      const username = user?.username
    useEffect(()=>{
        async function fetchNotifications() {
            if (username) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/notification/getnotifications/?username=${username}`);
                    const data = response.data;
                    const filteredNotifications = data.notifications;
                    setNotifications(filteredNotifications);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        }
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return ()=>clearInterval(interval);
    },[username])
    return (
        <div>
            <div className="fixed top-6 right-6 flex space-x-4 items-center z-50">
                <span 
                    className="notification cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full shadow-md hover:shadow-lg transition-shadow"
                    onClick={togglePanel} // Open notifications panel on click
                >
                    <img className="w-[32px] h-[32px]" src="/notifications.svg" alt="Notifications" />
                </span>
                <span className="profile shadow-md cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full hover:shadow-lg transition-shadow">
                    <img className="w-[36px] h-[36px]" src="/icons8-admin-settings-male-96.png" alt="Profile" />
                </span>
            </div>

            {/* Render the notifications panel */}
            {isPanelOpen && (
                <>
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-90 z-40" onClick={togglePanel}></div>

                    {/* Side panel */}
                    <div className="fixed top-0 right-0 h-full w-[300px] bg-[#151515] shadow-lg p-6 text-white z-50">
                        <h2 className="text-lg font-bold text-center mb-4">Notifications</h2>
                        
                        <div className="mt-6 text-center">
                            {/* Replace with dynamic requests data */}
                            {
                               notifications.length>0?  <ul className="space-y-4">
                               {notifications.map((notification, index) => (
                                 <li onClick={async ()=>{
                                  setFriendnameRecoil(notification.username)
                                  const response=await axios.delete("http://127.0.0.1:8000/notification/deletenotification/?id="+notification.id,{});
                                  console.log(response);
                                 }} key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                   <span className="text-sm">{notification.notification_val}</span>
                                   <button 
                                     className="bg-green-300 text-black px-3 py-1 rounded-lg font-semibold hover:bg-green-400 transition-colors"
                                   >
                                     Accept Request
                                   </button>
                                 </li>
                               ))}
                             </ul> : <></>
                            }
                        </div>
                        <button 
                            className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-400 transition-colors"
                            onClick={togglePanel} // Close button
                        >
                            &times;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Navbar;