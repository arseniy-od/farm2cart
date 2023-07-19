import { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { addToCart, fetchCartItems } from '@/redux/actions'
import { isEmpty } from '@/app/utils'

import { RootState } from '@/redux/store'
import { good } from '@/app/types/entities'

function CartHandler({
    good,
    cartItems,
    fetchCartItems,
    addToCart,
}: PropsFromRedux & { good: good }) {
    const [inCart, setInCart] = useState(false)

    const isInCart = () => {
        if (cartItems && !isEmpty(cartItems) && good.id) {
            setInCart(good.id in cartItems)
        }
    }

    useEffect(isInCart, [cartItems, good.id, fetchCartItems])

    async function handleAddCart() {
        if (good.id) {
            addToCart(good.id)
        }
    }
    return (
        <div className="">
            {inCart ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
            ) : (
                <button onClick={handleAddCart} className="block">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 448 512"
                    >
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                </button>
            )}
        </div>
    )
}

const mapState = (state: RootState) => ({
    cartItems: state.entities.cartItems,
    goods: state.entities.goods,
})

const mapDispatch = {
    fetchCartItems,
    addToCart,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(CartHandler)
