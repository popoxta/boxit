import {Link} from "react-router-dom";

export default function BoxComponentPlus() {
    return (
        <Link to={`/boxes/new`}>
            <div className={'box flex center add-item center-justify'}>
                <span>+</span>
            </div>
        </Link>
    )
}