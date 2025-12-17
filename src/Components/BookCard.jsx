import React from "react";
import { Link } from "react-router";

const BookCard = ({ book }) => {
    const {book_id, image, bookname, author, category, yearofpublishing } = book;

    return (
        <div className='card bg-base-100 w-full max-w-sm shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group'>
            <figure className='relative h-52 overflow-hidden bg-gradient-to-br from-base-200 to-base-300'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10'></div>
                <img
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    src={image}
                    alt={`${bookname} book cover`}
                />
                <div className='absolute top-3 left-3 z-20'>
                    <div className='badge badge-primary badge-sm font-medium px-2 py-1'>
                        Book
                    </div>
                </div>
            </figure>

            <div className='card-body p-6'>
                <div className='mb-4'>
                    <h2 className='card-title text-lg font-bold text-base-content mb-2 line-clamp-2'>
                        {bookname}
                    </h2>
                    <p className='text-base-content/70 italic text-sm'>
                        by {author}
                    </p>
                </div>

                <div className='grid grid-cols-2 gap-3 mb-5'>
                    <div className='flex flex-col'>
                        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                            Category
                        </span>
                        <span className='text-sm font-medium'>{category}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                            Year
                        </span>
                        <span className='text-sm font-medium'>
                            {yearofpublishing}
                        </span>
                    </div>
                </div>

                <div className='card-actions'>
                    <Link to={`/book-details/${book_id}`} className='btn btn-primary btn-block btn-sm'>
                        View Details
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 ml-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
