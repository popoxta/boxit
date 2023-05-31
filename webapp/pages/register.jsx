import {Form} from "react-router-dom";

export default function Register() {
    return (
        <div className={'flex column'}>
            <h2>Register</h2>

            <Form className={'flex column'}>

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