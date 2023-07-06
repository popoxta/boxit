import {Await, defer, Link, useLoaderData, useNavigate} from "react-router-dom";
import {Suspense, useState} from "react";
import Loading from "../../components/Loading.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";

export function loader({params}) {
    const boxId = params.id
    const box = fetch(`${import.meta.env.VITE_URL}/boxes/${boxId}`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: box})
}

async function deleteBox(box) {
    const boxId = box._id

    const res = await fetch(`${import.meta.env.VITE_URL}0/boxes/${boxId}/delete`, {
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
        if (errors) return <ErrorComponent errors={errors}/>
        else return renderView(data)
    }

    const renderView = (data) => {
        const itemCount = Number(data.itemCount) //todo reinstate this
        const box = data.box
        const hex = box.hex ?? '#CB1C85'

        if (itemCount > 0) {
            return (
                <>
                    <div className={'text-center box-header text-center'}>
                        <Link to={'..'}>
                            <BackButton hex={box.hex}/>
                        </Link>
                        <h2>{box.name}</h2>
                    </div>
                    <div className={'margin-top flex column center'}>
                        <h3>{box.name} has {itemCount} items, please delete or move them to continue.</h3>
                        <Link to={`../${box._id}`}><button style={{backgroundColor: hex}} className={'button'}>Go to items</button></Link>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className={'text-center box-header text-center'}>
                        <Link to={'..'}>
                            <BackButton hex={box.hex}/>
                        </Link>
                        <h2>{box.name}</h2>
                    </div>
                    <div className={'margin-top flex column center'}>
                        <h3>Are you sure you want to delete {box.name}?</h3>
                        <button className={'button'} style={{backgroundColor: box.hex}}
                                onClick={() => handleDelete(box)}>Delete
                        </button>
                    </div>
                </>
            )
        }
    }

    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading header={'Loading box...'}/>}>
                <Await resolve={loaderData.data}>
                    {conditionalRender}
                </Await>
            </Suspense>
        </div>
    )
}
