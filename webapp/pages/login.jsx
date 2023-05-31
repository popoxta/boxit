import {Form} from "react-router-dom";

export default function Login() {
    return (
        <div className={'flex column'}>
            <h2>Log In</h2>

            <Form className={'flex column'}>

                <label htmlFor={'username'} >Username</label>
                <input type={'text'} name={'username'} id={'username'}/>

                <label htmlFor={'password'}>Password</label>
                <input type={'text'} name={'password'} id={'password'}/>

                <button type={'submit'}>Log in</button>

            </Form>
        </div>
    )
}