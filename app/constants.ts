type ObjectValues<T> = T[keyof T]

export const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
}

export const STRATEGIES = {
    MERGE: 'MERGE',
    REPLACE: 'REPLACE',
}

export const GOODS_PER_PAGE = 6
export const ORDERS_PER_PAGE = 12

export const GOODS_TABLE = 'GoodsTable'
export const MY_GOODS_TABLE = 'MyGoodsTable'
export const USER_GOODS_TABLE = 'UserGoodsTable'
export const CATEGORY_GOODS_TABLE = 'CategoryGoodsTable'

export const ORDERS_TABLE = 'OrdersTable'

export const ACTIONS = {
    CREATE_GOOD: 'GoodEntity_createGood',
    UPDATE_GOOD: 'GoodEntity_updateGood',
    FETCH_GOODS: 'GoodEntity_fetchGoods',
    ACTIVATE_GOOD: 'GoodEntity_activateGood',
    DEACTIVATE_GOOD: 'GoodEntity_deactivateGood',

    FETCH_CART: 'CartEntity_fetchCart',
    ADD_TO_CART: 'CartEntity_addToCart',
    DELETE_CART_ITEM: 'CartEntity_deleteCartItem',

    FETCH_ORDERS: 'OrderEntity_fetchOrders',
    ADD_ORDER: 'OrderEntity_addOrder',
    CREATE_ORDER_FAIL: 'saga/create_order_fail',

    CREATE_REVIEW: 'ReviewEntity_addReview',

    CREATE_USER: 'AuthEntity_createUser',
    ADD_USER: 'user/fetch_success',
    NO_USER: 'user/fetch_blank',
    LOGIN: 'AuthEntity_loginUser',
    LOGOUT: 'AuthEntity_logoutUser',
    FETCH_USER: 'AuthEntity_fetchUser',
    CLEAR_USER: 'user/logout',

    FETCH_CATEGORIES: 'CategoryEntity_fetchCategories',

    UPDATE_ENTITIES: 'entities/update',
    UPDATE_ENTITY: 'entities/update_one',
    CLEAR_ENTITY: 'entities/clear',
    DELETE_ONE_ENTITY: 'entities/delete_one',
    ENTITY_UPDATE_ARRAY_FIELD: 'entities/update_array_field',

    PAGE_FETCHING: 'paginator/page_fetching',
    PAGINATOR_INIT: 'paginator/init',
    PAGINATOR_UPDATE: 'paginator/update',
    CHANGE_PAGE: 'paginator/change_page',
    CLEAR_PAGE: 'paginator/clear_page',
    SET_FILTER: 'paginator/set_filter',
    FETCH_PAGE: 'PageEntity_fetchPage',

    FETCH_FAILED: 'saga/fetch_failed',
} as const

export type actionType = ObjectValues<typeof ACTIONS>

export const CODES = {
    TOAST: 'TOAST',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
}
