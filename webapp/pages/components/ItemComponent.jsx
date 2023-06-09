import {bufferImgToBase64} from "../items/itemUtils.js";
import {Link} from "react-router-dom";

export default function ItemComponent({item, from}){
    let image = ''
    if (item.image) {
        const {contentType, base64} = bufferImgToBase64(item.image, item.name)
        image =
            <img className={'item-img'} alt={`Photo of ${item.name}`} src={`data:${contentType};base64,${base64}`}/>
    }

    return (
        <div className={'box flex column center no-padding'} key={item._id}>
            {item.image ? image : <div className={'placeholder'}></div>}
            <div className={'item-info flex center column'}>
                <Link to={`/items/${item._id}?from=/items`}>
                    <h3>{item.name}</h3>
                </Link>
                <hr/>
                <p>count: {item.count}</p>
                <p>price: {item.price}</p>
                <Link to={`/items/${item._id}?from=${from}`}>
                    <button style={{backgroundColor: '#CB1C85'}} className={'button-small'}>view</button>
                </Link>
            </div>
        </div>
    )
}