import { category, good } from '@/app/types/interfaces'

export const addInitialGoods = (goods: good[]) => ({
    type: 'goods/initial',
    payload: goods,
})

export const addInitialCategories = (categories: category[]) => ({
    type: 'categories/initial',
    payload: categories,
})

export const addInitialGood = (good: good) => ({
    type: 'goods/initial_good',
    payload: good,
})

export const deleteGood = (id) => ({
    type: 'goods/delete_good',
    payload: { id },
})

export const activateGood = (id) => ({
    type: 'goods/activate_good',
    payload: { id },
})
