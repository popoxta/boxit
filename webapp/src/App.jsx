import {createBrowserRouter, createRoutesFromElements, Link, Route, RouterProvider} from "react-router-dom";
import MainLayout from "../pages/components/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Register, {action as registerAction} from "../pages/login/Register.jsx";
import Login, {action as loginAction} from "../pages/login/Login.jsx";
import Boxes, {loader as boxesLoader} from "../pages/boxes/Boxes.jsx";
import BoxLayout, {loader as boxLayoutLoader} from "../pages/components/BoxLayout.jsx";
import Box, {loader as boxLoader} from "../pages/boxes/Box.jsx";
import Item, {loader as itemLoader} from "../pages/items/Item.jsx"

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={'/'} element={<MainLayout/>} id={'root'} errorElement={<ErrorPage/>}>
        <Route index element={<Home/>} />
        <Route path={'/register'} element={<Register/>} action={registerAction}/>
        <Route path={'/login'} element={<Login/>} action={loginAction}/>

        <Route element={<BoxLayout/>} loader={boxLayoutLoader}>
            <Route path={'/boxes'}>
                <Route index element={<Boxes/>} loader={boxesLoader}/>
                <Route path={'all'} element={<h2>NOT IMPLEMENTED</h2>}/>
                <Route path={'new'} element={<h2>NOT IMPLEMENTED</h2>}/>
                <Route path={':id/'} element={<Box/>} loader={boxLoader}/>
                <Route path={':id/edit'} element={<h2>NOT IMPLEMENTED</h2>}/>
                <Route path={':id/delete'} element={<h2>NOT IMPLEMENTED</h2>}/>
            </Route>

            <Route path={'/items'}>
                <Route path={'all'} element={<h2>NOT IMPLEMENTED</h2>}/>
                <Route path={'new'} element={<h2>NOT IMPLEMENTED</h2>}/>
                <Route path={':id'} element={<Item/>} loader={itemLoader}/>
                <Route path={':id/edit'} element={<h2>NOT IMPLEMENTED</h2>}/>
                <Route path={':id/delete'} element={<h2>NOT IMPLEMENTED</h2>}/>
            </Route>

        </Route>
    </Route>
))

export default function App() {
  return <RouterProvider router={router}/>
}

