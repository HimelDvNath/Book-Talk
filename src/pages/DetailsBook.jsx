import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Comments from "../Components/Comments";

const DetailsBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_ROOT}/books/${id}`
                );
                const data = await response.json();
                setBook(data.data[0]);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchBook();
    }, [id]);
    return (
        <div className='min-h-screen bg-base-200 p-6'>
            <div className='max-w-4xl mx-auto'>
                {/* Book Details Card */}
                <div className='card bg-base-100 shadow-xl mb-8'>
                    <div className='card-body'>
                        <div className='flex flex-col md:flex-row gap-6'>
                            {/* Book Cover Image */}
                            <div className='md:w-1/3'>
                                <figure>
                                    <img
                                        src={book.image}
                                        alt={`Cover of the book "${
                                            book?.bookname || "Unknown"
                                        }"`}
                                        className='w-full rounded-lg shadow-lg'
                                    />
                                </figure>
                            </div>

                            {/* Book Details */}
                            <div className='md:w-2/3'>
                                <h1 className='text-3xl font-bold text-base-content mb-2'>
                                    {book?.bookname || "Loading..."}
                                </h1>

                                <p className='text-xl font-semibold text-accent italic mb-4'>
                                    by {book?.author || "Unknown"}
                                </p>

                                {/* Book Metadata */}
                                <div className='grid grid-cols-2 gap-4 mb-6'>
                                    <div>
                                        <span className='font-medium text-gray-500'>
                                            Category:
                                        </span>
                                        <span className='font-semibold ml-2'>
                                            {book?.category || "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-500'>
                                            Published:
                                        </span>
                                        <span className='font-semibold ml-2'>
                                            {book?.yearofpublishing || "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-500'>
                                            Publisher:
                                        </span>
                                        <span className='font-semibold ml-2'>
                                            {book?.publisher || "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-500'>
                                            Pages:
                                        </span>
                                        <span className='font-semibold ml-2'>
                                            {book?.totalpages || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {/* Full Description */}
                                <div className='mb-6'>
                                    <h3 className='text-xl font-bold text-base-content mb-3'>
                                        Description
                                    </h3>
                                    <div className='bg-base-200 p-4 rounded-lg'>
                                        <p className='text-base-content leading-relaxed'>
                                            {book?.review ||
                                                "No description available."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discussion Section */}
                <div className='mt-8'>
                    <h2 className='text-2xl font-bold mb-4'>Discussion</h2>
                    {<Comments bookId={id} />}
                </div>
            </div>
        </div>
    );
};

export default DetailsBook;
