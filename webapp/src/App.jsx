import {createBrowserRouter, createRoutesFromElements, Link, Route, RouterProvider} from "react-router-dom";
import MainLayout, {loader as mainLoader} from "../pages/components/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Register, {action as registerAction} from "../pages/login/Register.jsx";
import Login, {action as loginAction} from "../pages/login/Login.jsx";
import Boxes, {loader as boxesLoader} from "../pages/boxes/Boxes.jsx";
import BoxLayout from "../pages/components/BoxLayout.jsx";
import Box, {loader as boxLoader} from "../pages/boxes/Box.jsx";
import NewBox, {action as newBoxAction} from "../pages/boxes/NewBox.jsx"
import Item, {loader as itemLoader} from "../pages/items/Item.jsx"
import Items, {loader as itemsLoader} from "../pages/items/Items.jsx";
import EditBox, {loader as editBoxLoader, action as editBoxAction} from "../pages/boxes/EditBox.jsx";
import NewItem, {action as newItemAction, loader as newItemLoader} from "../pages/items/NewItem.jsx"
import EditItem, {action as editItemAction, loader as editItemLoader} from "../pages/items/EditItem.jsx";
import DeleteItem, {loader as deleteItemLoader} from "../pages/items/DeleteItem.jsx";
import DeleteBox, {loader as deleteBoxLoader} from "../pages/boxes/DeleteBox.jsx";
import Logout from "../pages/login/Logout.jsx";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={'/'} element={<MainLayout/>} loader={mainLoader} id={'root'} errorElement={<ErrorPage/>}>
        <Route index element={<Home/>} />
        <Route path={'/register'} element={<Register/>} action={registerAction}/>
        <Route path={'/login'} element={<Login/>} action={loginAction}/>
        <Route path={'/logout'} element={<Logout/>}/>

        <Route element={<BoxLayout/>}>
            <Route path={'/boxes'}>
                <Route index element={<Boxes/>} loader={boxesLoader}/>
                <Route path={'new'} element={<NewBox/>} action={newBoxAction}/>
                <Route path={':id/'} element={<Box/>} loader={boxLoader}/>
                <Route path={':id/edit'} element={<EditBox/>} loader={editBoxLoader} action={editBoxAction}/>
                <Route path={':id/delete'} element={<DeleteBox/>} loader={deleteBoxLoader}/>
            </Route>

            <Route path={'/items'}>
                <Route index element={<Items/>} loader={itemsLoader}/>
                <Route path={'new'} element={<NewItem/>} action={newItemAction} loader={newItemLoader}/>
                <Route path={':id'} element={<Item/>} loader={itemLoader}/>
                <Route path={':id/edit'} element={<EditItem/>} action={editItemAction} loader={editItemLoader}/>
                <Route path={':id/delete'} element={<DeleteItem/>} loader={deleteItemLoader}/>
            </Route>

        </Route>
    </Route>
))

export default function App() {
  return <RouterProvider router={router}/>
}

