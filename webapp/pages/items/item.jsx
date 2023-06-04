import {useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const itemId = params.id
    const res = await fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    })
    return await res.json()
}

export default function Box() {
    const loaderData = useLoaderData()
    const errors = loaderData.message

    const item = loaderData.item

    return (
        <div>
            <h1>item</h1>
            <h2>{item.name ?? 'Does not exist'}</h2>
        </div>
    )
}