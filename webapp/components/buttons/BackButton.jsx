export default function BackButton({hex}){
    return(
        <button className={'back-button'}>
            <svg width="400px" height="400px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill={hex} d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/>
                <path fill={hex}
                      d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/>
            </svg>
        </button>
    )
}