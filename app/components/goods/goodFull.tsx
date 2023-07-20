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
            <div className="mx-auto mt-6 flex flex-col justify-center items-center w-2/3">
                <div>
                    <h3 className="text-xl font-semibold">{good.title}</h3>
                    <Link
                        href={'/users/' + seller.id}
                        className="text-gray-700"
                    >
                        {seller.username}
                    </Link>

                    {stars.length ? (
                        <div className=" flex items-center justify-left">
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
                            className="object-cover object-center w-full h-full shadow-lg"
                        />
                        <div className="mr-3 mb-3 absolute flex right-0 bottom-0 bg-gray-100 min-w-[2rem;] min-h-[2rem;] rounded-full items-center justify-center">
                            <CartHandler good={good} />
                        </div>

                        {good.active && good.available ? null : (
                            <div>
                                <div className="z-10 absolute w-full h-full bg-gray-900 opacity-70 inset-0"></div>
                                <div className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-10 bg-white text-gray-900 text-center flex justify-center items-center font-semibold text-xl">
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
                                    className="pr-3 underline text-gray-700 hover:text-gray-900"
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
                    <div className="mt-2 mx-auto flex justify-between">
                        <Link
                            href={`/goods/${good.id}/edit/`}
                            className="block px-6 py-2 border-2 font-semibold border-green-600 hover:bg-gray-200 shadow-lg"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="ml-6 block px-6 py-2 border-2 font-semibold border-red-600 hover:bg-gray-200 shadow-lg"
                        >
                            {good.active ? 'Delete' : 'Activate'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
