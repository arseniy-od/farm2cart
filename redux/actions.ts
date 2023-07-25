import { ACTIONS, STRATEGIES } from '@/app/constants'
import { entities, good, review } from '@/app/types/entities'
import { order, user } from '@/app/types/interfaces'

export const action = (type: string, payload?: any) => ({
    type,
    payload,
})

// good
export const createGood = (good: good) => action(ACTIONS.CREATE_GOOD, good)

export const deactivateGoodSaga = (good: good) =>
    action(ACTIONS.DEACTIVATE_GOOD, good)

export const activateGoodSaga = (good: good) =>
    action(ACTIONS.ACTIVATE_GOOD, good)

export const deactivateGoodRedux = (good: good) =>
    action(ACTIONS.UPDATE_ENTITY, {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { active: false },
    })

export const activateGoodRedux = (good: good) =>
    action(ACTIONS.UPDATE_ENTITY, {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { active: true },
    })

export const updateGood = (good: good) => action(ACTIONS.UPDATE_GOOD, good)

export const fetchMyGoods = (pageNumber: number = 1) =>
    action(ACTIONS.FETCH_GOODS, { number: pageNumber })

// cart

export const fetchCartItems = () => action(ACTIONS.FETCH_CART)

export const addToCart = (goodId: number) => action(ACTIONS.ADD_TO_CART, goodId)

export const decrementQuantity = (good, quantity: number) =>
    action(ACTIONS.UPDATE_ENTITY, {
        entityName: 'goods',
        entityId: good.id,
        entityFields: { available: good.available - quantity },
    })

export const changeGoodQuantity = (goodId, quantity) =>
    action(ACTIONS.UPDATE_ENTITY, {
        entityName: 'cartItems',
        entityId: goodId,
        entityFields: { quantity },
    })

export const deleteCartItem = (index: number) =>
    action(ACTIONS.DELETE_CART_ITEM, { index })

export const clearCart = () => action(ACTIONS.CLEAR_ENTITY, 'cartItems')

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

export const fetchPaginatedGoods = (
    pageName: string,
    pageNumber?: number,
    query?: string,
    force?: boolean
) =>
    action(ACTIONS.FETCH_GOODS, {
        pageName,
        pageNumber,
        filter: { search: query },
        force,
    })

export const fetchMyPaginatedGoods = (
    pageName: string,
    pageNumber?: number,
    query?: string,
    force?: boolean
) =>
    action(ACTIONS.FETCH_GOODS, {
        pageName,
        pageNumber,
        filter: { search: query, currentUser: true },
        force,
    })

export const fetchPaginatedGoodsForUser = (
    userId: number,
    pageName: string,
    pageNumber?: number,
    query?: string,
    force?: boolean
) =>
    action(ACTIONS.FETCH_GOODS, {
        pageName,
        pageNumber,
        filter: { search: query, userId },
        force,
    })

export const pageUpdate = (
    pageName: string,
    pageIds: number[] | string[],
    count: number,
    pageNumber: number = 1
) => action('paginator/update', { pageName, pageIds, count, pageNumber })

export const initPage = (pageName: string) =>
    action('paginator/init', { pageName })

export const fetchPage = (pageName: string, page: number) =>
    action('PageEntity_fetchPage', { pageName, page })

export const changeCurrentPage = (pageName: string, page: number) =>
    action('paginator/change_page', { pageName, page })

export const clearPage = (pageName: string) =>
    action('paginator/clear_page', { pageName })

export const setPageFilter = (
    pageName: string,
    filter: Record<string, string>
) => action('paginator/set_filter', { pageName, filter })
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
