"use client";
import React, { useContext, useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import "../index.css";
import { AuthContext } from "../Provider/AuthProvider";
const Comments = ({ bookId }) => {
    const [comments, setComments] = useState([]);
    const [discussion, setDiscussion] = useState([]);
    const [comment, setComment] = useState("");
    const [replyText, setReplyText] = useState(false);

    const { user } = useContext(AuthContext);
    const userName = user?.displayName ?? "Anonymous";
    const handleDiscussionList = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/replies/${bookId}/0`
            );
            const repliesData = await res.json();

            const discussions = repliesData.data.map((item) => {
                return {
                    id: item.id,
                    text: item.comment,
                    user: item.firstname + " " + item.lastname || "Anonymous",
                };
            });

            setDiscussion(discussions);
        } catch (error) {
            console.error("Discussion fetch failed:", error);
        }
    };
    const handleComment = async (e) => {
        e.preventDefault();
        if (comment.trim().length === 0) return;

        const reply = {
            book_id: parseInt(bookId),
            user_email: user?.email,
            parent_comment_id: replyText ? 1 : 0,
            comment: comment,
        };
        //comment save to db
        try {
            await fetch("http://localhost:5000/replies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reply),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setComment("");
                        handleDiscussionList();
                    } else {
                        alert("Something went wrong!! Try again");
                    }
                });
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    };
    useEffect(() => {
        if (!bookId) return;
        handleDiscussionList();
    }, [bookId]);

    return (
        <div className='space-y-4 max-h-200 overflow-auto '>
            {discussion.length === 0 && (
                <p className='text-gray-500'>No discussions yet.</p>
            )}

            {discussion.map((item) => (
                <div key={item.id} className='bg-base-200 px-4 rounded-lg'>
                    <p className='font-semibold'>{item.user}</p>
                    <p className='mb-2'>{item.text}</p>

                    {/* Reply Input */}
                    {/* <textarea
                        className='textarea textarea-sm textarea-bordered w-full mb-2'
                        placeholder='Reply...'
                        value={replyText[item.id] || ""}
                        onChange={(e) =>
                            setReplyText({
                                ...replyText,
                                [item.id]: e.target.value,
                            })
                        }
                    /> */}
                </div>
            ))}

            {/* New Comment */}
            <form onSubmit={handleComment} className='mb-6 px-5'>
                <div className='relative'>
                    <textarea
                        className='h-20 textarea overflow-auto no-scrollbar bg-gray-300  outline-none border-0  rounded-xl w-5/7 px-3 py-2 resize-none'
                        placeholder={`Comment as ${userName}`}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                e.target.form.requestSubmit();
                            }
                        }}
                    />
                    <button
                        className=' absolute z-50 top-11 right-61 mt-3'
                        type='submit'>
                        <IoMdSend color='blue' size={25} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Comments;
