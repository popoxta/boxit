import {Await, defer, Link, useLoaderData, useLocation, useSearchParams} from "react-router-dom";
import {Buffer} from "buffer/";
import {Suspense} from "react";
import {bufferImgToBase64} from "./itemUtils.js";
import Loading from "../components/Loading.jsx";

export function loader({params}) {
    const itemId = params.id
    const item = fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    }).then(res => res.json())
    return defer({data: item})
}

export default function Item() {
    const loaderData = useLoaderData()
    const [location] = useSearchParams()
    const prevLocation = location.get('from') ?? '/items'

    const renderConditional = (data) => {
        const errors = data.message
        if (errors) return renderErrors(errors)
        else return renderItem(data.item)
    }

    const renderErrors = (errors) => {
        return (
            <>
                <h2>Error</h2>
                <h3>{errors}</h3>
            </>
        )
    }

    const renderItem = (item) => {
        let image = ''
        if (item.image){
            const {contentType, base64} = bufferImgToBase64(item.image, item.name)
            image = <img alt={`Photo of ${item.name}`} src={`data:${contentType};base64,${base64}`}/>
        }

        return (
            <>
                <Link to={'./edit'}>
                    <button>edit</button>
                </Link>
                <Link to={'./delete'}>
                    <button>delete</button>
                </Link>

                {item.image && image}

                <h2>{item.name}</h2>
                <p>count: {item.count}</p>
                <p>price: {item.price}</p>
                <p>{item.description}</p>
            </>
        )
    }

    return (
        <div className={'flex column'}>
            <Link to={prevLocation}>
                <button>back</button>
            </Link>
            <Suspense fallback={<Loading/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )

}