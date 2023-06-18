import {Link, Outlet, redirect} from "react-router-dom";

export async function loader({request}) {
    const res = await fetch('http://localhost:3000/profile', {
        credentials: 'include'
    })
    if (res.status !== 200) return redirect('/login?message=Please login or register to use Boxit.') // todo add a nice msg for the user
    return null
}

export default function BoxLayout() {
    return (
        <div className={'main flex gap'}>
            <div className={'menu flex column gap'}>
                <Link to={'/boxes'}>
                    <h2 className={'no-btm-margin spaced pink-hover'}>MY BOXIT</h2>
                </Link>
                <hr/>
                <div className={'links flex column gap'}>
                    <Link className={'pink-hover'} to={'/boxes'}>All boxes</Link>
                    <Link className={'pink-hover'} to={'/items'}>All items</Link>
                </div>
                <hr/>
                <div className={'links flex column gap'}>
                    <Link className={'pink-hover'} to={'/boxes/new'}>New box</Link>
                    <Link className={'pink-hover'} to={'/items/new'}>New item</Link>
                </div>
            </div>
            <div className={'content'}>
                <Outlet/>
            </div>
        </div>
    )
}