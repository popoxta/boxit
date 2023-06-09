import {Await, defer, Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";
import {Suspense, useState} from "react";
import validateItemForm, {validateItemImage} from "./itemUtils.js";

export function loader() {
    const boxes = fetch('http://localhost:3000/boxes', {
        credentials: 'include'
    }).then(res => res.json())
    return defer({data: boxes})
}

export async function action({request}) {
    const form = await request.formData()
    const image = form.get('image')
    const imageExists = image.name.length > 0

    // if image is present, validate, if not, delete.
    if (imageExists) {
        const validatedImage = validateItemImage(image)

        if (validatedImage.message) return validatedImage
        else form.append('contentType', validatedImage.contentType)
    } else form.delete('image')

    const validatedForm = validateItemForm(form)
    if (validatedForm.message) return validatedForm

    const res = await fetch(
        'http://localhost:3000/items/new',
        {
            method: 'POST',
            credentials: 'include',
            body: validatedForm
        }
    )

    const result = await res.json()
    if (res.status === 200) return redirect(`/items/${result.item._id}`)
    else return result
}

export default function NewItem() {
    const loaderData = useLoaderData()
    const actionData = useActionData()

    // set preview image
    const [previewImage, setPreviewImage] = useState({src: ''})
    const [previewError, setPreviewError] = useState('')

    const handleImageUpload = (e) => {
        if(e.target.files[0].size > 10000000) {
            setPreviewError('Image file must be under 10MB.')
            return
        }
        setPreviewImage({src: URL.createObjectURL(e.target.files[0])})
    }

    const renderConditional = (data) => {
        const errors = data.message
        if (errors) return renderErrors(errors)
        else return renderForm(data.boxes)
    }

    const renderBoxOptions = (boxes) => boxes.map(box => {
        return (<option value={box._id} key={box._id}>{box.name}</option>)
    })

    const renderErrors = (errors) => <h3>{errors}</h3>

    const renderForm = (boxes) => {
        const validBoxes = boxes.length > 0

        return (
            <>
                {previewImage.src && <img alt={`Preview image`} src={previewImage.src}/>}

                {
                    !validBoxes && renderErrors('Please create boxes to continue.')
                    ||
                    actionData?.message && renderErrors(actionData.message)
                    ||
                    previewError && renderErrors(previewError)
                }

                <Form method={'POST'} className={'flex column'} encType={'multipart/form-data'}>

                    <input type={'file'} name={'image'} accept={'image/*'} onChange={handleImageUpload}/>

                    <label htmlFor={'name'}>Name</label>
                    <input type={'text'} name={'name'} id={'name'} minLength={3} required/>

                    <label htmlFor={'count'}>Count</label>
                    <input type={'number'} name={'count'} id={'count'} required/>

                    <label htmlFor={'price'}>Price</label>
                    <input type={'number'} name={'price'} id={'price'} required/>

                    <label htmlFor={'description'}>Description</label>
                    <textarea name={'description'} id={'description'} minLength={3}
                              required/>

                    <label htmlFor={'box'}>Box</label>
                    <select name={'box'} id={'box'} required disabled={!validBoxes}>
                        {renderBoxOptions(boxes)}
                    </select>

                    <button type={'submit'} disabled={!validBoxes}>Create</button>

                </Form>
            </>
        )
    }


    return (
        <div className={'flex column center'}>
            <Link to={'..'}>
                <button>back</button>
            </Link>

            <h2>New Item</h2>

            <Suspense fallback={<h3>Loading...</h3>}>
            <Await resolve={loaderData.data}>
                {renderConditional}
            </Await>
            </Suspense>

        </div>
    )
}