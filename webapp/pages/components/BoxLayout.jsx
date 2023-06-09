import {Link, Outlet, redirect} from "react-router-dom";

export async function loader({request}) {
    const res = await fetch('http://localhost:3000/profile', {
        credentials: 'include'
    })
    if (res.status !== 200) return redirect('/login?message=Please login or register to use Boxit.') // todo add a nice msg for the user
    return null
}

export default function BoxLayout(){
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