import axios from 'axios'
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

export async function apiDelete(url) {
    // console.log('DELETE')
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // query: JSON.stringify(index)
        })
        if (res.ok) {
            console.log('Entity deleted')
            return await res.json()
        } else {
            console.error('Entity not deleted')
            return { error: true, message: res.statusText }
        }
    } catch (e) {
        console.error('ERR: ', e)
        return { error: true, message: e.message }
    }
}

export async function apiActivate(url, id) {
    try {
        const config = {
            headers: { 'content-type': 'application/json' },
            query: { id },
            params: { id },
        }
        const res = await axios.patch('/api/goods', {}, config)

        if (res.status === 200) {
            console.log('Entity activated')
            return await res.data
        } else {
            console.error('Entity not activated')
            return { error: true, message: res.statusText }
        }
    } catch (e) {
        console.error('ERR: ', e)
        return { error: true, message: e.message }
    }
}

export function getTotal(goods: (good & { quantity: number })[]) {
    let total: number = 0
    for (let good of goods) {
        total += good.price * good.quantity
    }
    return total
}
