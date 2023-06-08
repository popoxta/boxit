import {Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";
import {Buffer} from "buffer";

export async function loader({params}) {
    const itemId = params.id
    const itemRes = await fetch(`http://localhost:3000/items/${itemId}`, {
        credentials: 'include'
    })
    const item = await itemRes.json()
    if (item.message) return item

    const boxesRes = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    const boxes = await boxesRes.json()
    if (boxes.message) return boxes
    return {item, boxes}
}

//todo dry this up, SERIOUSLY
export async function action({request, params}) {
    const form = await request.formData()
    const itemId = params.id
    form.append('id', itemId)

    // check if image exists
    const image = form.get('image')
    const imageExists = image.name.length > 0

    // if image is present, validate, if not, delete.
    if (imageExists) {
        if (image.size > 10000) return {message: 'File must be under 10MB.'}
        const contentType = "." + image.type.substring(image.type.indexOf('/') + 1)
        if (!(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(contentType)) return {message: 'File type must be of image type.'}

        form.append('contentType', contentType)
    } else form.delete('image')

    // pull apart the rest to check inputs are kosher
    const {...data} = Object.fromEntries(form)
    data.count = Number(data.count)
    data.price = Number(data.price)

    if (!data.name?.length || data.count == null || data.price == null || !data.description || !data.box) return {message: 'Please fill out all required fields.'}
    if (data.name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (data.description.length < 3) return {message: 'Description must be at least 3 characters.'}
    if (typeof data.count !== 'number' || isNaN(data.count)) return {message: 'Count must be numerical.'}
    if (typeof data.price !== 'number' || isNaN(data.price)) return {message: 'Price must be numerical.'}


    // const res = await fetch(
    //     `http://localhost:3000/items/${itemId}/edit`,
    //     {
    //         method: 'PUT',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             body: form
    //         })
    //     })
    // const result = await res.json()
    // if (res.status === 200) return redirect(`/item/${result.item._id}`)
    // else return result
}

export default function EditItem() {
    const loaderData = useLoaderData()
    const actionData = useActionData()

    const loaderErrors = loaderData?.message
    const actionErrors = actionData?.message

    const boxes = loaderData.boxes.boxes
    const item = loaderData.item.item

    const showForm = loaderData.item ?? ''

    const validBoxes = boxes.length > 0
    const renderBoxes = boxes?.map(box => {
        return (<option value={box._id} key={box._id}>{box.name}</option>)
    })

    const image = item.image?.data ? Buffer.from(item.image.data.data).toString('base64') : ''

    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>

            <h2>Edit Item</h2>

            {
                loaderErrors && <h3>{loaderErrors}</h3>
                ||
                actionErrors && <h3>{actionErrors}</h3>
                ||
                !validBoxes && <h3>Please create boxes to continue.</h3>
            }

            {showForm &&
                <>
                {image && <img alt={`Photo of ${item.name}`} src={`data:${item.image.contentType.substring(1)};base64,${image}`}/>}
                    <Form method={'PUT'} className={'flex column'} encType={'multipart/form-data'}>

                        <input type={'file'} name={'image'} accept={'image/*'}/>

                        <label htmlFor={'name'}>Name</label>
                        <input type={'text'} name={'name'} id={'name'} defaultValue={item.name} required/>

                        <label htmlFor={'count'}>Count</label>
                        <input type={'number'} name={'count'} id={'count'} defaultValue={item.count} required/>

                        <label htmlFor={'price'}>Price</label>
                        <input type={'text'} name={'price'} id={'price'} defaultValue={item.price} required/>

                        <label htmlFor={'description'}>Description</label>
                        <textarea name={'description'} id={'description'} defaultValue={item.description} required/>

                        <label htmlFor={'box'}>Box</label>
                        <select name={'box'} id={'box'} required defaultValue={item.box} disabled={!validBoxes}>
                            {renderBoxes}
                        </select>

                        <button type={'submit'} disabled={!validBoxes}>Update</button>

                    </Form>
                </>
            }
        </div>
    )
}