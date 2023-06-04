import {Link, useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const boxId = params.id
    const res = await fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    })
    return await res.json()
}

export default function Box() {
    const loaderData = useLoaderData()
    const errors = loaderData.message

    const box = loaderData.box
    const items = loaderData.items?.map(item => {
        return (
            <div className={'box'} key={item._id}>
                <h3>{item.name}</h3>
                <p>count: {item.count}</p>
                <p>price: {item.price}</p>
                <Link to={`/items/${item._id}`}><button>view</button></Link>
            </div>
        )
    })

    return (
        <div className={'flex column'}>
            <h2>{box.name ?? 'Error'}</h2>
            {errors && <h3>{errors}</h3>}

            {items.length > 0
                ?
                <div className={'flex gap'}>
                    {items}
                </div>
                : <h3>No items yet</h3>
            }
        </div>
    )
}