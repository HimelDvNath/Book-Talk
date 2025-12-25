"use client";
import React, { useContext, useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import "../index.css";
import { AuthContext } from "../Provider/AuthProvider";
import socket from "../socket/socket";
import Loading from "./Loading";
import { useLocation, useNavigate } from "react-router";

const Comments = ({ bookId }) => {
    const [discussion, setDiscussion] = useState([]);
    const [replyTexts, setReplyTexts] = useState({});
    const [showReply, setShowReply] = useState({});

    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const userName =
        user?.displayName || user?.user?.displayName || "Anonymous";

    /* ================= FETCH COMMENTS (RECURSIVE) ================= */
    const fetchReplies = async (parentId = 0) => {
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_ROOT
                }/replies/${bookId}/${parentId}`
            );
            const repliesData = await res.json();
            const commentsWithReplies = await Promise.all(
                repliesData.data.map(async (item) => {
                    const childReplies = await fetchReplies(item.id);
                    return {
                        id: item.id,
                        text: item.comment,
                        user:
                            `${item.firstname} ${item.lastname}` || "Anonymous",
                        user_email: item.user_email,
                        replies: childReplies,
                    };
                })
            );

            return commentsWithReplies;
        } catch (error) {
            console.error("Discussion fetch failed:", error);
            return [];
        }
    };

    /* ================= FETCH ALL COMMENTS ================= */
    const handleDiscussionList = async () => {
        if (!bookId) return;
        try {
            const comments = await fetchReplies(0);
            setDiscussion(comments);
        } catch (error) {
            console.error("Failed to fetch discussion:", error);
        }
    };

    /* ================= SUBMIT COMMENT / REPLY ================= */
    const handleComment = async (e, parentId = 0, receiverEmail = null) => {
        e.preventDefault();
        if (userName === "Anonymous") {
            navigate("/signin");
        }
        const text = replyTexts[parentId];
        if (!text || !text.trim()) return;
        const email = user?.email || user?.user?.email;
        const reply = {
            book_id: parseInt(bookId),
            user_email: email,
            parent_comment_id: parentId,
            comment: text,
            receiver_email: receiverEmail,
        };
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_ROOT}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reply),
            });
            socket.emit("newComment", { bookId });
            // console.log(user.email);
            if (user?.uid && receiverEmail && receiverEmail !== user?.email) {
                const userName = user?.displayName || user?.user?.displayName;
                // console.log(user, userName, receiverEmail);
                socket.emit(
                    "sendNotification",
                    receiverEmail,
                    text,
                    userName,
                    location.pathname
                );
                const newNotification = {
                    user_email: receiverEmail,
                    senderName: userName,
                    comment: text,
                    location: location.pathname,
                };
                await fetch(
                    `${import.meta.env.VITE_BACKEND_ROOT}/notification`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newNotification),
                    }
                );
            }

            setReplyTexts((prev) => ({
                ...prev,
                [parentId]: "",
            }));

            setShowReply((prev) => ({
                ...prev,
                [parentId]: false,
            }));

            handleDiscussionList();
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    /* ================= RENDER NESTED COMMENTS ================= */
    const renderComments = (comments, level = 0) => {
        return comments.map((item) => (
            <div
                key={item.id}
                className={`bg-gray-200 rounded-lg mb-2 ${
                    level > 0
                        ? "border-l-2 border-gray-400 pl-2 sm:pl-3"
                        : "px-3 sm:px-4"
                } py-2 sm:py-3`}
                style={{
                    marginLeft:
                        level > 0 ? `${Math.min(level, 5) * 0.5}rem` : "0",
                    maxWidth: "100%",
                }}>
                <div className='flex items-start gap-2 mb-1'>
                    <div className='min-w-0 flex-1'>
                        {" "}
                        {/* Added this wrapper for better text handling */}
                        <p className='font-semibold text-sm sm:text-base break-words truncate'>
                            {item.user}
                        </p>
                        <p className='text-sm sm:text-base break-words whitespace-normal'>
                            {item.text}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() =>
                        setShowReply((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                        }))
                    }
                    className='text-blue-500 text-xs sm:text-sm mb-1 hover:underline'>
                    Reply
                </button>

                {showReply[item.id] && (
                    <form
                        onSubmit={(e) =>
                            handleComment(e, item.id, item.user_email)
                        }
                        className='mb-4 mt-2'>
                        <div className='relative w-full'>
                            <textarea
                                className='h-16 sm:h-20 bg-gray-300 rounded-xl w-full px-3 py-2 pr-10 resize-none outline-none text-sm sm:text-base break-words'
                                placeholder={`Reply as ${userName}`}
                                value={replyTexts[item.id] || ""}
                                onChange={(e) =>
                                    setReplyTexts((prev) => ({
                                        ...prev,
                                        [item.id]: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        e.target.form.requestSubmit();
                                    }
                                }}
                                rows={3}
                            />
                            <button
                                type='submit'
                                className='absolute bottom-2 right-2 sm:bottom-3 sm:right-3'>
                                <IoMdSend
                                    color='blue'
                                    size={18}
                                    className='sm:w-5 sm:h-5'
                                />
                            </button>
                        </div>
                    </form>
                )}

                {item.replies?.length > 0 && (
                    <div className='mt-2'>
                        {renderComments(item.replies, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    useEffect(() => {
        const handleNewComment = ({ bookId: incomingBookId }) => {
            if (incomingBookId === bookId) {
                handleDiscussionList();
            }
        };

        socket.on("newComment", handleNewComment);

        return () => {
            socket.off("newComment", handleNewComment);
        };
    }, [bookId]);

    /* ================= EFFECT ================= */
    useEffect(() => {
        if (bookId) handleDiscussionList();
    }, [bookId]);

    return (
        <div className='space-y-4 max-h-[600px] overflow-y-auto px-2 sm:px-3 md:px-5'>
            {discussion.length === 0 ? (
                <p className='text-gray-500 text-sm sm:text-base'>
                    No discussions yet.
                </p>
            ) : (
                <div className='space-y-2'>{renderComments(discussion)}</div>
            )}

            {/* NEW COMMENT */}
            <form
                onSubmit={(e) => handleComment(e)}
                className='mt-4 w-full relative'>
                <div className='relative'>
                    <textarea
                        className='h-20 bg-gray-300 rounded-xl w-full px-3 py-2 pr-10 resize-none outline-none text-sm sm:text-base break-words'
                        placeholder={`Comment as ${userName}`}
                        value={replyTexts[0] || ""}
                        onChange={(e) =>
                            setReplyTexts((p) => ({ ...p, 0: e.target.value }))
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                e.target.form.requestSubmit();
                            }
                        }}
                        rows={4}
                    />
                    <button
                        type='submit'
                        className='absolute bottom-2 right-2 sm:bottom-3 sm:right-3'>
                        <IoMdSend
                            color='blue'
                            size={20}
                            className='sm:w-6 sm:h-6'
                        />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Comments;
