import {Link} from "react-router-dom";

export const BoxComponent = (box) => {
    const currBox = box.box

    const color = currBox.hex ?? '#CB1C85'

    return (
        <div className={'box flex column center'} key={currBox._id}>
            <svg className={'cube-box'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill={color} d="M2 18.66l10.5 4.313L23 18.661V6.444L12.5 2.13 2 6.444zm20-.67l-9 3.697V11.102l9-3.68zM12.5 3.213l8.557 3.514-8.557 3.5-8.557-3.5zM3 7.422l9 3.68v10.585L3 17.99z"/>
                <path fill={'none'} d="M0 0h24v24H0z"/>
            </svg>
            <hr/>
            <Link to={`./${currBox._id}`} className={'flex column center grow apart'}>
                <h3 style={{color: color}}>{currBox.name}</h3>
                <button style={{backgroundColor: color}} className={'button'}>view</button>
            </Link>
        </div>
    )
}