import {Await, defer, Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";
import {Suspense, useState} from "react";
import Loading from "../../components/Loading.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";

export function loader({params}) {
    const boxId = params.id
    const box = fetch(`${import.meta.env.VITE_URL}/boxes/${boxId}`, {
        credentials: 'include'
    }).then(res => res.json())
    return defer({data: box})
}

export async function action({request, params}) {
    const data = await request.formData()
    const boxId = params.id

    const hex = data.get('hex') ?? '#CB1C85'
    const name = data.get('name')

    const hexRegex = new RegExp(/^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i)

    if (!name?.length) return {message: 'Please enter a name.'}
    if (name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (name.length > 25) return {message: 'Name cannot be longer than 25 characters.'}
    if (!hexRegex.test(hex)) return {message: 'Hex code is invalid.'}

    const res = await fetch(
        `${import.meta.env.VITE_URL}/boxes/${boxId}/edit`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: boxId,
                name,
                hex
            })
        })
    const result = await res.json()
    if (res.status === 200) return redirect(`/boxes/${result.box._id}`)
    else return result
}

export default function EditBox() {
    const loaderData = useLoaderData()
    const actionData = useActionData()
    const [hexValue, setHexValue] = useState('')

    const conditionalRender = (data) => {
        const errors = data.message
        if (errors) return <ErrorComponent errors={errors}/>
        return renderForm(data)
    }

    function handleHexChange(e) {
        setHexValue(e.target.value)
    }

    const renderForm = (data) => {
        const box = data.box

        const color = hexValue.length <= 0 ? box.hex : hexValue

        return (
            <>
                <div className={'text-center box-header text-center'}>
                    <Link to={'..'}>
                        <BackButton hex={color}/>
                    </Link>
                    <h2>Edit Box</h2>
                </div>
                <Form method={'PUT'} className={'flex column center'}>

                    <svg className={'cube-box extra-margin'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill={color}
                              d="M2 18.66l10.5 4.313L23 18.661V6.444L12.5 2.13 2 6.444zm20-.67l-9 3.697V11.102l9-3.68zM12.5 3.213l8.557 3.514-8.557 3.5-8.557-3.5zM3 7.422l9 3.68v10.585L3 17.99z"/>
                        <path fill={'none'} d="M0 0h24v24H0z"/>
                    </svg>

                    {actionData?.message && <h6 className={'error'}>{actionData.message}</h6>}

                    <label htmlFor={'name'}>Name</label>
                    <input type={'text'} name={'name'} maxLength={25} id={'name'} defaultValue={box.name ?? ''}
                           required/>

                    <label htmlFor={'hex'}>Hex</label>
                    <input type={'color'} name={'hex'} id={'hex'} onChange={handleHexChange} value={color}/>

                    <button type={'submit'} style={{backgroundColor: color}} className={'button'}>Update</button>
                </Form>
            </>
        )
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