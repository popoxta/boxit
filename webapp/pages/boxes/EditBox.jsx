import {Await, defer, Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";
import {Suspense} from "react";

export function loader({params}) {
    const boxId = params.id
    const box = fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    }).then(res => res.json())
    return defer({data: box})
}

export async function action({request, params}) {
    const data = await request.formData()
    const boxId = params.id

    const hex = data.get('hex') ?? '#C04790'
    const name = data.get('name')

    const hexRegex = new RegExp(/^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i)

    if (!name?.length) return {message: 'Please enter a name.'}
    if (name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (name.length > 25) return {message: 'Name cannot be longer than 25 characters.'}
    if (!hexRegex.test(hex)) return {message: 'Hex code is invalid.'}

    const res = await fetch(
        `http://localhost:3000/boxes/${boxId}/edit`,
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

    const conditionalRender = (data) => {
        const errors = data.message

        if (errors) return renderError(errors)
        else return renderForm(data)
    }
    const renderError = (errors) => <h3>{errors}</h3>

    const renderForm = (data) => {
        const box = data.box
        return (
            <>
                {actionData?.message && renderError(actionData.message)}
                <Form method={'PUT'} className={'flex column'}>
                    <label htmlFor={'name'}>Name</label>
                    <input type={'text'} name={'name'} maxLength={25} id={'name'} defaultValue={box.name ?? ''} required/>

                    <label htmlFor={'hex'}>Hex</label>
                    <input type={'color'} name={'hex'} id={'hex'} defaultValue={box.hex ?? '#C04790'}/>

                    <button type={'submit'}>Update</button>
                </Form>
            </>
        )
    }

    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>
            <h2>Edit Box</h2>
            <Suspense fallback={<h3>Loading...</h3>}>
                <Await resolve={loaderData.data}>
                    {conditionalRender}
                </Await>
            </Suspense>
        </div>
    )
}