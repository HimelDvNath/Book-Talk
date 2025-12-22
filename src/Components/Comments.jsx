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

    const userName = user?.displayName || "Anonymous";

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
                        user_email: item.user_email, // ✅ IMPORTANT
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

        const reply = {
            book_id: parseInt(bookId),
            user_email: user?.email,
            parent_comment_id: parentId,
            comment: text,
            receiver_email: receiverEmail, // ✅ reply receiver
        };
        try {
            // ===== Save to DB (optional) =====
            await fetch(`${import.meta.env.VITE_BACKEND_ROOT}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reply),
            });
            socket.emit("newComment", { bookId });
            // ===== SOCKET NOTIFICATION =====
            if (user?.uid && receiverEmail && receiverEmail !== user?.email) {
                socket.emit(
                    "sendNotification",
                    receiverEmail,
                    text,
                    user?.displayName,
                    location.pathname
                );
                const newNotification = {
                    user_email: receiverEmail,
                    senderName: user?.displayName,
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

            // Clear textarea
            setReplyTexts((prev) => ({
                ...prev,
                [parentId]: "",
            }));

            // Close reply box
            setShowReply((prev) => ({
                ...prev,
                [parentId]: false,
            }));

            // Refresh comments
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
                className='bg-gray-200 px-4 py-3 rounded-lg mb-2'
                style={{
                    marginLeft: level > 0 ? `${level * 24}px` : "0",
                }}>
                <p className='font-semibold'>{item.user}</p>
                <p className='mb-2'>{item.text}</p>
                <button
                    onClick={() =>
                        setShowReply((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                        }))
                    }
                    className='text-blue-500 text-sm mb-2 hover:underline'>
                    Reply
                </button>

                {showReply[item.id] && (
                    <form
                        onSubmit={(e) =>
                            handleComment(
                                e,
                                item.id,
                                item.user_email // ✅ receiver email
                            )
                        }
                        className='mb-6 px-5'>
                        <div className='relative'>
                            <textarea
                                className='h-20 textarea bg-gray-300 rounded-xl w-5/7 px-3 py-2 resize-none outline-none'
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
                            />
                            <button
                                type='submit'
                                className='absolute top-11 right-61 mt-3'>
                                <IoMdSend color='blue' size={25} />
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
                handleDiscussionList(); // 🔥 REFRESH COMMENTS
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
        <div className='space-y-4 max-h-[600px] overflow-auto px-3 sm:px-5'>
            {discussion.length === 0 ? (
                <p className='text-gray-500'>No discussions yet.</p>
            ) : (
                renderComments(discussion)
            )}

            {/* NEW COMMENT */}
            <form
                onSubmit={(e) => handleComment(e)}
                className='mt-4 w-full sm:w-5/6 md:w-4/5 relative'>
                <textarea
                    className='h-20 textarea bg-gray-300 rounded-xl w-full px-3 py-2 resize-none outline-none'
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
                />
                <button type='submit' className='absolute bottom-3 right-3'>
                    <IoMdSend color='blue' size={22} />
                </button>
            </form>
        </div>
    );
};

export default Comments;
