import {Link, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

export async function loader({params}) {
    const boxId = params.id
    const res = await fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    })
    return await res.json()
}

async function deleteBox(box) {
    const boxId = box._id

    const res = await fetch(`http://localhost:3000/boxes/${boxId}/delete`, {
        method: 'DELETE',
        credentials: 'include',
    })

    const result = await res.json()
    if (res.status === 200) return res
    else return result
}

export default function DeleteBox() {
    const loaderData = useLoaderData()
    const navigate = useNavigate()

    const [errors, setErrors] = useState(loaderData.message?.toString() ?? '')

    const box = loaderData.box
    const itemCount = Number(loaderData.itemCount)


    async function handleDelete() {

        const deletion = await deleteBox(box)
        console.log(deletion)
        if (deletion.status === 200) return navigate('/boxes')
        else setErrors(deletion.message)
    }

    return (
        <div className={'flex column'}>
            <Link to={'/boxes'}>
                <button>back</button>
            </Link>

            {errors
                ? <>
                    <h2>Error</h2>
                    <h3>{errors}</h3>
                </>
                : <>
                    <h2>{box.name}</h2>
                    {itemCount > 0
                        ? <>
                            <h3>This box has {itemCount} items, please delete or move them to continue.</h3>
                            <Link to={`../${box._id}`} >Go to items</Link>
                            </>
                        : <h3>Are you sure you want to delete {box.name}?</h3>
                    }
                    <button onClick={handleDelete} disabled={itemCount > 0}>Delete</button>
                </>
            }
        </div>
    )
}
