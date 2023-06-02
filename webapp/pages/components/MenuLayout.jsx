import {Link, Outlet, Route} from "react-router-dom";

export default function MenuLayout(){
    return(
        <div className={'main flex gap'}>
            <div className={'menu flex column gap'}>
                <h2>MY BOXIT</h2>
                <Link to={'./all'}>All boxes</Link>
                <Link to={'./items/all'}>All items</Link>
                <Link to={'./new'}>New box</Link>
                <Link to={'./items/new'}>New item</Link>
            </div>
            <Outlet/>
        </div>
    )
}