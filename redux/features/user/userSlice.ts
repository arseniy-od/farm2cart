import { ACTIONS } from '@/app/constants'
import { Action } from '@/redux/actions'

const initialState = {}

export default function userReducer(state = initialState, action: Action) {
    switch (action.type) {
        case ACTIONS.ADD_USER: {
            return action.payload
        }
        case ACTIONS.NO_USER: {
            return { blank: true }
        }
        case ACTIONS.CLEAR_USER: {
            return initialState
        }
        default:
            return state
    }
}
