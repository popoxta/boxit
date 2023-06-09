import {Form, Link, redirect, useActionData} from "react-router-dom";

export async function action({request}) {
    const data = await request.formData()
    const name = data.get('name')
    const hex = data.get('hex') ?? '#CB1C85'

    const hexRegex = new RegExp(/^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i)

    if (!name?.length) return {message: 'Please enter a name.'}
    if (name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (name.length > 25) return {message: 'Name cannot be longer than 25 characters.'}
    if (!hexRegex.test(hex)) return {message: 'Hex code is invalid.'}

    const res = await fetch(
        'http://localhost:3000/boxes/new',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                hex
            })
        })
    const result = await res.json()
    if (res.status === 200) return redirect(`/boxes/${result.box._id}`)
    else return result
}

export default function NewBox() {
    const actionData = useActionData()

    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>
            
            <h2>New Box</h2>

            {actionData && <h3>{actionData.message}</h3>}

            <Form method={'POST'} className={'flex column'}>

                <label htmlFor={'name'}>Name</label>
                <input type={'text'} maxLength={25} name={'name'} id={'name'} required/>

                <label htmlFor={'hex'}>Hex</label>
                <input type={'color'} name={'hex'} id={'hex'}/>

                <button type={'submit'}>Create</button>

            </Form>
        </div>
    )
}