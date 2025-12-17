import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const DetailsBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState({});
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/books/${id}`);
                const data = await response.json();
                setBook(data.data[0]);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchBook();
    }, [id]);

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            const newComment = {
                id: Date.now(),
                text: comment,
                date: new Date().toLocaleDateString(),
                user: "Anonymous"
            };
            setComments([...comments, newComment]);
            setComment("");
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Book Details Card */}
                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Book Cover Image */}
                            <div className="md:w-1/3">
                                <figure>
                                    <img
                                        src={book.image}
                                        alt={`Cover of the book "${book?.bookname || 'Unknown'}"`}
                                        className="w-full rounded-lg shadow-lg"
                                    />
                                </figure>
                            </div>
                            
                            {/* Book Details */}
                            <div className="md:w-2/3">
                                <h1 className="text-3xl font-bold text-base-content mb-2">
                                    {book?.bookname || "Loading..."}
                                </h1>
                                
                                <p className="text-xl font-semibold text-accent italic mb-4">
                                    by {book?.author || "Unknown"}
                                </p>
                                
                                {/* Book Metadata */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <span className="font-medium text-gray-500">Category:</span>
                                        <span className="font-semibold ml-2">{book?.category || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Published:</span>
                                        <span className="font-semibold ml-2">{book?.yearofpublishing || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Publisher:</span>
                                        <span className="font-semibold ml-2">{book?.publisher || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Pages:</span>
                                        <span className="font-semibold ml-2">{book?.totalpages || "N/A"}</span>
                                    </div>
                                </div>
                                
                                {/* Full Description */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-base-content mb-3">Description</h3>
                                    <div className="bg-base-200 p-4 rounded-lg">
                                        <p className="text-base-content leading-relaxed">
                                            {book?.review || "No description available."}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="btn btn-primary">Read Now</button>
                                    <button className="btn btn-outline">Save for Later</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Comment Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="text-2xl font-bold text-base-content mb-6">Comments ({comments.length})</h2>
                        
                        {/* Comment Form */}
                        <div className="mb-8">
                            <form onSubmit={handleSubmitComment}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Add your comment</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-32"
                                        placeholder="What are your thoughts on this book?"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!comment.trim()}
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.length > 0 ? (
                                comments.map((commentItem) => (
                                    <div key={commentItem.id} className="bg-base-200 p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold">{commentItem.user}</span>
                                            <span className="text-sm text-gray-500">{commentItem.date}</span>
                                        </div>
                                        <p className="text-base-content">{commentItem.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No comments yet. Be the first to share your thoughts!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsBook;