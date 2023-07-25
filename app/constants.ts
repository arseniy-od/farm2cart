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

// it has to be 1 more than on page
export const GOODS_PER_PAGE = 6
export const ORDERS_PER_PAGE = 6

export const GOODS_TABLE = 'GoodsTable'
export const MY_GOODS_TABLE = 'MyGoodsTable'
export const USER_GOODS_TABLE = 'UserGoodsTable'

export const ACTIONS = {
    CREATE_GOOD: 'GoodEntity_createGood',
    UPDATE_GOOD: 'GoodEntity_updateGood',
    FETCH_GOODS: 'GoodEntity_fetchGoods',
    ACTIVATE_GOOD: 'GoodEntity_activateGood',
    DEACTIVATE_GOOD: 'GoodEntity_deactivateGood',
    FETCH_CART: 'CartEntity_fetchCart',
    ADD_TO_CART: 'CartEntity_addToCart',
    DELETE_CART_ITEM: 'CartEntity_deleteCartItem',
    UPDATE_ENTITY: 'entities/update_one',
    CLEAR_ENTITY: 'entities/clear',
}
