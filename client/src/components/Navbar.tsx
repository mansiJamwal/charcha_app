import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { friendnameRecoil } from '@/atoms/friendname';
interface UserDetails {
  username: string;
  id: number;
  email: string
}

interface NotificationDetails {
  id: number
  username: string,
  friendname: string,
  notification_type: string,
  notification_val: string,
  sent_time: string
}

const Navbar = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDetails[]>([]);
  const token = localStorage.getItem('token');
  const  setUser = useState<UserDetails | null>(null)[1];
  const  setFriendnameRecoil = useSetRecoilState(friendnameRecoil);
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate();
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
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
  useEffect(() => {
    async function fetchNotifications() {

      try {
        const response = await axios.get("http://127.0.0.1:8000/notification/getnotifications/", {
          params: {
            username: localStorage.getItem('username'),
          }
        });

        const data = response.data;
        const filteredNotifications = data.notifications;
        setNotifications(filteredNotifications);

        console.log("yayay", filteredNotifications)


      } catch (error) {
        console.error('Error fetching notifications:', error);
      }

    }
    fetchNotifications();


    const intervalId = setInterval(fetchNotifications, 10000);


    return () => clearInterval(intervalId);

  }, [])

  async function acceptRequest(notification: NotificationDetails) {
    setFriendnameRecoil(notification.username)
    const response = await axios.delete("http://127.0.0.1:8000/notification/deletenotification/?id=" + notification.id, {});
    console.log(response);

    setNotifications((prevNotifications) => prevNotifications.filter(notificationEl => notificationEl.id !== notification.id))
    setMessage("Request Accepted")
    setTimeout(() => setMessage(null), 2000);
  }
  async function rejectNotification(notification: NotificationDetails) {
    const response = await axios.delete("http://127.0.0.1:8000/notification/deletenotification/?id=" + notification.id, {});
    console.log(response);

    setNotifications((prevNotifications) => prevNotifications.filter(notificationEl => notificationEl.id !== notification.id))
    if (notification.notification_type === 'friend_request') {
      setMessage("Request Rejected")
      setTimeout(() => setMessage(null), 2000);
    }

  }

  function handleSignOut() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div>
      <div>
        <div className="fixed top-5 right-4 flex gap-2 items-center z-50">
          <span
            className="notification bg-black bg-opacity-50 cursor-pointer flex justify-center items-center relative w-[60px] h-[60px] rounded-full shadow-md hover:shadow-lg transition-shadow"
            onClick={togglePanel} // Open notifications panel on click
          >
            <img className="w-[32px] h-[32px]" src="/notifications.svg" alt="Notifications" />
            {/* Notification count badge */}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </span>
          <span className="profile bg-black bg-opacity-50 shadow-md cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full hover:shadow-lg transition-shadow" onClick={toggleProfile}>
            <img className="w-[36px] h-[36px]" src="/icons8-admin-settings-male-96.png" alt="Profile" />
          </span>
        </div>
      </div>

      {isPanelOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-90 z-40" onClick={togglePanel}></div>

          <div className="fixed top-0 right-0 h-full w-[300px] bg-[#151515] shadow-lg p-6 text-white z-50">
            <h2 className="text-lg font-bold text-center mb-4">Notifications</h2>
            {message && <p className="mb-4 text-green-400">{message}</p>}
            <div className="mt-6 text-center">
              {
                notifications.length > 0 ? <ul className="space-y-4">
                  {notifications.map((notification, index) => (

                    <li key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg relative">
                      {
                        notification.notification_type === 'friend_request' ?
                          <>

                            <span className="text-sm">{notification.notification_val}</span>
                            <div className="flex space-x-2">
                              <button
                                className="flex items-center justify-center bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
                                onClick={() => acceptRequest(notification)}
                              >
                                <img src="/tick.png" alt="Accept" className="w-5 h-5" />
                              </button>
                              <button
                                className=" flex items-center justify-center bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors "
                                onClick={() => rejectNotification(notification)}
                              >
                                <img src="/cross.png" alt="Close" className="w-5 h-5" />
                              </button>
                            </div>
                          </>
                          :
                          <>
                            <span className="text-sm">{notification.notification_val}</span>
                            <button
                              className="flex items-center justify-center text-white p-2 rounded-full "
                              onClick={() => rejectNotification(notification)}
                            >
                              <img src="/cross.png" alt="Close" className="w-2 h-2" />
                            </button>
                          </>
                      }
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

      {
        isProfileOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-90 z-40" onClick={toggleProfile}></div>

            {/* Side Panel */}
            <div className="fixed top-0 right-0 h-full w-[300px] bg-[#151515] shadow-lg p-6 text-white z-50 flex flex-col items-center">
              <h2 className="text-lg font-bold text-center mb-6">Profile</h2>

              {/* User Info */}
              <div className="text-center mb-4">
                <div className="text-sm text-gray-400 mb-1">Username</div>
                <div className="text-lg font-semibold text-white">{localStorage.getItem('username')}</div>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm text-gray-400 mb-1">Email</div>
                <div className="text-lg font-semibold text-white">{localStorage.getItem('email')}</div>
              </div>

              {/* Sign Out Button */}
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full mt-4 transition-colors" onClick={handleSignOut}>
                Sign Out
              </button>

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-400 transition-colors"
                onClick={toggleProfile} // Close button
              >
                &times;
              </button>
            </div>
          </>
        )
      }

    </div>
  );
}

export default Navbar;