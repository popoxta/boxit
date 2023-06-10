import Header from "./components/Header.jsx";
import {useRouteError} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError()
    return (
        <>
            <Header/>
            <div className={'flex column center'}>
                <h2>OOPS! An error has occurred...</h2>
                <h3>{error.message}</h3>
            </div>
        </>
    )
}