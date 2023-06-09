import {Link} from "react-router-dom";

export default function Header({isLoggedIn}) {

    const userLinks = () => {
        if (isLoggedIn) return <Link to={'/logout'}>log out</Link>
        else return (
            <>
                <Link to={'/register'}>register</Link>
                <Link to={'/login'}>login</Link>
            </>
        )
    }

    return (
        <div className={'header shadow flex apart'}>
            <Link to={'/'}><h1>BOXIT</h1></Link>

            <div className={'flex'}>
                <Link to={'/boxes'}>boxes</Link>
                {userLinks()}
            </div>

        </div>
    )
}