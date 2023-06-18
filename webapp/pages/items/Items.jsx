import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";
import Loading from "../components/Loading.jsx";
import ItemComponent from "../components/ItemComponent.jsx";
import ItemComponentPlus from "../components/ItemComponentPlus.jsx";
import ErrorComponent from "../components/ErrorComponent.jsx";
import BackButton from "../components/BackButton.jsx";

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
        if (errors) return <ErrorComponent errors={errors}/>
        if (data.items.length > 0) return renderItems(data.items)
        else return renderNoItems
    }

    const renderItems = (items) =>
        <>
            <div className={'text-center box-header text-center'}>
                <Link to={'..'}>
                    <BackButton hex={'#CB1C85'}/>
                </Link>
                <h2>All items</h2>
            </div>
            <div className={'flex wrap center-justify'}>
                {items.map(item => <ItemComponent key={item._id} item={item} from={'/items'}/>)}
                {<ItemComponentPlus/>}
            </div>
        </>

    const renderNoItems = (
        <>
            <div className={'text-center box-header text-center'}>
                <Link to={'..'}>
                    <BackButton hex={'#CB1C85'}/>
                </Link>
                <h2>All items</h2>
            </div>
            <div className={'margin-top flex column center'}>
                <Link to={'./new'}>
                    <button style={{backgroundColor: '#CB1C85'}} className={'button'}>
                        Create your first item
                    </button>
                </Link>
            </div>
        </>
    )

    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading header={'Loading items...'}/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}