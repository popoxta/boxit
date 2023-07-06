import {Await, defer, Link, useLoaderData} from "react-router-dom";
import {Suspense} from "react";
import {BoxComponent} from "../../components/boxes/BoxComponent.jsx";
import Loading from "../../components/Loading.jsx";
import BoxComponentPlus from "../../components/boxes/BoxComponentPlus.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";

export function loader() {
    const boxes = fetch(`${import.meta.env.VITE_URL}/boxes`, {
        credentials: 'include'
    }).then(res => res.json())

    return defer({data: boxes})
}

export default function Boxes() {
    const loaderData = useLoaderData()

    const renderConditional = (data) => {
        const errors = data.message
        if (errors) return <ErrorComponent errors={errors}/>
        else return renderBoxes(data.boxes)
    }

    const renderBoxes = (boxes) => {
        if (boxes.length > 0) {
            return (
                <>
                    <div className={'text-center box-header text-center'}>
                        <Link to={'..'}>
                            <BackButton hex={'#CB1C85'}/>
                        </Link>
                        <h2>All Boxes</h2>
                    </div>
                    <div className={'flex wrap center-justify'}>
                        {boxes.map(box => BoxComponent({box}))}
                        {<BoxComponentPlus/>}
                    </div>
                </>
            )
        } else return (
            <>
                <div className={'text-center box-header text-center'}>
                    <Link to={'..'}>
                        <BackButton hex={'#CB1C85'}/>
                    </Link>
                    <h2>All Boxes</h2>
                </div>
                <div className={'margin-top flex column center'}>
                    <h3>No boxes yet.</h3>
                    <Link to={'./new'}>
                        <button style={{backgroundColor: '#CB1C85'}} className={'button'}>
                            Create your first box
                        </button>
                    </Link>
                </div>
            </>
        )
    }

    return (
        <div className={'flex column'}>
            <Suspense fallback={<Loading header={'Loading boxes...'}/>}>
                <Await resolve={loaderData.data}>
                    {renderConditional}
                </Await>
            </Suspense>
        </div>
    )
}