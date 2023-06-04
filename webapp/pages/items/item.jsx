import {Link, useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const itemId = params.id
    const res = await fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    })
    return await res.json()
}

export default function Item() {
    const loaderData = useLoaderData()
    const errors = loaderData.message
    const item = loaderData.item

    if (errors){
        return (
            <div className={'flex column'}>
                <Link to={''}> {/* todo add link w search params*/}
                    <button>back</button>
                </Link>

                <h2>Error</h2>
                <h3>{errors}</h3>
            </div>
        )
    }

    else return (
        <div className={'flex column'}>
            <Link to={''}><button>back</button></Link> {/* todo add back link using search params*/}
            <Link to={'./edit'}><button>edit</button></Link>
            <Link to={'./delete'}><button>delete</button></Link>

            <h2>{item.name}</h2>
            <p>count: {item.count}</p>
            <p>price: {item.price}</p>
            <p>{item.description}</p>
        </div>
    )
}