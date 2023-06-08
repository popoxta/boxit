import {Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";
import {useState} from "react";
import {Buffer} from "buffer";

export async function loader() {
    const res = await fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    })
    return await res.json()
}

export async function action({request}) {
    const form = await request.formData()

    // check if image exists
    const image = form.get('image')
    const imageExists = image.name.length > 0

    // if image is present, validate, if not, delete.
    if (imageExists){
        if (image.size > 10000) return {message: 'File must be under 10MB.'}
        const contentType = "." + image.type.substring(image.type.indexOf('/') + 1)
        if (!(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(contentType)) return {message: 'File type must be of image type.'}

        form.append('contentType', contentType)
    }
    else form.delete('image')

    // pull apart the rest to check inputs are kosher
    const {...data} = Object.fromEntries(form)
    data.count = Number(data.count)
    data.price = Number(data.price)

    if (!data.name?.length || data.count == null || data.price == null || !data.description || !data.box) return {message: 'Please fill out all required fields.'}
    if (data.name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (data.description.length < 3) return {message: 'Description must be at least 3 characters.'}
    if (typeof data.count !== 'number' || isNaN(data.count)) return {message: 'Count must be numerical.'}
    if (typeof data.price !== 'number' || isNaN(data.price)) return {message: 'Price must be numerical.'}

    const res = await fetch(
        'http://localhost:3000/items/new',
        {
            method: 'POST',
            credentials: 'include',
            body: form
        }
    )

    const result = await res.json()
    if (res.status === 200) return redirect(`/items/${result.item._id}`)
    else return result
}

export default function NewItem() {
    const loaderData = useLoaderData()
    const actionData = useActionData()

    const loaderErrors = loaderData?.message
    const actionErrors = actionData?.message

    const boxes = loaderData.boxes?.map(box => {
        return (<option value={box._id} key={box._id}>{box.name}</option>)
    })

    const validBoxes = boxes.length > 0

    // set preview image
    const [previewImage, setPreviewImage] = useState({src: ''})

    function handleImageUpload(e) {
        setPreviewImage({src: URL.createObjectURL(e.target.files[0])})
    }

    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>

            <h2>New Item</h2>

            {
                loaderErrors && <h3>{loaderErrors}</h3>
                ||
                actionErrors && <h3>{actionErrors}</h3>
                ||
                !validBoxes && <h3>Please create boxes to continue.</h3>
            }

            {previewImage.src && <img alt={`Photo of new item`} src={previewImage.src}/>}

            <Form method={'POST'} className={'flex column'} encType={'multipart/form-data'}>

                <input type={'file'} name={'image'} accept={'image/*'} onChange={handleImageUpload}/>

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

                <button type={'submit'} disabled={!validBoxes}>Create</button>

            </Form>
        </div>
    )
}