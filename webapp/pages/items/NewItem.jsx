import {Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";

export async function loader () {
    const res = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    return await res.json()
}
export async function action({request}) {
    const {img, ...data} = Object.fromEntries(await request.formData())
    data.count = Number(data.count)
    data.price = Number(data.price)

    if (!data.name?.length || data.count == null || data.price == null || !data.description || !data.box) return {message: 'Please fill out all required fields.'}
    if (data.name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (data.description.length < 3) return {message: 'Description must be at least 3 characters.'}
    if (typeof data.count !== 'number' || isNaN(data.count)) return {message: 'Count must be numerical.'}
    if (typeof data.price !== 'number' || isNaN(data.price)) return {message: 'Price must be numerical.'}

    const itemRes = await fetch(
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
    const itemResult = await itemRes.json()
    // if post was successful and there is no image, redirect
    if (itemRes.status === 200 && !img) return redirect(`/items/${itemResult.item._id}`)
    // return with messages if error occurs
    else if (itemRes.status !== 200) return itemResult

    if (img) {
        const imageForm = new FormData()
        imageForm.append('image', img)
        const imgRes = await fetch(
            'http://localhost/3000/items/image',
            {
                method: 'POST',
                credentials: 'include',
                body: imageForm
            }
        )
        const imageResult = await imgRes.json()
        // if post was successful, redirect to new item
        if (imgRes.status === 200) return redirect(`/items/${itemResult.item._id}`)
        else return imageResult
    }

    // RES.JSON - CHECK RESPONSE OF PREV POST (DATA)
    // IF ERR, EARLY EXIT
    // ELSE POST REQUEST WITH IMAGE HERE
    // IF ERR EXIT
    // ELSE IF ALL SUCCEED, RETURN RES.JSON({RES1, RES2})
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

            <h2>New Item</h2>

            {actionData && <h3>{actionData.message}</h3> || !validBoxes && <h3>Please create boxes to continue.</h3>}

            <Form method={'POST'} className={'flex column'}>

                <input type={'file'} name={'img'} accept={'image/*'}/>

                <label htmlFor={'name'}>Name</label>
                <input type={'text'} name={'name'} id={'name'} required/>

                <label htmlFor={'count'}>Count</label>
                <input type={'number'} name={'count'} id={'count'} required/>

                <label htmlFor={'price'}>Price</label>
                <input type={'text'} name={'price'} id={'price'} required/>

                <label htmlFor={'description'}>Description</label>
                <textarea name={'description'} id={'description'} required/>

                <label htmlFor={'box'}>Box</label>
                <select name={'box'} id={'box'} required disabled={!validBoxes}>
                    {boxes}
                </select>

                <button type={'submit'}>Create</button>

            </Form>
        </div>
    )
}