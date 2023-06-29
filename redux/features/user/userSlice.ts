const initialState = {}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'user/fetch_success': {
            return {
                ...action.payload,
            }
        }
        case 'user/logout': {
            return {
                user: {},
            }
        }
        default:
            return state
    }
}
