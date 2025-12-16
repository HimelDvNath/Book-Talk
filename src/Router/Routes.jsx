import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/HomeLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
  },
]);