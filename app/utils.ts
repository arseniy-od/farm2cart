import { normalize, schema, NormalizedSchema } from 'normalizr'
import { RootState } from '@/redux/store'
import {
    cartItem,
    category,
    categoryGood,
    entities,
    good,
    order,
    orderGood,
    review,
    user,
} from './types/entities'

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
    if (dateString) {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // Add 1 because getMonth() returns a zero-based index
        const day = date.getDate()

        const formattedDate = `${day}/${month}/${year}`
        return formattedDate
    } else {
        return 'date unknown'
    }
}

export function toTitle(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getTotal(goods: (good & { quantity: number })[]) {
    let total: number = 0
    for (let good of goods) {
        total += (good.price || 0) * good.quantity
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

export function jsonCopy<T extends object>(obj: T): T {
    if (!obj) {
        console.error('[jsonCopy] obj has to be js object')
        return obj
    }
    if ('toJson' in obj) {
        return (obj as any).toJson()
    }
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

export function getGoodsPage(state: RootState, pageName: string) {
    if (state.entities.goods) {
        const page = state.pagination[pageName]
        const goods = Object.values(state.entities.goods)
        const currentIds = page?.pages?.[page?.currentPage || 0].ids || []
        return goods.filter((good) => good.id && currentIds.includes(good.id))
    }
    return []
}

interface EntityMap {
    users: user
    goods: good
    categories: category
    reviews: review
    orders: order
    cartItems: cartItem
    orderGoods: orderGood
    categoryGoods: categoryGood
}

type NormalizedData = {
    [K in keyof EntityMap]: {
        [key: string]: EntityMap[K] & {
            error?: string
        }
    }
}

export const normalizeResponse = (
    responseData,
    schema: schema.Array | schema.Entity
): NormalizedSchema<NormalizedData, string[]> => {
    return normalize(responseData, schema)
}
