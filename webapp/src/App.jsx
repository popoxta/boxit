import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import MainLayout from "../pages/components/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Register, {action as registerAction} from "../pages/Register.jsx";
import Login, {action as loginAction} from "../pages/Login.jsx";
import Boxes, {loader as boxesLoader} from "../pages/Boxes.jsx";
import MenuLayout from "../pages/components/MenuLayout.jsx";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={'/'} element={<MainLayout/>} id={'root'} errorElement={<ErrorPage/>}>
        <Route index element={<Home/>} />
        <Route path={'/register'} element={<Register/>} action={registerAction}/>
        <Route path={'/login'} element={<Login/>} action={loginAction}/>

        <Route path={'/boxes'} element={<MenuLayout/>}>
            <Route index element={<Boxes/>} loader={boxesLoader}/>
        </Route>
    </Route>
))

export default function App() {
  return <RouterProvider router={router}/>
}

