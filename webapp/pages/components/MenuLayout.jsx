import {Link, Outlet} from "react-router-dom";

export default function MenuLayout(){
    return(
        <div className={'main flex gap'}>
            <div className={'menu flex column gap'}>
                <h2>MY BOXIT</h2>
                <Link to={'/all-boxes'}>All boxes</Link>
                <Link to={'/all-items'}>All items</Link>
                <Link to={'/new-box'}>New box</Link>
                <Link to={'/new-item'}>New item</Link>
            </div>
            <Outlet/>
        </div>
    )
}