import { STRATEGIES } from '@/app/constants'
import { entities, good, review } from '@/app/types/entities'
import { order, user } from '@/app/types/interfaces'

export const action = (type: string, payload?: any) => ({
    type,
    payload,
})

// good
export const createGood = (good: good) => action('GoodEntity_createGood', good)

export const deactivateGoodSaga = (good: good) =>
    action('GoodEntity_deactivateGood', good)

export const activateGoodSaga = (good: good) =>
    action('GoodEntity_activateGood', good)

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

export const updateGood = (good: good) => action('GoodEntity_updateGood', good)

export const fetchMyGoods = () => action('GoodEntity_fetchGoods')

// cart

export const fetchCartItems = () => action('CartEntity_fetchCart')

export const addToCart = (goodId: number) =>
    action('CartEntity_addToCart', goodId)

export const decrementQuantity = (good, quantity: number) =>
    action('entities/update_one', {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { available: good.available - quantity },
    })

export const changeGoodQuantity = (goodId, quantity) =>
    action('entities/update_one', {
        entityName: 'cartItems',
        entityId: goodId,
        entityFields: { quantity },
    })

export const deleteCartItem = (index: number) =>
    action('CartEntity_deleteCartItem', { index })

export const clearCart = () => action('entities/clear', 'cartItems')

// order

export const fetchOrders = () => action('OrderEntity_fetchOrders')

export const createOrder = (cartData) =>
    action('OrderEntity_addOrder', cartData)

export const createOrderFail = (message) =>
    action('saga/create_order_fail', message)

// review

export const createReview = (review, goodId) =>
    action('ReviewEntity_addReview', { review, goodId })

// auth

export const createUser = (user) => action('AuthEntity_createUser', user)

export const addUser = (user: user) => action('user/fetch_success', user)

export const noUser = () => action('user/fetch_blank')

export const loginUser = (user: user) => action('AuthEntity_loginUser', user)

export const logoutSaga = () => action('AuthEntity_logoutUser')

export const fetchUser = () => action('AuthEntity_fetchUser')

export const logoutRedux = () => action('user/logout')

// categories

export const fetchCategories = () => action('CategoryEntity_fetchCategories')

// pagination

export const pageInit = (pageName: string, pageIds: string[], count: number) =>
    action('paginator/page_init', { pageName, pageIds, count })

export const fetchPage = (pageName: string, page: number) =>
    action('PageEntity_fetchPage', { pageName, page })

//entities

export const updateEntities = (
    normalizedData: { entities: entities },
    strategy: string = STRATEGIES.REPLACE
) => action('entities/update', { entities: normalizedData.entities, strategy })

export const deleteEntity = (entityName: string, entityId: number) =>
    action('entities/delete', { entityName, entityId })

export const updateEntityArrayField = (data: {
    entityName: string
    entityId: number
    entityField: string
    data: any
}) => action('entities/update_array_field', data)

// errors

export const fetchFailed = (message) => action('saga/fetch_failed', message)
