const initialState = {}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'user/fetch_success': {
            return action.payload
        }
        case 'user/fetch_blank': {
            return { blank: true }
        }
        case 'user/logout': {
            return initialState
        }
        default:
            return state
    }
}
