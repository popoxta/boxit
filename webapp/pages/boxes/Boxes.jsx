import {redirect, useLoaderData} from "react-router-dom";

export async function loader({request}) {
    const res = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    return await res.json()
}

export default function Boxes() {
    const loaderData = useLoaderData()
    const errors = loaderData.message

    const boxes = loaderData.boxes?.map(box => {
        return (
            <div className={'box'} key={box._id}>
                <h3
                    style={{color: box.hex ?? '#C04790'}}>
                    {box.name}
                </h3>
                <p>{box._id}</p>
            </div>
        )
    })

    return (
        <div className={'flex column'}>
            <h2>All boxes</h2>
            {errors
                ? errors
                : boxes.length > 0
                    ? boxes
                    : <h3>No boxes yet</h3>}
        </div>
    )
}