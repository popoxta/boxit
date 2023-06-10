import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";
import Loading from "../components/Loading.jsx";
import Item from "../items/Item.jsx";
import ItemComponent from "../components/ItemComponent.jsx";

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
        const hex = box.hex ?? '#CB1C85'

        return <>
            <div className={'text-center box-header text-center'}>
                <h2>{box.name}</h2>
                <div className={'flex gap-small buttons-right'}>
                    <Link to={'./edit'}>
                        <button
                            style={{backgroundColor: hex}}
                            className={'button-small'}>edit
                        </button>
                    </Link>
                    <Link to={'./delete'}>
                        <button
                            style={{backgroundColor: hex}}
                            className={'button-small'}>delete
                        </button>
                    </Link>
                </div>
            </div>
            {items.length > 0
                ? renderItems(items, box._id)
                : <div className={'loading flex column center'}>
                    <h3>No items yet.</h3>
                    <Link to={'/items/new'}>
                        <button style={{backgroundColor: box.hex}} className={'button'}>
                            Create your first item
                        </button>
                    </Link>
                </div>
            }
        </>
    }

    const renderItems = (items, id) =>
        <div className={'flex wrap center-justify'}>
            {items.map(item => <ItemComponent key={item._id} item={item} from={`/boxes/${id}`}/>)}
        </div>

    const renderErrors = (errors) =>
        <>
            <div className={'text-center box-header text-center'}>
                <h2>Error</h2>
            </div>
            <div className={'loading flex column center'}>
                <h3>{errors}</h3>
            </div>
        </>

    return (
        <div className={'flex column'}>
            <Link to={'..'}>
                <button className={'back-button'}>{'<'}</button>
            </Link>
            <Suspense fallback={
                <>
                    <div className={'text-center box-header text-center'}>
                        <h2>Loading Box...</h2>
                    </div>
                    <Loading/>
                </>
            }>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}