import {Link} from "react-router-dom";
import BackButton from "./buttons/BackButton.jsx";

export default function ErrorComponent({errors, link}){
    return(
        <>
            <Link to={link ?? '..'}>
                <BackButton hex={'#CB1C85'}/>
            </Link>
            <div className={'text-center box-header text-center'}>
                <h2>Error</h2>
            </div>
            <div className={'margin-top flex column center'}>
                <h3>{errors}</h3>
            </div>
        </>
    )
}