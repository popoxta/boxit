import {Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const boxId = params.id
    const res = await fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    })
    return await res.json()
}

export async function action({request, params}) {
    const data = await request.formData()
    const boxId = params.id

    const hex = data.get('hex') ?? '#C04790'
    const name = data.get('name')
    if (!name?.length) return {message: 'Please enter a name.'}
    if (name.length < 3) return {message: 'Name must be at least 3 characters.'}

    const res = await fetch(
        `http://localhost:3000/boxes/${boxId}/edit`,
        {
            method: 'POST',
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

    const loaderErrors = loaderData?.message
    const actionErrors = actionData?.message

    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>

            <h2>Edit Box</h2>

            {
                loaderErrors && <h3>{loaderErrors}</h3>
                ||
                actionErrors && <h3>{actionErrors}</h3>
            }

            <Form method={'POST'} className={'flex column'}>

                <label htmlFor={'name'}>Name</label>
                <input type={'text'} name={'name'} id={'name'} defaultValue={loaderData.box.name ?? ''} required/>

                <label htmlFor={'hex'}>Hex</label>
                <input type={'color'} name={'hex'} id={'hex'} defaultValue={loaderData.box.hex ?? '#C04790'}/>

                <button type={'submit'}>Update</button>

            </Form>
        </div>
    )
}