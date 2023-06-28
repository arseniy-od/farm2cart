const initialState = { value: 0, user: {} }

export default function userReducer(
    state = initialState,
    action: { type: string; payload?: unknown }
) {
    if (action.type === 'counter/increment') {
        return {
            ...state,
            value: state.value + 1,
        }
    }

    if (action.type === 'counter/decrement') {
        return {
            ...state,
            value: state.value - 1,
        }
    }

    if (action.type === 'user/fetch_success') {
        return {
            ...state,
            user: action.user,
        }
    }

    return state
}
