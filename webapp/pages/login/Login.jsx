import {Form, redirect, useActionData} from "react-router-dom";
import {act} from "react-dom/test-utils";

export async function action({request}) {
    const data = await request.formData()
    const username = data.get('username')
    const password = data.get('password')
    if (!username?.length) return {message: 'Please enter a username.'}
    if (!password?.length) return {message: 'Please enter a password.'}

    const res = await fetch(
        `${import.meta.env.VITE_URL}/login`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        })
    if (res.status === 200) return redirect('/boxes')
    else return await res.json()
}

export default function Login() {
    const actionData = useActionData()

    return (
        <div className={'flex column center'}>
            <h2>Log In</h2>
            <hr className={'margin-bottom max-25'}/>

            {actionData && <h6 className={'error'}>{actionData.message}</h6>}

            <Form method={'POST'} className={'flex column'}>

                <label htmlFor={'username'}>Username</label>
                <input type={'text'} name={'username'} id={'username'}/>

                <label htmlFor={'password'}>Password</label>
                <input type={'password'} name={'password'} id={'password'}/>

                <button className={'button extra-margin'} style={{backgroundColor: '#CB1C85'}} type={'submit'}>Log in</button>

            </Form>
        </div>
    )
}