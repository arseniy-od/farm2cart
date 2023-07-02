import { good } from '@/app/types/interfaces'
import goods from '@/pages/api/goods'
import { GOOGLE_FONT_PROVIDER } from 'next/dist/shared/lib/constants'

const initialState: { initial: boolean; data: good[] } = {
    initial: true,
    data: [],
}

export default function goodsReducer(state = initialState, action) {
    switch (action.type) {
        case 'goods/fetch_success': {
            return { initial: false, data: [...action.payload] }
        }
        case 'goods/add_initial': {
            return { initial: false, data: [...action.payload] }
        }
        case 'goods/decrement_quantity': {
            const { id, quantity } = action.payload
            const goods = state.data.filter((good) => good.id !== id)
            const good = state.data.find((good) => good.id === id)
            if (good) {
                good.quantity = quantity
                return { ...state, data: [...goods, good] }
            }
            return state
        }
        case 'goods/delete_good': {
            const { id } = action.payload
            const goods = state.data.filter((good) => good.id !== id)
            const good = state.data.find((good) => good.id === id)
            if (good) {
                good.active = false
                return { ...state, data: [...goods, good] }
            }
            return state
        }
        default:
            return state
    }
}
