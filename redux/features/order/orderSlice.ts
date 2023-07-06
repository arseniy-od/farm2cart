import { order, orderWithGoods } from '@/app/types/interfaces'

export type orderState = orderWithGoods[]

const initialState: orderState = []

export default function ordersReducer(
    state = initialState,
    action
): orderState {
    switch (action.type) {
        case 'orders/fetch_success': {
            return [...action.payload]
        }
        case 'orders/add_order': {
            return [...state, action.payload]
        }

        default:
            return state
    }
}
