import {Form, redirect, useActionData} from "react-router-dom";
import {act} from "react-dom/test-utils";

export async function action({request}) {
    console.log('POSTING LOGINNN')
    const data = await request.formData()
    const res = await fetch(
        'http://localhost:3000/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.get('username'),
                password: data.get('password')
            })
        })
    const result = await res.json()

    if (result.success) return redirect('/')
    else return result
}

export default function Login() {
    const actionData = useActionData()

    return (
        <div className={'flex column'}>
            <h2>Log In</h2>

            {actionData && <h3>{actionData.message}</h3>}

            <Form method={'POST'} className={'flex column'}>

                <label htmlFor={'username'}>Username</label>
                <input type={'text'} name={'username'} id={'username'}/>

                <label htmlFor={'password'}>Password</label>
                <input type={'text'} name={'password'} id={'password'}/>

                <button type={'submit'}>Log in</button>

            </Form>
        </div>
    )
}