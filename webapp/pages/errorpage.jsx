import Header from "./components/header.jsx";
import {useRouteError} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError()
    return (
        <>
            <Header/>
            <h2>OOPS! An error has occurred...</h2>
            <h3>{error.message}</h3>
        </>
    )
}