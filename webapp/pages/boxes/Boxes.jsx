import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";

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
        if (boxes.length > 0) {
            return (
                boxes.map(box => <div className={'box'} key={box._id}>
                        <Link to={`./${box._id}`}>
                            <h3 style={{color: box.hex ?? '#C04790'}}>{box.name}</h3>
                        </Link>
                        <p>{box._id}</p>
                    </div>
                ))
        } else return (
            <>
                <h3>No boxes yet.</h3>
                <Link to={'./new'}>Create your first box</Link>
            </>
        )
    }

    const renderError = (errors) => <h3>{errors}</h3>

    return (
        <div className={'flex column'}>
            <h2>All boxes</h2>
            <Suspense fallback={<h3>Loading...</h3>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}