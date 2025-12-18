import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BookCard from "./BookCard";

const Books = () => {
    const [bookData, setBookData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/books")
            .then((res) => res.json())
            .then((data) => setBookData(data.data));
    }, []);
    return (
        <div className='px-5'>
            <Tabs>
                <TabList>
                    <Tab>All Books</Tab>
                </TabList>

                <TabPanel>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                        {bookData.map((book) => (
                            <BookCard key={book.book_id} book={book} />
                        ))}
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default Books;
