import { configureStore } from '@reduxjs/toolkit'
import { constants } from 'buffer'

const initialState = { value: 0 }

function counterReducer(
    state = initialState,
    action: { type: string; payload?: unknown }
) {
    if (action.type === 'counter/increment') {
        return {
            ...state,
            value: state.value + 1,
        }
    }
    return state
}

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())

store.dispatch({ type: 'counter/increment' })

console.log(store.getState())

const increment = () => {
    return { type: 'counter/increment' }
}

store.dispatch(increment())
console.log(store.getState())

const selectCounterValue = (state: { value: number }) => state.value
const currentValue = selectCounterValue(store.getState())
console.log(currentValue)

export default function Home() {
    return <div>Redux</div>
}
