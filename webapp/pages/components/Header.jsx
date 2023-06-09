import {Link} from "react-router-dom";

export default function Header({isLoggedIn}) {

    const userLinks = () => {
        if (isLoggedIn) return <Link className={'pink-hover'} to={'/logout'}>log out</Link>
        else return (
            <>
                <Link className={'pink-hover'} to={'/register'}>register</Link>
                <Link className={'pink-hover'} to={'/login'}>login</Link>
            </>
        )
    }

    return (
        <header className={'header shadow flex apart'}>
            <Link to={'/'} className={'flex center pink-hover'}>
                <svg className={'cube-logo'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill={'#CB1C85'} d="M2 18.66l10.5 4.313L23 18.661V6.444L12.5 2.13 2 6.444zm20-.67l-9 3.697V11.102l9-3.68zM12.5 3.213l8.557 3.514-8.557 3.5-8.557-3.5zM3 7.422l9 3.68v10.585L3 17.99z"/>
                    <path fill="none" d="M0 0h24v24H0z"/>
                </svg>
                <h1 className={'pink-hover spaced'}>BOXIT</h1>
            </Link>

            <nav className={'flex gap header-links'}>
                <Link className={'pink-hover'} to={'/boxes'}>boxes</Link>
                {userLinks()}
            </nav>

        </header>
    )
}