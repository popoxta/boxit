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
            <div className={'flex column'}>
                <div className={'text-center box-header text-center'}>
                    <Link to={prevLocation}>
                        <button className={'back-button'}>{'<'}</button>
                    </Link>
                    <h2>Error</h2>
                </div>
                <h3 className={'loading flex column center'}>{errors}</h3>
            </div>
        )
    }

    const renderItem = (item) => {
        const hex = item.box.hex ?? '#CB1C85'
        let image = ''
        if (item.image) {
            const {contentType, base64} = bufferImgToBase64(item.image, item.name)
            image = <img className={'preview-img'} alt={`Photo of ${item.name}`} src={`data:${contentType};base64,${base64}`}/>
        }

        return (
            <div className={'flex column'}>
                <div className={'text-center box-header text-center'}>
                    <Link to={prevLocation}>
                        <button className={'back-button'}>{'<'}</button>
                    </Link>
                    <div className={'buttons-right flex gap-small'}>
                        <Link to={'./edit'}>
                            <button style={{backgroundColor: hex}} className={'button-small'}>edit</button>
                        </Link>
                        <Link to={'./delete'}>
                            <button style={{backgroundColor: hex}} className={'button-small'}>delete</button>
                        </Link>
                    </div>
                    <h2>{item.name}</h2>
                </div>

                <div className={'item-view flex center gap'}>
                    {item.image && image}
                    <div className={'grow'}>
                        <h3>{item.name}</h3>
                        <hr/>
                        <p><span style={{color: hex}}>count:</span> {item.count}</p>
                        <p><span style={{color: hex}}>price:</span> {item.price}</p>
                        <p>{item.description}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )

}