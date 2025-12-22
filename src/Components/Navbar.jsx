import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import socket from "../socket/socket";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // REGISTER USER
    useEffect(() => {
        if (user?.email) {
            socket.emit("register", user.email);
        }
    }, [user?.email]);

    // FETCH OLD NOTIFICATIONS
    useEffect(() => {
        if (!user?.email) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_ROOT}/notification/${
                        user.email
                    }`
                );
                const data = await res.json();

                if (data?.data) {
                    const formatted = data.data
                        .map((n) => ({
                            id: n.id,
                            senderName: n.sendername,
                            notification: n.comment,
                            isRead: n.isread,
                        }))
                        .reverse();

                    setNotifications(formatted);

                    const unread = formatted.filter(
                        (n) => n.isread === "FALSE" || n.isread === "false"
                    ).length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                console.error("Failed to load notifications", error);
            }
        };

        fetchNotifications();
    }, [user?.email]);

    // SOCKET LISTENER
    useEffect(() => {
        const handleNewNotification = ({
            notification,
            senderName,
            location,
        }) => {
            const newNotif = {
                id: Date.now(),
                senderName: senderName,
                notification: notification,
                location: location,
                isRead: false,
            };
            console.log(newNotif);

            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, []);

    // HANDLE BELL CLICK
    const handleBellClick = () => {
        setShowNotifications(!showNotifications);

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        fetch(
            `${import.meta.env.VITE_BACKEND_ROOT}/notification/${user.email}`,
            {
                method: "PUT",
            }
        );
    };

    const handleSignOut = async () => {
        try {
            setNotifications([]);
            setShowNotifications(false);
            setUnreadCount(0);
            await logOut();
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='navbar bg-base-100 shadow-sm'>
            {/* LOGO */}
            <div className='flex-1'>
                <Link
                    to='/'
                    className='text-4xl text-black font-extrabold cursor-pointer'>
                    Book<span className='text-orange-400'>Talk</span>
                </Link>
            </div>

            <div className='flex-none space-x-3 px-3'>
                {/* NOTIFICATION */}
                <div className='dropdown dropdown-end'>
                    <button
                        className='btn btn-ghost btn-circle'
                        onClick={handleBellClick}>
                        <div className='indicator'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                                />
                            </svg>

                            {/* UNREAD COUNT */}
                            {unreadCount > 0 && (
                                <span className='badge badge-sm badge-primary indicator-item'>
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </button>

                    {/* DROPDOWN */}
                    {showNotifications && (
                        <div className='dropdown-content z-50 mt-2 w-80 sm:w-96 bg-base-100 rounded-lg shadow-lg'>
                            <div className='p-3 font-semibold border-b'>
                                Notifications
                            </div>

                            {notifications.length === 0 ? (
                                <p className='p-3 text-gray-500'>
                                    No notifications
                                </p>
                            ) : (
                                <ul className='max-h-64 overflow-y-auto'>
                                    {notifications.map((item) => (
                                        <li
                                            key={item.id}
                                            className='border-b last:border-b-0'>
                                            <Link
                                                to={item.location}
                                                className='block p-3 hover:bg-gray-100 transition-colors duration-200'>
                                                <p className='text-sm font-semibold'>
                                                    {item.senderName}{" "}
                                                    <span className='text-gray-600 font-normal'>
                                                        mentioned you on your
                                                        comment
                                                    </span>
                                                </p>
                                                <p className='text-sm text-gray-600 truncate'>
                                                    {item.notification}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* PROFILE */}
                <div className='dropdown dropdown-end'>
                    {/* TRIGGER */}
                    <div
                        tabIndex={0}
                        className='btn btn-ghost btn-circle avatar'>
                        <div className='w-10 rounded-full'>
                            <img
                                alt='profile'
                                src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                            />
                        </div>
                    </div>

                    {/* DROPDOWN CONTENT */}
                    <ul
                        tabIndex={0}
                        className='menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-[100]'>
                        <li>
                            <a>{user ? user?.displayName : "Profile"}</a>
                        </li>
                        <li>
                            {user ? (
                                <button onClick={handleSignOut}>LogOut</button>
                            ) : (
                                <Link to='/signin'>LogIn</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
