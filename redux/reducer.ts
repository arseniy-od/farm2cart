import { combineReducers } from 'redux'
import userReducer from './features/user/userSlice'
import categoriesReducer from './features/category/categorySlice'
import goodsReducer from './features/good/goodSlice'

const rootReducer = combineReducers({
    user: userReducer,
    categories: categoriesReducer,
    goods: goodsReducer,
})

export default rootReducer
