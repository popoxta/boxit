import {Await, defer, Link, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import {Suspense, useState} from "react";
import Loading from "../../components/Loading.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";

export function loader({params}) {
    const itemId = params.id
    const item = fetch(`${import.meta.env.VITE_URL}/items/${itemId}`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: item})
}

async function deleteItem(item) {
    const itemId = item._id

    const res = await fetch(`${import.meta.env.VITE_URL}/items/${itemId}/delete`, {
        method: 'DELETE',
        credentials: 'include',
    })

    const result = await res.json()
    if (res.status === 200) return res
    else return result
}

export default function DeleteItem() {
    const loaderData = useLoaderData()
    const [location] = useSearchParams()
    const navigate = useNavigate()

    const [responseErrors, setResponseErrors] = useState({message: ''})
    const prevLocation = location.get('from') ?? '/items'

    async function handleDelete(item) {
        const deletion = await deleteItem(item)
        if (deletion.status === 200) return navigate(prevLocation)
        else setResponseErrors({message: deletion.message})
    }

    const conditionalRender = (data) => {
        const errors = data.message || responseErrors.message
        if (errors) return <ErrorComponent errors={errors}/>
        else return renderView(data)
    }

    const renderView = (data) => {
        const item = data.item
        return (
            <>
                <div className={'text-center box-header text-center'}>
                    <Link to={'..'}>
                        <BackButton hex={'#CB1C85'}/>
                    </Link>
                    <h2>{item.name}</h2>
                </div>
                <div className={'margin-top flex column center'}>
                    <h3>Are you sure you want to delete {item.name}?</h3>
                    <button className={'button'} style={{backgroundColor: '#CB1C85'}}
                            onClick={() => handleDelete(item)}>Delete
                    </button>
                </div>
            </>
        )
    }


    return (
        <div className={'flex column'}>

            <Suspense fallback={<Loading header={'Loading item...'}/>}>
                <Await resolve={loaderData.data}>
                    {conditionalRender}
                </Await>
            </Suspense>
        </div>
    )
}

