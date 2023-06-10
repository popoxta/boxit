import {Buffer} from "buffer/";

export function validateItemImage(image) {
    if (image.size > 10000000) return {message: 'File must be under 10MB.'}
    const contentType = "." + image.type.substring(image.type.indexOf('/') + 1)
    if (!(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(contentType)) return {message: 'File type must be of image type.'}
    return contentType
}

export default function validateItemForm(formData) {
    // pull apart the rest to check inputs are kosher
    const {...data} = Object.fromEntries(formData)
    data.count = Number(data.count)
    data.price = Number(data.price)

    if (!data.name?.length || data.count == null || data.price == null || !data.description || !data.box) return {message: 'Please fill out all required fields.'}
    if (data.name.length < 3) return {message: 'Name must be at least 3 characters.'}
    if (data.name.length > 15) return {message: 'Name cannot be more than 15 characters.'}
    if (data.description.length < 3) return {message: 'Description must be at least 3 characters.'}
    if (typeof data.count !== 'number' || isNaN(data.count)) return {message: 'Count must be numerical.'}
    if (typeof data.price !== 'number' || isNaN(data.price)) return {message: 'Price must be numerical.'}

    else return formData
}

export const bufferImgToBase64 = (image, alt) => {
    const contentType = image.contentType.substring(1)
    const base64 = Buffer.from(image.data.data).toString('base64')
    return ({base64, contentType})
}