import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";
import Loading from "../components/Loading.jsx";
import ItemComponent from "../components/ItemComponent.jsx";

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

    const renderItems = (items) =>
        <div className={'flex wrap center-justify'}>
            {items.map(item => <ItemComponent item={item} from={'/items'}/>)}
        </div>

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