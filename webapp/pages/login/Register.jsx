import {Form, redirect, useActionData} from "react-router-dom";

export async function action({request}) {
    const data = await request.formData()
    const username = data.get('username')
    const password = data.get('password')
    const passwordConfirm = data.get('password-confirm')

    // client side password verification
    if (username.length < 3) return {message: 'Username must be at least 3 characters.'}
    if (password !== passwordConfirm) return {message: 'Passwords must match.'}
    if (password.length < 6) return {message: 'Password must be at least 6 characters.'}

    const res = await fetch(
        'http://localhost:3000/register',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                passwordConfirm
            })
        })
    if (res.status === 200) return redirect('/login')
    else return await res.json()
}

export default function Register() {
    const actionData = useActionData()

    return (
        <div className={'flex column center'}>
            <h2>Register</h2>

            <hr className={'margin-bottom max-25'}/>

            {actionData && <h3>{actionData.message}</h3>}

            <Form method={'POST'} className={'flex column'}>

                <label htmlFor={'username'} >Username</label>
                <input type={'text'} name={'username'} id={'username'}/>

                <label htmlFor={'password'}>Password</label>
                <input type={'password'} name={'password'} id={'password'}/>

                <label htmlFor={'password-confirm'}>Confirm Password</label>
                <input type={'password'} name={'password-confirm'} id={'password-confirm'}/>

                <button className={'button extra-margin'} style={{backgroundColor: '#CB1C85'}} type={'submit'}>Register</button>
            </Form>
        </div>
    )
}