import {Outlet, useLoaderData} from "react-router-dom";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";

export async function loader() {
    const res = await fetch(`${import.meta.env.VITE_URL}/profile`, {
        credentials: 'include'
    })
    if (res.status === 200) return {loggedIn: true}
    return {loggedIn: false}
}

export default function MainLayout() {
    const isLoggedIn = useLoaderData().loggedIn

    return (
        <>
            <Header isLoggedIn={isLoggedIn}/>
            <div className={'body'}>
                <Outlet context={isLoggedIn}/>
            </div>
            <Footer/>
        </>
    )
}