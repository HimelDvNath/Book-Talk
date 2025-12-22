import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BookCard from "./BookCard";
import Loading from "./Loading";

const Books = () => {
    const [bookData, setBookData] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_ROOT}/books`)
            .then((res) => res.json())
            .then((data) => {
                setBookData(data.data);
                setLoader(false); // move it here
            })
            .catch((err) => {
                console.error("Failed to fetch books:", err);
                setLoader(false); // make sure loader stops even if error
            });
    }, []);

    if (loader) {
        return <Loading />;
    }

    return (
        <div className='px-5'>
            <Tabs>
                <TabList>
                    <Tab>All Books</Tab>
                </TabList>

                <TabPanel>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center'>
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
