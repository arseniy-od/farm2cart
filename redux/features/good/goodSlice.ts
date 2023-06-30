import { good } from '@/app/types/interfaces'

const initialState: good[] = []

export default function goodsReducer(state = initialState, action) {
    switch (action.type) {
        case 'goods/fetch_success': {
            return [...action.payload]
        }
        case 'goods/add_initial': {
            return [...action.payload]
        }
        case 'goods/decrement_quantity': {
            const { id, quantity } = action.payload
            const goods = state.filter((good) => good.id !== id)
            const good = state.find((good) => good.id === id)
            good.quantity = quantity
            return [...goods, good]
        }
        default:
            return state
    }
}
