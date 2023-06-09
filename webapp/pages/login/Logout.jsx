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
    const result = await res.json()
    if (res.status === 200) return res
    else return result
}

export default function Logout() {
    const navigate = useNavigate()
    const [errors, setErrors] = useState('')

    async function handleLogout(){
        const result = await logout()
        if (result.status === 200) return navigate('/')
        else setErrors('Log out failed.')
    }

    return (
        <div className={'flex column center'}>
            <h2>See you again!</h2>
            {errors && <h3>{errors}</h3>}
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}