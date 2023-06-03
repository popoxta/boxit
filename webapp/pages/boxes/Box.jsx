import {useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const boxId = params.id
    const res = await fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    })

    return await res.json()
}

export default function Box() {
    const loaderData = useLoaderData()

    return (
        <h1>{'box'}</h1>
    )
}