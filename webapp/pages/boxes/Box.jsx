import {Link, useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const boxId = params.id
    const boxRes = await fetch(`http://localhost:3000/boxes/${boxId}`, {
        credentials: 'include'
    })
    const box = await boxRes.json()
    if (box.message) return box

    const itemRes = await fetch(`http://localhost:3000/boxes/${boxId}/items`, {
        credentials: 'include'
    })
    const items = await itemRes.json()
    if (items.message) return items

    return {box, items}
}

export default function Box() {
    const loaderData = useLoaderData()
    const errors = loaderData.message

    const box = loaderData.box.box
    const items = loaderData.items?.items?.map(item => {
        return (
            <div className={'box'} key={item._id}>
                <h3>{item.name}</h3>
                <p>count: {item.count}</p>
                <p>price: {item.price}</p>
                <Link to={`/items/${item._id}?from=/boxes/${box._id}`}>
                    <button>view</button>
                </Link>
            </div>
        )
    })

    if (errors){
      return (
          <div className={'flex column'}>
              <Link to={'..'}>
                  <button>back</button>
              </Link>

              <h2>Error</h2>
              <h3>{errors}</h3>
          </div>
      )
    }

    else return (
        <div className={'flex column'}>
            <Link to={'..'}><button>back</button></Link>
            <Link to={'./edit'}><button>edit</button></Link>
            <Link to={'./delete'}><button>delete</button></Link>

            <h2>{box.name}</h2>

            {items.length > 0
                ?
                <div className={'flex gap'}>
                    {items}
                </div>
                : <h3>No items yet</h3>
            }
        </div>
    )
}