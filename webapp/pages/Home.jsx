import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div className={'flex column center'}>

            <svg className={'cube-logo margin-bottom'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill={'#CB1C85'}
                      d="M2 18.66l10.5 4.313L23 18.661V6.444L12.5 2.13 2 6.444zm20-.67l-9 3.697V11.102l9-3.68zM12.5 3.213l8.557 3.514-8.557 3.5-8.557-3.5zM3 7.422l9 3.68v10.585L3 17.99z"/>
                <path fill="none" d="M0 0h24v24H0z"/>
            </svg>

            <hr className={'margin-bottom max-25'}/>

            <h2>WELCOME TO BOXIT</h2>
            <h4>Box your items</h4>

            <Link to={'/register'}>
                <button className={'button extra-margin'} style={{backgroundColor: '#CB1C85'}}>Get started</button>
            </Link>
        </div>
    )
}