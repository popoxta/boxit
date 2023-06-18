import {Link} from "react-router-dom";

export default function ItemComponentPlus({box}) {
    const linkFrom = box ? `?box=${box}` : ''
    return (
        <Link to={`/items/new${linkFrom}`}>
            <div className={'box flex center add-item center-justify'}>
                <span>+</span>
            </div>
        </Link>
    )
}