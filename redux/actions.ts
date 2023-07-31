import { ACTIONS, STRATEGIES, actionType } from '@/app/constants'
import { entities, good, review } from '@/app/types/entities'
import { order, user } from '@/app/types/interfaces'

export const action = (type: actionType, payload?: any) => ({
    type,
    payload,
})

export type Action = ReturnType<typeof action>

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

export const fetchOrders = () => action(ACTIONS.FETCH_ORDERS)

export const createOrder = (cartData) => action(ACTIONS.ADD_ORDER, cartData)

export const createOrderFail = (message) =>
    action(ACTIONS.CREATE_ORDER_FAIL, message)

// review

export const createReview = (review, goodId) =>
    action(ACTIONS.CREATE_REVIEW, { review, goodId })

// auth

export const createUser = (user) => action(ACTIONS.CREATE_USER, user)

export const addUser = (user: user) => action(ACTIONS.ADD_USER, user)

export const noUser = () => action(ACTIONS.NO_USER)

export const loginUser = (user: user) => action(ACTIONS.LOGIN, user)

export const logoutSaga = () => action(ACTIONS.LOGOUT)

export const fetchUser = () => action(ACTIONS.FETCH_USER)

export const logoutRedux = () => action(ACTIONS.CLEAR_USER)

// categories

export const fetchCategories = () => action(ACTIONS.FETCH_CATEGORIES)

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
        filter: { searchQuery: query },
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
        filter: { searchQuery: query, currentUser: true },
        force,
    })

export const fetchPaginatedGoodsForUser = (
    filter: Record<'userId', number>,
    pageName: string,
    pageNumber?: number,
    query?: string,
    force?: boolean
) =>
    action(ACTIONS.FETCH_GOODS, {
        pageName,
        pageNumber,
        filter: { searchQuery: query, ...filter },
        force,
    })

export const fetchPaginatedGoodsForCategory = (
    filter: Record<'categorySlug', string>,
    pageName: string,
    pageNumber?: number,
    query?: string,
    force?: boolean
) =>
    action(ACTIONS.FETCH_GOODS, {
        pageName,
        pageNumber,
        filter: { searchQuery: query, ...filter },
        force,
    })

export const fetchPaginatedOrders = (
    pageName: string,
    pageNumber?: number,
    query?: string,
    force?: boolean
) =>
    action(ACTIONS.FETCH_ORDERS, {
        pageName,
        pageNumber,
        filter: { searchQuery: query },
        force,
    })

export const pageFetching = (
    pageName: string,
    page: number,
    isFetching: boolean,
    force = false
) =>
    action(ACTIONS.PAGE_FETCHING, {
        pageName,
        page,
        isFetching,
        force,
    })

export const pageUpdate = (
    pageName: string,
    pageIds: number[] | string[],
    count: number,
    pageNumber: number = 1
) => action(ACTIONS.PAGINATOR_UPDATE, { pageName, pageIds, count, pageNumber })

export const initPage = (pageName: string) =>
    action(ACTIONS.PAGINATOR_INIT, { pageName })

export const fetchPage = (pageName: string, page: number) =>
    action(ACTIONS.FETCH_PAGE, { pageName, page })

export const changeCurrentPage = (pageName: string, page: number) =>
    action(ACTIONS.CHANGE_PAGE, { pageName, page })

export const clearPage = (pageName: string) =>
    action(ACTIONS.CLEAR_PAGE, { pageName })

export const setPageFilter = (
    pageName: string,
    filter: Record<string, string>
) => action(ACTIONS.SET_FILTER, { pageName, filter })

//entities

export const updateEntities = (
    normalizedData: { entities: entities },
    strategy: string = STRATEGIES.MERGE
) =>
    action(ACTIONS.UPDATE_ENTITIES, {
        entities: normalizedData.entities,
        strategy,
    })

export const deleteEntity = (entityName: string, entityId: number) =>
    action(ACTIONS.DELETE_ONE_ENTITY, { entityName, entityId })

export const updateEntityArrayField = (data: {
    entityName: string
    entityId: number
    entityField: string
    data: any
}) => action(ACTIONS.ENTITY_UPDATE_ARRAY_FIELD, data)

// errors

export const fetchFailed = (message) => action(ACTIONS.FETCH_FAILED, message)
