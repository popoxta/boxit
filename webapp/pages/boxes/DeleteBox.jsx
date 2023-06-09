import {Await, defer, Link, useLoaderData, useNavigate} from "react-router-dom";
import {Suspense, useState} from "react";
import Loading from "../components/Loading.jsx";

export function loader({params}) {
    const boxId = params.id
    const box = fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: box})
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

    const [responseErrors, setResponseErrors] = useState({message: ''})

    async function handleDelete(box) {
        const deletion = await deleteBox(box)
        if (deletion.status === 200) return navigate('/boxes')
        else setResponseErrors({message: deletion.message})
    }

    const conditionalRender = (data) => {
        const errors = data.message || responseErrors.message
        if (errors) return renderErrors(errors)
        else return renderView(data)
    }

    const renderView = (data) => {
        const itemCount = Number(data.itemCount)
        const box = data.box

        if (itemCount > 0) {
            return (
                <> className={'loading flex column center'}>
                    <h3>{box.name} has {itemCount} items, please delete or move them to continue.</h3>
                    <Link to={`../${box._id}`}>Go to items</Link>
                </>
            )
        } else {
            return (
                <>
                    <h3>Are you sure you want to delete {box.name}?</h3>
                    <button className={'button'} style={{backgroundColor: box.hex}} onClick={() => handleDelete(box)}>Delete</button>
                </>
            )
        }
    }

    const renderErrors = (errors) => <h3>{errors}</h3>

    return (
        <div className={'flex column'}>
            <div className={'text-center box-header text-center'}>
                <Link to={'/boxes'}>
                    <button className={'back-button'}>{'<'}</button>
                </Link>
                <h2>Delete Box</h2>
            </div>
            <div className={'loading flex column center'}>
            <Suspense fallback={<Loading/>}>
                <Await resolve={loaderData.data}>
                    {conditionalRender}
                </Await>
            </Suspense>
            </div>
        </div>
    )
}
