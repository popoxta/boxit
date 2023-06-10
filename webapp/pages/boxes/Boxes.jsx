import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";
import {BoxComponent} from "../components/BoxComponent.jsx";
import Loading from "../components/Loading.jsx";

export function loader() {
    const boxes = fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: boxes})
}

export default function Boxes() {
    const loaderData = useLoaderData()

    const renderConditional = (data) => {
        const errors = data.message
        if (errors) return renderError(errors)
        else return renderBoxes(data.boxes)
    }

    const renderBoxes = (boxes) => {
        console.log(boxes)
        if (boxes.length > 0) {
            return (
                <div className={'flex wrap center-justify'}>
                    {boxes.map(box => BoxComponent({box}))}
                </div>
            )
        } else return (
            <div className={'loading flex column center'}>
                <h3>No boxes yet.</h3>
                <Link to={'./new'}>
                    <button style={{backgroundColor: '#CB1C85'}} className={'button'}>
                        Create your first box
                    </button>
                </Link>
            </div>
        )
    }

    const renderError = (errors) => <div className={'loading flex column center'}><h3>{errors}</h3></div>

    return (
        <div className={'flex column'}>
            <div className={'text-center box-header'}>
                <h2>All boxes</h2>
            </div>
            <Suspense fallback={<Loading/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}