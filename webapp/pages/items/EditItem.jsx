import {Await, defer, Form, Link, redirect, useActionData, useLoaderData} from "react-router-dom";
import {Suspense, useState} from "react";
import validateItemForm, {bufferImgToBase64, validateItemImage} from "./itemUtils.js";
import Loading from "../../components/Loading.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";

export function loader({params}) {
    const itemId = params.id

    const item = fetch(`${import.meta.env.VITE_URL}/items/${itemId}`, {
        credentials: 'include'
    }).then(res => res.json())

    const boxes = fetch(`${import.meta.env.VITE_URL}/boxes`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: Promise.all([item, boxes])})
}

export async function action({request, params}) {
    const form = await request.formData()
    const itemId = params.id

    // check if image exists
    const image = form.get('image')
    const imageExists = image.name.length > 0

    // if image is present, validate, if not, delete.
    if (imageExists) {
        const validatedImage = validateItemImage(image)
        if (validatedImage.message) return validatedImage
        else form.append('contentType', validatedImage)
    } else form.delete('image')

    const validatedForm = validateItemForm(form)
    if (validatedForm.message) return validatedForm

    const res = await fetch(
        `${import.meta.env.VITE_URL}/items/${itemId}/edit`,
        {
            method: 'PUT',
            credentials: 'include',
            body: validatedForm
        })

    const result = await res.json()
    if (res.status === 200) return redirect(`/items/${result.item._id}`)
    else return result
}

export default function EditItem() {
    const loaderData = useLoaderData()
    const actionData = useActionData()

    // set preview image
    const [previewImage, setPreviewImage] = useState({src: ''})
    const [previewError, setPreviewError] = useState('')

    const handleImageUpload = (e) => {
        if (e.target.files[0].size > 10000) {
            setPreviewError('Image file must be under 10MB.')
            return
        }
        setPreviewImage({src: URL.createObjectURL(e.target.files[0])})
    }

    const renderConditional = (data) => {
        const errors = data[0].message || data[1].message
        if (errors) return <ErrorComponent errors={errors}/>
        else return renderForm(data[0].item, data[1].boxes)
    }

    const renderBoxOptions = (boxes) => boxes.map(box => {
        return (<option value={box._id} key={box._id}>{box.name}</option>)
    })

    const renderForm = (item, boxes) => {
        const validBoxes = boxes.length > 0

        let image = ''
        if (item.image) {
            const {contentType, base64} = bufferImgToBase64(item.image, item.name)
            image = <img alt={`Photo of ${item.name}`} className={'preview-img'}
                         src={`data:${contentType};base64,${base64}`}/>
        }

        return (
            <>
                <div className={'text-center box-header text-center'}>
                    <Link to={'..'}>
                        <BackButton hex={'#CB1C85'}/>
                    </Link>
                    <h2>Edit Item</h2>
                </div>
                <Form method={'PUT'} className={'flex column center'} encType={'multipart/form-data'}>

                    {previewImage.src && <img className={'preview-img'} alt={`Preview image`} src={previewImage.src}/>
                        ||
                        item.image && image}

                    {
                        !validBoxes && <h6 className={'error'}>Please create boxes to continue.</h6>
                        ||
                        actionData?.message && <h6 className={'error'}>{actionData.message}</h6>
                        ||
                        previewError && <h6 className={'error'}>{previewError}</h6>
                    }

                    <input type={'file'} name={'image'} accept={'image/*'} onChange={handleImageUpload}/>

                    <label htmlFor={'name'}>Name</label>
                    <input type={'text'} name={'name'} id={'name'} defaultValue={item.name} maxLength={15} minLength={3}
                           required/>

                    <label htmlFor={'count'}>Count</label>
                    <input type={'number'} name={'count'} id={'count'} defaultValue={item.count} required/>

                    <label htmlFor={'price'}>Price</label>
                    <input type={'number'} name={'price'} id={'price'} defaultValue={item.price} required/>

                    <label htmlFor={'description'}>Description</label>
                    <textarea name={'description'} id={'description'} defaultValue={item.description} minLength={3}
                              required/>

                    <label htmlFor={'box'}>Box</label>
                    <select name={'box'} id={'box'} required defaultValue={item.box} disabled={!validBoxes}>
                        {renderBoxOptions(boxes)}
                    </select>

                    <button type={'submit'} className={'button'} style={{backgroundColor: '#CB1C85'}}
                            disabled={!validBoxes}>Update
                    </button>

                </Form>
            </>
        )
    }

    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading header={'Loading item...'}/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}