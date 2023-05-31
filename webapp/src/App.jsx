import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import MainLayout from "../pages/components/main.jsx";
import Home from "../pages/home.jsx";
import ErrorPage from "../pages/errorpage.jsx";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={'/'} element={<MainLayout/>} id={'root'} errorElement={<ErrorPage/>}>
        <Route index element={<Home/>}/>
    </Route>
))

export default function App() {
  return <RouterProvider router={router}/>
}

