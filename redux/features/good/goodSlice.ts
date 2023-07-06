import { good } from '@/app/types/interfaces'

export type goodState = good[]

const initialState: goodState = []

export default function goodsReducer(
    state: goodState = initialState,
    action
): goodState {
    switch (action.type) {
        case 'goods/fetch_success': {
            return [...action.payload]
        }
        case 'goods/fetch_my_success': {
            return [...action.payload]
        }
        case 'goods/initial': {
            return [...action.payload]
        }
        case 'goods/initial_good': {
            const good = action.payload
            const goods = state.filter((otherGood) => otherGood.id !== good.id)
            return [...goods, good]
        }
        case 'goods/decrement_quantity': {
            const { id, quantity } = action.payload
            const goods = state.filter((good) => good.id !== id)
            const good = state.find((good) => good.id === id)
            if (good) {
                return [...goods, { ...good, quantity }]
            }
            return state
        }
        case 'goods/delete_good': {
            const { id } = action.payload
            const goods = state.filter((good) => good.id !== id)
            const good = state.find((good) => good.id === id)
            if (good) {
                return [...goods, { ...good, active: false }]
            }
            return state
        }
        case 'goods/activate_good': {
            const { id } = action.payload
            const goods = state.filter((good) => good.id !== id)
            const good = state.find((good) => good.id === id)
            if (good) {
                return [...goods, { ...good, active: true }]
            }
            return state
        }
        case 'goods/edit_good': {
            const { id } = action.payload
            const goods = state.filter((good) => good.id !== id)
            return [...goods, action.payload]
        }
        case 'goods/create_good': {
            return [...state, action.payload]
        }
        case 'goods/add_review': {
            const review = action.payload
            const goods = state.filter((good) => good.id !== review.good.id)
            const good = state.find((good) => good.id === review.good.id)
            if (good && good.reviews) {
                console.log('[reducer] Review: ', review)
                console.log('[reducer] Good: ', good)
                return [
                    ...goods,
                    { ...good, reviews: [...good.reviews, review] },
                ]
            }
            return state
        }

        default:
            return state
    }
}
