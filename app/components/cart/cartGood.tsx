import Image from 'next/image'
import { cartItem, good } from '@/app/types/entities'
import { useAppDispatch } from '@/redux/hooks'
import { changeGoodQuantity } from '@/redux/actions'
import ErrorMessage from '../utils/errorMessage'

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
        <div className="ml-4 mt-4 w-3/4 overflow-hidden bg-gray-100 shadow-lg lg:w-1/2 xl:w-1/4">
            <div className="flex h-44 min-w-full justify-between">
                <div className="ml-4">
                    <div className="text-xl font-semibold">{good.title}</div>
                    <div>Price: {good.price}</div>
                    <div>
                        Total: {(good.price || 0) * (cartItem.quantity || 0)}
                    </div>
                    <div className="justify-left flex w-24 items-center">
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
                            className="mt-2 block rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg hover:bg-red-700"
                            type="button"
                            onClick={() => handleDelete(index)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div className="ml-6 min-h-full w-1/2">
                    <Image
                        src={good.imageUrl || '/uploads/no_image.png'}
                        alt="image of product"
                        width="255"
                        height="255"
                        className="h-full w-full object-cover object-center"
                    />
                </div>
            </div>
        </div>
    )
}
