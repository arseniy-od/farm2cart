import Link from 'next/link'
import Image from 'next/image'
import { useState, MouseEvent } from 'react'
import { category, good } from '../interfaces'

export default function GoodCard({
    good,
    categories,
}: {
    good: good
    categories: category[]
}) {
    const [inCart, setInCart] = useState(false)
    const isInCart = async () => {
        const cart = await fetch('/api/cart')
        // console.log("[GoodCard] cart is: ", cart)
        const cartContent = await cart.json()
        // console.log("[GoodCard] cart.json is: ", cartContent)
        if (!cartContent.blank) {
            let isFound = false
            for (let product of cartContent) {
                if (product.goodId === good.id) {
                    isFound = true
                }
            }
            setInCart(isFound)
        }
    }

    isInCart()

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

    function Category() {
        return (
            <div>
                {categories.map((category, i) => (
                    <Link
                        href={'/categories/' + category.text.toLowerCase()}
                        className="inline-block px-1 text-indigo-500"
                        key={i}
                    >
                        {category.text}
                    </Link>
                ))}
            </div>
        )
    }

    return (
        <div className="mt-4 mx-3">
            <div className="px-4 py-2 max-w-xs w-full text-lg justify-center bg-gray-100">
                <div className="shadow-lg">
                    <div className="z-0 relative flex items-center justify-center w-72 h-72  overflow-hidden">
                        <Link
                            href={'/goods/' + good.id}
                            className="w-full h-full"
                        >
                            <Image
                                src={good.imageUrl}
                                alt={good.title + ' photo'}
                                width="1024"
                                height="1024"
                                className="object-cover object-center w-full h-full"
                            />
                        </Link>
                        <div className="mr-3 mb-3 absolute flex items-center justify-center  bottom-0 right-0 bg-gray-100 min-w-[2rem;] min-h-[2rem;] rounded-full items-center">
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
                                    <button
                                        onClick={handleAddCart}
                                        className="block"
                                    >
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
                        </div>
                    </div>
                    <div className="px-2 py-2 bg-gray-100">
                        <Link
                            href={'/users/' + good.seller.id}
                            className="text-gray-700"
                        >
                            {good.seller.username}
                        </Link>
                        <Link href={'/goods/' + good.id}>
                            <h3 className="text-xl font-semibold">
                                {good.title}
                            </h3>

                            {good.averageScore && good.reviewsCount ? (
                                <div className="mx-12 flex justify-between">
                                    <div>
                                        Rating: {good.averageScore.toFixed(1)}
                                    </div>

                                    <div className="text-gray-600">
                                        {good.reviewsCount} review
                                        {good.reviewsCount > 1 ? 's' : null}
                                    </div>
                                </div>
                            ) : null}

                            <p>{good.description}</p>

                            <div className="text-gray-700">₴ {good.price}</div>
                            <div className="text-gray-700">
                                Available: {good.available}
                            </div>
                        </Link>
                    </div>
                </div>
                {/* {categories && categories.length ? <Category /> : null} */}
            </div>
        </div>
    )
}
