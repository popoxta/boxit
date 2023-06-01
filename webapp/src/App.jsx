import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import MainLayout from "../pages/components/main.jsx";
import Home from "../pages/home.jsx";
import ErrorPage from "../pages/errorpage.jsx";
import Register from "../pages/register.jsx";
import Login, {action as loginAction} from "../pages/login.jsx";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={'/'} element={<MainLayout/>} id={'root'} errorElement={<ErrorPage/>}>
        <Route index element={<Home/>}/>
        <Route path={'/register'} element={<Register/>}/>
        <Route path={'/login'} element={<Login/>} action={loginAction}/>
    </Route>
))

export default function App() {
  return <RouterProvider router={router}/>
}

