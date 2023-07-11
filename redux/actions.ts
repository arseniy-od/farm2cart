import { entities, good } from '@/app/types/entities'
import { user } from '@/app/types/interfaces'

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

export const decrementQuantity = (good: good, quantity: number) => ({
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
    type: 'saga/fetch_user',
})

export const fetchCategories = () => ({
    type: 'saga/fetch_categories',
})

export const fetchOrders = () => ({
    type: 'saga/fetch_orders',
})

export const fetchMyGoods = (id: number | string) => ({
    type: 'saga/fetch_my_goods',
    payload: id,
})

export const updateEntities = (entities: entities) => ({
    type: 'entities/update',
    payload: entities,
})
