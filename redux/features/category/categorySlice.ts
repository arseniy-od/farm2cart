const initialState = []

export default function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case 'categories/fetch_success': {
            return [...action.payload]
        }
        default:
            return state
    }
}
