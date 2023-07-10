import { category, good } from '@/app/types/interfaces'

// export const addInitialGoods = (goods: good[]) => ({
//     type: 'goods/initial',
//     payload: goods,
// })

// export const addInitialCategories = (categories: category[]) => ({
//     type: 'categories/initial',
//     payload: categories,
// })

// export const addInitialGood = (good: good) => ({
//     type: 'goods/initial_good',
//     payload: good,
// })

export const deleteGood = (id) => ({
    type: 'goods/delete_good',
    payload: { id },
})

export const activateGood = (id) => ({
    type: 'goods/activate_good',
    payload: { id },
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

export const fetchMyGoods = (id) => ({
    type: 'saga/fetch_my_goods',
    payload: id,
})

export const updateEntities = (entities) => ({
    type: 'entities/update',
    payload: entities,
})
