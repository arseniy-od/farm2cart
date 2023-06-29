const initialState = []

export default function goodsReducer(state = initialState, action) {
    switch (action.type) {
        case 'goods/fetch_success': {
            return [...action.payload]
        }
        default:
            return state
    }
}
