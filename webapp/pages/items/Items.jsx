import {Link, useLoaderData} from "react-router-dom";

export async function loader({request}) {
    const res = await fetch('http://localhost:3000/items', {
        credentials: 'include'
    })
    return await res.json()
}

export default function Items() {
    const loaderData = useLoaderData()
    const errors = loaderData.message

    const items = loaderData.items?.map(item => {
        return (
            <div className={'box'} key={item._id}>
                <h3>{item.name}</h3>
                <p>count: {item.count}</p>
                <p>price: {item.price}</p>
                <Link to={`/items/${item._id}?from=/items`}>
                    <button>view</button>
                </Link>
            </div>
        )
    })

    return (
        <div className={'flex column'}>
            <h2>All items</h2>
            {errors
                ? errors
                : items.length > 0
                    ? <div className={'flex gap'}>{items}</div>
                    : <h3>No items yet</h3>}
        </div>
    )
}