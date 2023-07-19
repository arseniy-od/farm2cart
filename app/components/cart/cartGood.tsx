import Image from 'next/image'
import { cartItem, good } from '@/app/types/entities'
import { useAppDispatch } from '@/redux/hooks'
import { changeGoodQuantity } from '@/redux/actions'
import ErrorMessage from '../errorMessage'

type cartGoodProps = {
    cartItem?: cartItem
    good?: good
    index: number
    handleDelete: (index: number) => Promise<void>
}

export default function CartGood({
    cartItem,
    good,
    index,
    handleDelete,
}: cartGoodProps) {
    const dispatch = useAppDispatch()

    if (!cartItem || !good) {
        return <ErrorMessage message="Item not found" />
    }

    function increment() {
        if (
            cartItem?.quantity &&
            good?.available &&
            cartItem.quantity < good.available
        ) {
            dispatch(changeGoodQuantity(good.id, cartItem.quantity + 1))
        }
    }

    function decrement() {
        if (cartItem?.quantity && good && cartItem.quantity > 1) {
            dispatch(changeGoodQuantity(good.id, cartItem.quantity - 1))
        }
    }

    return (
        <div className="ml-4 mt-4 w-3/4 bg-gray-100 shadow-lg overflow-hidden lg:w-1/2 xl:w-1/4">
            <div className="flex justify-between h-44 min-w-full">
                <div className="ml-4">
                    <div className="font-semibold text-xl">{good.title}</div>
                    <div>Price: {good.price}</div>
                    <div>
                        Total: {(good.price || 0) * (cartItem.quantity || 0)}
                    </div>
                    <div className="flex w-24 items-center justify-left">
                        <button
                            type="button"
                            className="px-2 py-2 "
                            onClick={decrement}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 448 512"
                            >
                                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                            </svg>
                        </button>
                        <div>{cartItem.quantity}</div>
                        <button
                            type="button"
                            className="px-2 py-2"
                            onClick={increment}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 448 512"
                            >
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button
                            className="mt-2 px-4 py-2 block bg-red-500 hover:bg-red-700 rounded-lg text-white shadow-lg"
                            type="button"
                            onClick={() => handleDelete(index)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div className="ml-6 w-1/2 min-h-full">
                    <Image
                        src={good.imageUrl || '/uploads/no_image.png'}
                        alt="image of product"
                        width="255"
                        height="255"
                        className="w-full h-full object-center object-cover"
                    />
                </div>
            </div>
        </div>
    )
}
