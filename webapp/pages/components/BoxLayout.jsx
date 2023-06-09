import {Link, Outlet, redirect, useOutletContext} from "react-router-dom";

export default function BoxLayout(){
    const isLoggedIn = useOutletContext()
    if (!isLoggedIn) redirect('/login')

    return(
        <div className={'main flex gap'}>
            <div className={'menu flex column gap'}>
                <h2>MY BOXIT</h2>
                <Link to={'/boxes'}>All boxes</Link>
                <Link to={'/items'}>All items</Link>
                <Link to={'/boxes/new'}>New box</Link>
                <Link to={'/items/new'}>New item</Link>
            </div>
            <Outlet/>
        </div>
    )
}