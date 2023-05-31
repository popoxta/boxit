import {Outlet} from "react-router-dom";
import Header from "./header.jsx";

export default function MainLayout() {
    return (
        <>
            <Header/>
            <h1>Main Layout</h1>
            <Outlet/>
        </>
    )
}