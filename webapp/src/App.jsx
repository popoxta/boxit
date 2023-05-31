import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import MainLayout from "../components/main.jsx";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={'/'} element={<MainLayout/>} id={'root'}>

    </Route>
))

export default function App() {
  return <RouterProvider router={router}/>
}

