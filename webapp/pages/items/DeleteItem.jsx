import {Link, redirect, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
export async function loader({params}) {
    const itemId = params.id
    const res = await fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    })
    return await res.json()
}

async function deleteItem(item){
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

    const prevLocation = location.get('from') ?? '/items'

    let errors = loaderData.message
    const item = loaderData.item

    async function handleDelete() {
        const deletion = await deleteItem(item)
        if (deletion.status === 200) return navigate(prevLocation)
        else errors = deletion.message
    }

    return (
        <div className={'flex column'}>
            <Link to={prevLocation}>
                <button>back</button>
            </Link>

            {errors
                ? <>
                    <h2>Error</h2>
                    <h3>{errors}</h3>
                </>
                : <>
                    <h2>{item.name}</h2>
                    <h3>Are you sure you want to delete {item.name}?</h3>
                    <button onClick={handleDelete}>Delete</button>
                </>
            }
        </div>
    )
}
