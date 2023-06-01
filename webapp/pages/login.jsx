import {Form} from "react-router-dom";

export async function action({request}) {
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
    console.log(res)
}

export default function Login() {
    return (
        <div className={'flex column'}>
            <h2>Log In</h2>

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