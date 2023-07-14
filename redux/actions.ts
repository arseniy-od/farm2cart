import { entities, good, review } from '@/app/types/entities'
import { order, user } from '@/app/types/interfaces'

export const action = (type: string, payload?: any) => ({
    type,
    payload,
})

// update entity

export const deactivateGoodSaga = (good: good) =>
    action('saga/deactivate_good', good)

export const activateGoodSaga = (good: good) =>
    action('saga/activate_good', good)

export const deactivateGoodRedux = (good: good) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { active: false },
    })

export const activateGoodRedux = (good: good) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { active: true },
    })

export const decrementQuantity = (good, quantity: number) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { available: good.available - quantity },
    })

// create entity

export const createOrder = (cartData) => action('saga/create_order', cartData)

export const createReview = (review, goodId) =>
    action('saga/create_review', { review, goodId })

export const createOrderFail = (message) =>
    action('saga/create_order_fail', message)

export const addGood = (good: good) => action('entities/update', good)

// delete entity

//not implemented yet
export const deleteCartItem = (id: number) =>
    action('entities/delete', { entityName: 'cartItems', id })

// auth

export const createUser = (user) => action('saga/create_user', user)

export const addUser = (user: user) => action('user/fetch_success', user)

export const noUser = () => action('user/fetch_blank')

export const loginUser = (user: user) => action('saga/login', user)

export const logoutSaga = () => action('saga/logout')

export const logoutRedux = () => action('user/logout')

// fetching data

export const fetchUser = () => action('saga/fetch_user')

export const fetchCategories = () => action('saga/fetch_categories')

export const fetchOrders = () => action('saga/fetch_orders')

export const fetchMyGoods = () => action('saga/fetch_goods')

export const fetchCartItems = () => action('saga/fetch_cart')

//entities

export const updateEntities = (entities: entities) =>
    action('entities/update', entities)

// not used
export const deleteEntity = (id: number) => action('entities/delete', id)

export const updateEntityArrayField = (data: {
    entityName: string
    entityId: number
    entityField: string
    data: any
}) => action('entities/update_array_field', data)

// errors

export const fetchFailed = (message) => action('saga/fetch_failed', message)
