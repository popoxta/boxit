import {Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";

export async function loader () {
    const res = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    return await res.json()
}
export async function action({request}) {
    const data = Object.fromEntries(await request.formData())
    data.count = parseInt(data.count)
    data.price = parseInt(data.price)

    if (!data.name?.length || !data.count || !data.price || !data.description || !data.box) return {message: 'Please fill out all required fields.'}
    if (data.name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (data.description.length < 3) return {message: 'Description must be at least 3 characters.'}
    if (typeof data.count !== 'number' || typeof data.price != 'number' ) return {message: 'Count and price must be numerical.'}

    const res = await fetch(
        'http://localhost:3000/items/new',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            })
        })

    const result = await res.json()
    if (res.status === 200) return redirect(`/boxes/${result.item._id}`)
    else return result
}

export default function NewItem() {
    const loaderData = useLoaderData()
    const actionData = useActionData()

    const boxes = loaderData.boxes?.map(box => {
        return(<option value={box._id} key={box._id}>{box.name}</option>)
    })

    const validBoxes = boxes.length > 0

    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>

            <h2>New Box</h2>

            {actionData && <h3>{actionData.message}</h3> || !validBoxes && <h3>Please create boxes to continue.</h3>}

            <Form method={'POST'} className={'flex column'}>

                <input type={'file'} name={'img'} accept={'image/*'}/>

                <label htmlFor={'name'}>Name</label>
                <input type={'text'} name={'name'} id={'name'} required/>

                <label htmlFor={'count'}>Count</label>
                <input type={'number'} name={'count'} id={'count'} required/>

                <label htmlFor={'price'}>Price</label>
                <input type={'number'} name={'price'} id={'price'} required/>

                <label htmlFor={'description'}>Price</label>
                <textarea name={'description'} id={'description'} required/>

                <label htmlFor={'box'}>Price</label>
                <select name={'box'} id={'box'} required disabled={!validBoxes}>
                    {boxes}
                </select>

                <button type={'submit'}>Create</button>

            </Form>
        </div>
    )
}