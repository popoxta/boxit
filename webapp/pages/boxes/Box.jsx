import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";
import Loading from "../../components/Loading.jsx";
import ItemComponent from "../../components/items/ItemComponent.jsx";
import ItemComponentPlus from "../../components/items/ItemComponentPlus.jsx";
import EditButton from "../../components/buttons/EditButton.jsx";
import DeleteButton from "../../components/buttons/DeleteButton.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";

export function loader({params}) {
    const boxId = params.id

    const box = fetch(`${import.meta.env.VITE_URL}/boxes/${boxId}`, {
        credentials: 'include'
    }).then(res => res.json())

    const items = fetch(`${import.meta.env.VITE_URL}/boxes/${boxId}/items`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: Promise.all([box, items])})
}

export default function Box() {
    const loaderData = useLoaderData()

    const renderConditional = (data) => {
        const errors = data[0].message || data[1].message
        if (errors) return <ErrorComponent errors={errors}/>
        else return renderBoxContents(data[0].box, data[1].items)
    }

    const renderBoxContents = (box, items) => {
        const hex = box.hex ?? '#CB1C85'

        return <>
            <div className={'text-center box-header text-center'}>
                <Link to={'..'}>
                    <BackButton hex={hex}/>
                </Link>
                <h2>{box.name}</h2>
                <div className={'flex gap-small buttons-right'}>
                    <Link to={'./edit'}>
                        <EditButton hex={hex}/>
                    </Link>
                    <Link to={'./delete'}>
                       <DeleteButton hex={hex}/>
                    </Link>
                </div>
            </div>
            {items.length > 0
                ? renderItems(items, box._id)
                : <div className={'margin-top flex column center'}>
                    <h3>No items yet.</h3>
                    <Link to={`/items/new?box=${box._id}`}>
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
            {<ItemComponentPlus box={id}/>}
        </div>


    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading header={'Loading Box...'}/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}