import { combineReducers } from 'redux'
import userReducer from './features/user/userSlice'
import categoriesReducer from './features/category/categorySlice'
import goodsReducer from './features/good/goodSlice'
import { HYDRATE } from 'next-redux-wrapper'

const combinedReducer = combineReducers({
    user: userReducer,
    categories: categoriesReducer,
    goods: goodsReducer,
})

const rootReducer = (state, action) => {
    if (action.type === HYDRATE) {
        // const data = action.payload
        // const mergedGoods = state.goods.concat(data.goods)

        // const resultGoods = mergedGoods.reduce((acc, cur) => {
        //     const index = acc.findIndex((obj) => obj.id === cur.id)
        //     if (index === -1) {
        //         acc.push(cur)
        //     } else {
        //         acc[index] = cur
        //     }
        //     return acc
        // }, [])

        return {
            ...state,
            ...action.payload,
            /// remove old good while adding new one
            // user: { ...state.user, ...action.payload.user },
            // goods: resultGoods,
            // categories: [...state.categories, ...action.payload.categories],
        }
    } else {
        return combinedReducer(state, action)
    }
}

export default rootReducer
