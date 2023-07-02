import good from '@/server/services/good'
import { useState, MouseEvent, useEffect } from 'react'

export default function CartHandler({ good }) {
    const [inCart, setInCart] = useState(false)
    const isInCart = () => {
        fetch('/api/cart')
            .then((res) => res.json())
            .then((cartContent) => {
                // console.log('Cart content')
                if (!cartContent.blank) {
                    let isFound = false
                    for (let product of cartContent.goods) {
                        if (product.id === good.id) {
                            isFound = true
                        }
                    }
                    setInCart(isFound)
                }
            })
    }

    useEffect(isInCart, [good.id])

    async function handleAddCart(event: MouseEvent<HTMLButtonElement>) {
        console.log('Before post request')
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goodId: good.id }),
        })

        if (res.ok) {
            setInCart(true)
            const cartRes = await res.json()
            console.log('Good added to cart')
        } else {
            console.log('Problem while adding good to cart')
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
