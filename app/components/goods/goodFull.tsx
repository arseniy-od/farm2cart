import Link from 'next/link'
import Image from 'next/image'
import CartHandler from '../cart/cartHandler'

export default function GoodFull({
    good,
    seller,
    stars,
    categories,
    handleDelete,
    user,
}) {
    return (
        <div className="mx-auto">
            <div className="mx-auto mt-6 flex w-2/3 flex-col items-center justify-center">
                <div>
                    <h3 className="text-xl font-semibold">{good.title}</h3>
                    <Link
                        href={'/users/' + seller.id}
                        className="text-gray-700"
                    >
                        {seller.username}
                    </Link>

                    {stars.length ? (
                        <div className=" justify-left flex items-center">
                            <div className="flex">
                                {stars.map((star, i) => (
                                    <div key={i}>{star}</div>
                                ))}
                            </div>

                            <div className="ml-2 text-gray-600">
                                {good.reviewsCount}
                            </div>
                        </div>
                    ) : null}
                    <div className="relative">
                        <Image
                            src={
                                good.imageUrl
                                    ? good.imageUrl
                                    : '/uploads/no_image.png'
                            }
                            alt={good.title + ' photo'}
                            width="1024"
                            height="1024"
                            className="h-full w-full object-cover object-center shadow-lg"
                        />
                        <div className="absolute bottom-0 right-0 mb-3 mr-3 flex min-h-[2rem;] min-w-[2rem;] items-center justify-center rounded-full bg-gray-100">
                            <CartHandler good={good} />
                        </div>

                        {good.active && good.available ? null : (
                            <div>
                                <div className="absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-70"></div>
                                <div className="absolute left-1/2 top-1/2 z-10 flex h-10 w-5/6 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-white text-center text-xl font-semibold text-gray-900">
                                    Product is not active
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <p>{good.description}</p>

                        <div className="text-gray-700">₴ {good.price}</div>
                        <div className="text-gray-700">
                            Available: {good.available}
                        </div>
                        <div className="flex">
                            {categories.map((category, i) => (
                                <div
                                    key={i}
                                    className="pr-3 text-gray-700 underline hover:text-gray-900"
                                >
                                    <Link
                                        href={`/categories/${category.text.toLowerCase()}`}
                                    >
                                        {category.text}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {user.id === seller.id && (
                    <div className="mx-auto mt-2 flex justify-between">
                        <Link
                            href={`/goods/${good.id}/edit/`}
                            className="block border-2 border-green-600 px-6 py-2 font-semibold shadow-lg hover:bg-gray-200"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="ml-6 block border-2 border-red-600 px-6 py-2 font-semibold shadow-lg hover:bg-gray-200"
                        >
                            {good.active ? 'Delete' : 'Activate'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
