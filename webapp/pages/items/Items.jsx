import {Await, defer, Link, useLoaderData} from "react-router-dom";

import {bufferImgToBase64} from "./itemUtils.js";
import {Suspense} from "react";
import Loading from "../components/Loading.jsx";

export function loader() {
    const items = fetch('http://localhost:3000/items', {
        credentials: 'include'
    }).then(res => res.json())
    return defer({data: items})
}

export default function Items() {
    const loaderData = useLoaderData()

    const renderConditional = (data) => {
        const errors = data.message
        if (errors) return renderErrors(errors)

        if (data.items.length > 0) return renderItems(data.items)
        else return renderNoItems
    }

    const renderItems = (items) => items.map(item => {

        let image = ''
        if (item.image) {
            const {contentType, base64} = bufferImgToBase64(item.image, item.name)
            image =
                <img className={'item-img'} alt={`Photo of ${item.name}`} src={`data:${contentType};base64,${base64}`}/>
        }

        return (
            <div className={'box flex column center no-padding'} key={item._id}>
                {item.image ? image : <div className={'placeholder'}></div>}
                <div className={'item-info flex center column'}>
                    <Link to={`/items/${item._id}?from=/items`}>
                        <h3>{item.name}</h3>
                    </Link>
                    <hr/>
                    <p>count: {item.count}</p>
                    <p>price: {item.price}</p>
                    <Link to={`/items/${item._id}?from=/items`}>
                        <button style={{backgroundColor: '#CB1C85'}} className={'button-small'}>view</button>
                    </Link>
                </div>
            </div>
        )
    })

    const renderNoItems = (
        <div className={'loading flex column center'}>
            <h3>No items yet.</h3>
            <Link to={'./new'}>
                <button style={{backgroundColor: '#CB1C85'}} className={'button'}>
                    Create your first item
                </button>
            </Link>
        </div>
    )

    const renderErrors = (errors) => <div className={'loading flex column center'}><h3>{errors}</h3></div>

    return (
        <div className={'flex column'}>
            <div className={'text-center box-header'}>
                <h2>All items</h2>
            </div>
            <Suspense fallback={<Loading/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}