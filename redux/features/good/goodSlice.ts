import { good } from '@/app/types/interfaces'
import goods from '@/pages/api/goods'
import { GOOGLE_FONT_PROVIDER } from 'next/dist/shared/lib/constants'

type goodState = { initial: boolean; data: good[] }

const initialState: goodState = {
    initial: true,
    data: [],
}

export default function goodsReducer(
    state: goodState = initialState,
    action
): goodState {
    switch (action.type) {
        case 'goods/fetch_success': {
            return { initial: false, data: [...action.payload] }
        }
        case 'goods/initial': {
            return { initial: false, data: [...action.payload] }
        }
        case 'goods/initial_good': {
            const good = action.payload
            const goods = state.data.filter((good) => good.id !== good.id)
            return { ...state, data: [...goods, good] }
        }
        case 'goods/decrement_quantity': {
            const { id, quantity } = action.payload
            const goods = state.data.filter((good) => good.id !== id)
            const good = state.data.find((good) => good.id === id)
            if (good) {
                return {
                    ...state,
                    data: [...goods, { ...good, quantity }],
                }
            }
            return state
        }
        case 'goods/delete_good': {
            const { id } = action.payload
            const goods = state.data.filter((good) => good.id !== id)
            const good = state.data.find((good) => good.id === id)
            if (good) {
                return {
                    ...state,
                    data: [...goods, { ...good, active: false }],
                }
            }
            return state
        }
        case 'goods/activate_good': {
            const { id } = action.payload
            const goods = state.data.filter((good) => good.id !== id)
            const good = state.data.find((good) => good.id === id)
            if (good) {
                return {
                    ...state,
                    data: [...goods, { ...good, active: true }],
                }
            }
            return state
        }
        case 'goods/edit_good': {
            const { id } = action.payload
            const goods = state.data.filter((good) => good.id !== id)

            return {
                ...state,
                data: [...goods, action.payload],
            }
        }
        case 'goods/create_good': {
            const { id } = action.payload

            return {
                ...state,
                data: [...state.data, action.payload],
            }
        }

        default:
            return state
    }
}
