import { entities, good, review } from '@/app/types/entities'
import { order, user } from '@/app/types/interfaces'

export const action = (type: string, payload?: any) => ({
    type,
    payload,
})

export const deactivateGood = (good: good) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { active: false },
    })

export const activateGood = (good: good) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { active: true },
    })

export const fetchFailed = (message) => action('saga/fetch_failed', message)
// export const fetchSucceeded = (data) => action('saga/fetch_succeeded', data)

export const decrementQuantity = (good, quantity: number) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { available: good.available - quantity },
    })

export const createOrder = (cartData) => action('saga/create_order', cartData)

export const createOrderFail = (message) =>
    action('saga/create_order_fail', message)

export const addGood = (good: good) => action('entities/update', good)

export const addUser = (user: user) => action('user/fetch_success', user)
export const noUser = () => action('user/fetch_blank')

export const loginUser = (user: user) => action('saga/login', user)

export const fetchUser = () => action('saga/fetch_user')

export const fetchCategories = () => action('saga/fetch_categories')

export const fetchOrders = () => action('saga/fetch_orders')

export const fetchMyGoods = () => action('saga/fetch_goods')

export const updateEntities = (entities: entities) =>
    action('entities/update', entities)

export const deleteEntity = (id: number) => action('entities/delete', id)
