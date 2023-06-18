import {
    Await,
    defer,
    Form,
    Link,
    redirect,
    useActionData,
    useLoaderData,
    useSearchParams
} from "react-router-dom";
import {Suspense, useState} from "react";
import validateItemForm, {validateItemImage} from "./itemUtils.js";
import Loading from "../components/Loading.jsx";
import ErrorComponent from "../components/ErrorComponent.jsx";
import BackButton from "../components/BackButton.jsx";

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
        else form.append('contentType', validatedImage)
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
    const [location] = useSearchParams()
    const boxQuery = location.get('box')

    // set preview image
    const [previewImage, setPreviewImage] = useState({src: ''})
    const [previewError, setPreviewError] = useState('')

    const handleImageUpload = (e) => {
        if (e.target.files[0].size > 10000000) {
            setPreviewError('Image file must be under 10MB.')
            return
        }
        setPreviewImage({src: URL.createObjectURL(e.target.files[0])})
    }

    const renderConditional = (data) => {
        const errors = data.message
        if (errors) return <ErrorComponent errors={errors}/>
        else return renderForm(data.boxes)
    }

    const renderBoxOptions = (boxes) => boxes.map(box => {
        return (<option value={box._id} key={box._id}>{box.name}</option>)
    })

    const renderForm = (boxes) => {
        const validBoxes = boxes.length > 0
        const fromBoxExists = boxes.filter(box => box._id === boxQuery)[0] ?? false
        const fromBox = fromBoxExists ? fromBoxExists._id : null

        return (
            <>
                <div className={'text-center box-header text-center'}>
                    <Link to={'..'}>
                        <BackButton hex={'#CB1C85'}/>
                    </Link>
                    <h2>New item</h2>
                </div>
                <Form method={'POST'} className={'flex column center'} encType={'multipart/form-data'}>

                    {previewImage.src && <img className={'preview-img'} alt={`Preview image`} src={previewImage.src}/>}

                    {
                        !validBoxes && <h6 className={'error'}>Please create boxes to continue.</h6>
                        ||
                        actionData?.message && <h6 className={'error'}>{actionData.message}</h6>
                        ||
                        previewError && <h6 className={'error'}>{previewError}</h6>
                    }

                    <input type={'file'} name={'image'} accept={'image/*'} onChange={handleImageUpload}/>

                    <label htmlFor={'name'}>Name</label>
                    <input type={'text'} name={'name'} id={'name'} maxLength={15} minLength={3} required/>

                    <label htmlFor={'count'}>Count</label>
                    <input type={'number'} name={'count'} id={'count'} required/>

                    <label htmlFor={'price'}>Price</label>
                    <input type={'number'} name={'price'} id={'price'} required/>

                    <label htmlFor={'description'}>Description</label>
                    <textarea name={'description'} id={'description'} minLength={3}
                              required/>

                    <label htmlFor={'box'}>Box</label>
                    <select name={'box'} id={'box'} defaultValue={fromBox} required disabled={!validBoxes}>
                        {renderBoxOptions(boxes)}
                    </select>

                    <button type={'submit'} className={'button'} style={{backgroundColor: '#CB1C85'}}
                            disabled={!validBoxes}>Create
                    </button>

                </Form>
            </>
        )
    }


    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading header={'Loading...'}/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}