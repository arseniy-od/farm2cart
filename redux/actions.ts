import { entities, good, review } from '@/app/types/entities'
import { user } from '@/app/types/interfaces'
import { categoriesSchema, goodsSchema, ordersSchema } from './normalSchemas'

export const action = (type: string, payload?: any) => ({
    type,
    payload,
})

export const deactivateGood1 = (good: good) =>
    action('entities/update', {
        entities: {
            goods: { [good.id]: { ...good, active: false } },
        },
    })

export const fetchFailed = (message) => action('saga/fetch_failed', message)
export const fetchSucceeded = (data) => action('saga/fetch_succeeded', data)

export const deactivateGood = (good: good) => ({
    type: 'entities/update',
    payload: {
        entities: {
            goods: { [good.id]: { ...good, active: false } },
        },
    },
})

export const activateGood = (good: good) => ({
    type: 'entities/update',
    payload: {
        entities: {
            goods: { [good.id]: { ...good, active: true } },
        },
    },
})

export const decrementQuantity = (good, quantity: number) => ({
    type: 'entities/update_one',
    payload: {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { available: good.available - quantity },
    },
})

export const addGood = (good: good) => ({
    type: 'entities/update',
    payload: {
        entities: {
            goods: { [good.id]: good },
        },
    },
})

export const addUser = (user: user) => ({
    type: 'user/fetch_success',
    payload: user,
})

export const fetchUser = () => ({
    type: 'saga/fetch',
    payload: { url: '/api/users/me' },
})

export const fetchCategories = () =>
    action('saga/fetch', {
        url: '/api/categories',
        normalSchema: categoriesSchema,
    })

export const fetchOrders = () => ({
    type: 'saga/fetch',
    payload: { url: '/api/orders', normalSchema: ordersSchema },
})

export const fetchMyGoods = () => ({
    type: 'saga/fetch',
    payload: { url: '/api/goods', normalSchema: goodsSchema },
})

export const updateEntities = (entities: entities) => ({
    type: 'entities/update',
    payload: entities,
})
