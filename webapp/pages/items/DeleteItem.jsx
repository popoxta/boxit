import {Link, useLoaderData, useSearchParams} from "react-router-dom";
export async function loader({params}) {
    const itemId = params.id
    const res = await fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    })
    return await res.json()
}

async function deleteItem(item){
    console.log(item._id)
}

export default function DeleteItem() {
    const loaderData = useLoaderData()
    const [location] = useSearchParams()
    const prevLocation = location.get('from') ?? '/items'
    const errors = loaderData.message
    const item = loaderData.item

    return (
        <div className={'flex column'}>
            <Link to={prevLocation}>
                <button>back</button>
            </Link>

            {errors
                ? <>
                    <h2>Error</h2>
                    <h3>{errors.message}</h3>
                </>
                : <>
                    <h2>{item.name}</h2>
                    <h3>Are you sure you want to delete {item.name}?</h3>
                    <button onClick={()=>deleteItem(item)}>Delete</button>
                </>
            }
        </div>
    )
}
