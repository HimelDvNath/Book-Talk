import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import Books from '../Components/Books';

const HomeLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            
        </div>
    );
};

export default HomeLayout;