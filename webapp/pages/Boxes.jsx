import {useLoaderData} from "react-router-dom";

export async function loader({request}) {
    const res = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    return await res.json()
}

export default function Boxes() {
    const loaderData = useLoaderData()

    return (
        <div className={'flex column'}>
            <h2>User boxes go here...</h2>
            {loaderData && <h3>{loaderData.message}</h3>}
        </div>
    )
}