import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/HomeLayout";
import SignIn from "../Components/SignIn";
import SignUp from "../Components/SignUp";
import DetailsBook from "../pages/DetailsBook";
import Books from "../Components/Books";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children:[
      {
        index:true, path:'/', Component: Books
      },
      {
        path: '/signin',
        Component:SignIn
      },
      {
        path:'/signup',
        Component: SignUp
      },
      {
        path:'/book-details/:id',
        Component: DetailsBook
      }
    ]
  },
]);