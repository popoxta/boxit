import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";

export function loader({params}) {
    const boxId = params.id

    const box = fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    }).then(res => res.json())

    const items = fetch(`http://localhost:3000/boxes/${boxId}/items`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: Promise.all([box, items])})
}

export default function Box() {
    const loaderData = useLoaderData()

    const renderConditional = (data) => {
        const errors = data[0].message || data[1].message
        if (errors) return renderErrors(errors)
        else return renderBoxContents(data[0].box, data[1].items)
    }

    const renderBoxContents = (box, items) => {
        return <>
            <Link to={'./edit'}>
                <button>edit</button>
            </Link>
            <Link to={'./delete'}>
                <button>delete</button>
            </Link>
            <h2>{box.name}</h2>
            {items.length > 0
                ? renderItems(items, box._id)
                : <h3>No items yet</h3>
            }
        </>
    }

    const renderItems = (items, id) => items.map(item =>
        <div className={'box'} key={item._id}>
            <h3>{item.name}</h3>
            <p>count: {item.count}</p>
            <p>price: {item.price}</p>
            <Link to={`/items/${item._id}?from=/boxes/${id}`}>
                <button>view</button>
            </Link>
        </div>
    )

    const renderErrors = (errors) =>
        <div className={'flex column'}>
            <h2>Error</h2>
            <h3>{errors}</h3>
        </div>

    return (
        <div className={'flex column'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>
            <Suspense fallback={<h3>Loading...</h3>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}