import {useNavigate} from "react-router-dom";
import {useState} from "react";

export async function logout(){
    const res = await fetch(
        'http://localhost:3000/logout',
        {
            method: 'POST',
            credentials: 'include'
        }
    )
    if (res.status === 200) return res
    else return {message: 'Log out failed'}
}

export default function Logout() {
    const navigate = useNavigate()
    const [errors, setErrors] = useState('')

    async function handleLogout(){
        const result = await logout()
        if (result.status === 200) return navigate('/boxes')
        else setErrors(result.message)
    }

    return (
        <div className={'flex column center'}>
            <h2>See you again!</h2>
            <hr className={'margin-bottom max-25'}/>
            {errors && <h6 className={'error'}>{errors}</h6>}
            <button className={'button extra-margin'} style={{backgroundColor: '#CB1C85'}} onClick={handleLogout}>Log out</button>
        </div>
    )
}