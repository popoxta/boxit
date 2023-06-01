import {Form} from "react-router-dom";

export async function action({request}) {
    const data = await request.formData()
    const res = await fetch(
        'http://localhost:3000/register',
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

export default function Register() {
    return (
        <div className={'flex column'}>
            <h2>Register</h2>

            <Form action={'POST'} className={'flex column'}>

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