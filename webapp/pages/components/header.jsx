import {Link} from "react-router-dom";

export function action({request}) {

}

export default function Header() {
    return (
        <div className={'header shadow flex apart'}>
            <Link to={'/'}><h1>BOXIT</h1></Link>

            <div className={'flex'}>
                <Link to={'/boxes'}>boxes</Link>
                <Link to={'/register'}>register</Link>
                <Link to={'/login'}>login</Link>
            </div>

        </div>
    )
}