import {Await, defer, Link, useLoaderData, useSearchParams} from "react-router-dom";
import {Suspense} from "react";
import {bufferImgToBase64} from "./itemUtils.js";
import Loading from "../components/Loading.jsx";
import EditButton from "../components/EditButton.jsx";
import DeleteButton from "../components/DeleteButton.jsx";
import ErrorComponent from "../components/ErrorComponent.jsx";
import BackButton from "../components/BackButton.jsx";

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
        if (errors) return <ErrorComponent errors={errors} link={prevLocation}/>
        else return renderItem(data.item)
    }

    const renderItem = (item) => {
        const hex = item.box.hex ?? '#CB1C85'
        let image = ''
        if (item.image) {
            const {contentType, base64} = bufferImgToBase64(item.image, item.name)
            image = <img className={'preview-img'} alt={`Photo of ${item.name}`}
                         src={`data:${contentType};base64,${base64}`}/>
        }

        return (
            <div className={'flex column'}>
                <div className={'text-center box-header text-center'}>
                    <Link to={prevLocation}>
                        <BackButton hex={hex}/>
                    </Link>
                    <div className={'buttons-right flex gap-small'}>
                        <Link to={'./edit'}>
                            <EditButton hex={hex}/>
                        </Link>
                        <Link to={'./delete'}>
                            <DeleteButton hex={hex}/>
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
            <Suspense fallback={<Loading header={'Loading item...'}/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )

}