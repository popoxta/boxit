import {Form, Link, redirect, useActionData} from "react-router-dom";
import {useState} from "react";

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
    const [hexValue, setHexValue] = useState('#CB1C85')
    const actionData = useActionData()

    function handleHexChange(e) {
        setHexValue(e.target.value)
    }

    return (
        <div className={'flex column'}>
            <div className={'text-center box-header text-center'}>
                <Link to={'..'}>
                    <button className={'back-button'}>{'<'}</button>
                </Link>

                <h2>New Box</h2>
            </div>

            <Form method={'POST'} className={'flex column center'}>

                <svg className={'cube-box extra-margin'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill={hexValue} d="M2 18.66l10.5 4.313L23 18.661V6.444L12.5 2.13 2 6.444zm20-.67l-9 3.697V11.102l9-3.68zM12.5 3.213l8.557 3.514-8.557 3.5-8.557-3.5zM3 7.422l9 3.68v10.585L3 17.99z"/>
                    <path fill={'none'} d="M0 0h24v24H0z"/>
                </svg>

                {actionData && <h6 className={'error'}>{actionData.message}</h6>}

                <label htmlFor={'name'}>Name</label>
                <input type={'text'} maxLength={25} name={'name'} id={'name'} required/>

                <label htmlFor={'hex'}>Hex</label>
                <input onChange={handleHexChange} value={hexValue} type={'color'} name={'hex'} id={'hex'}/>

                <button type={'submit'} style={{backgroundColor: hexValue}} className={'button'}>Create</button>

            </Form>
        </div>
    )
}