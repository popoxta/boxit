import {Link, useLoaderData} from "react-router-dom";
import {Buffer} from "buffer/";

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

        const image = item.image?.data ? Buffer.from(item.image.data.data).toString('base64') : ''

        return (
            <div className={'box'} key={item._id}>
                {image && <img alt={`Photo of ${item.name}`} src={`data:${item.image.contentType.substring(1)};base64,${image}`}/>}
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