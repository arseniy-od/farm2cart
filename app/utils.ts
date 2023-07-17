import { good } from './types/interfaces'

export function formatDateTime(dateString: string | Date): string {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // Add 1 because getMonth() returns a zero-based index
    const day = date.getDate()

    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const formattedDate = `${day}/${month}/${year}`
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${
        (minutes < 10 ? '0' : '') + minutes
    }:${(seconds < 10 ? '0' : '') + seconds}`
    return formattedDateTime
}

export function formatDate(dateString: string | Date): string {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // Add 1 because getMonth() returns a zero-based index
    const day = date.getDate()

    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
}

export function toTitle(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getTotal(goods: (good & { quantity: number })[]) {
    let total: number = 0
    for (let good of goods) {
        total += good.price * good.quantity
    }
    return total
}

export function isEmpty(obj) {
    if (Object.keys(obj).length) {
        return false
    } else {
        return true
    }
}

export function jsonCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function toFormData(good, method) {
    console.log('[toFormData] good: ', good)
    const formData = new FormData()
    const file = good.file
    // const file = fileRef.current?.files[0]
    if (!file) {
        console.log('[toFormData] File not found')
    } else {
        console.log('File found: ', file)
        formData.append('file', file)
    }

    if (method === 'put' && good.id) {
        formData.append('id', good.id)
    }
    formData.append('title', good.title)
    formData.append('description', good.description)
    formData.append('imageUrl', good.imageUrl)
    formData.append('price', good.price)
    formData.append('available', good.available)
    formData.append('active', '1')

    good.categories.forEach((category) => {
        formData.append('categories', category)
    })
    console.log('[toFormData]formData:', formData)
    return formData
}
