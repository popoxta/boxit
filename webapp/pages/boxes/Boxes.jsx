import {redirect, useLoaderData} from "react-router-dom";

export async function loader({request}) {
    // todo MOVE THIS INTO LAYOUT
    const res = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    if (res.status !== 200) return redirect('/login') // todo add a nice msg for the user
    return await res.json()
}

export default function Boxes() {
    const loaderData = useLoaderData()

    const boxes = loaderData.boxes.map(box => {
        return(
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
            {boxes.length > 0 ? boxes : <h3>No boxes yet</h3>}
        </div>
    )
}