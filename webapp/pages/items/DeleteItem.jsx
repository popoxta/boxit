import {Await, defer, Link, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import {Suspense, useState} from "react";

export function loader({params}) {
    const itemId = params.id
    const item = fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: item})
}

async function deleteItem(item) {
    const itemId = item._id

    const res = await fetch(`http://localhost:3000/items/${itemId}/delete`, {
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
        if (errors) return renderErrors(errors)
        else return renderView(data)
    }

    const renderView = (data) => {
        const item = data.item
        return (
            <>
                <h3>Are you sure you want to delete {item.name}?</h3>
                <button onClick={() => handleDelete(item)}>Delete</button>
            </>
        )
    }

    const renderErrors = (errors) => <h3>{errors}</h3>

    return (
        <div className={'flex column'}>
            <Link to={prevLocation}>
                <button>back</button>
            </Link>

            <h2>Delete Item</h2>
            <Suspense fallback={<h3>Loading...</h3>}>
                <Await resolve={loaderData.data}>
                    {conditionalRender}
                </Await>
            </Suspense>
        </div>
    )
}

