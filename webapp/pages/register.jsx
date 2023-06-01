import {Form, redirect, useActionData} from "react-router-dom";

export async function action({request}) {
    const data = await request.formData()
    const password = data.get('password')
    const passwordConfirm = data.get('password-confirm')

    // client side password verification
    if (password !== passwordConfirm) return {message: 'Passwords must match.'}
    if (password.length < 6) return {message: 'Password must be at least 6 characters.'}

    const res = await fetch(
        'http://localhost:3000/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.get('username'),
                password,
                passwordConfirm
            })
        })
    const result = await res.json()

    if (result.success) return redirect('/login')
    else return result
}

export default function Register() {
    const actionData = useActionData()

    return (
        <div className={'flex column'}>
            <h2>Register</h2>

            {actionData && <h3>{actionData.message}</h3>}

            <Form method={'POST'} className={'flex column'}>

                <label htmlFor={'username'} >Username</label>
                <input type={'text'} name={'username'} id={'username'}/>

                <label htmlFor={'password'}>Password</label>
                <input type={'text'} name={'password'} id={'password'}/>

                <label htmlFor={'password-confirm'}>Confirm Password</label>
                <input type={'text'} name={'password-confirm'} id={'password-confirm'}/>

                <button type={'submit'}>Register</button>
            </Form>
        </div>
    )
}