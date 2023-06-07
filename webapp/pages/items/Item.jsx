import {Link, useLoaderData, useLocation, useSearchParams} from "react-router-dom";
import {Buffer} from "buffer/";

export async function loader({params}) {
    const itemId = params.id
    const res = await fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    })
    return await res.json()
}

export default function Item() {
    const loaderData = useLoaderData()
    const [location] = useSearchParams()
    const prevLocation = location.get('from') ?? '/items'
    const errors = loaderData.message
    const item = loaderData.item

    const image = item.image?.data ? Buffer.from(item.image.data.data).toString('base64') : ''

    if (errors){
        return (
            <div className={'flex column'}>
                <Link to={prevLocation}>
                    <button>back</button>
                </Link>

                <h2>Error</h2>
                <h3>{errors}</h3>
            </div>
        )
    }

    else return (
        <div className={'flex column'}>
            <Link to={prevLocation}><button>back</button></Link>
            <Link to={'./edit'}><button>edit</button></Link>
            <Link to={'./delete'}><button>delete</button></Link>

            {image && <img alt={`Photo of ${item.name}`} src={`data:${item.image.contentType.substring(1)};base64,${image}`}/>}

            <h2>{item.name}</h2>
            <p>count: {item.count}</p>
            <p>price: {item.price}</p>
            <p>{item.description}</p>
        </div>
    )
}