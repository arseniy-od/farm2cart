import Link from 'next/link'
import Image from 'next/image'

import Layout from '@/app/layout'

import CartHandler from '../cart/cartHandler'
import CreateReview from '../reviews/createReview'
import ReviewCard from '../reviews/reviewCard'
import { ReactElement } from 'react'
import { HalfStar, BlankStar, Star } from '../icons/star'

export default function GoodPage({ good, reviews, handleDelete, setReviews }) {
    function roundHalf(num: number) {
        return Math.round(num * 2) / 2
    }

    let stars: ReactElement[] = []
    if (good.averageScore) {
        let score = roundHalf(good.averageScore)
        for (let i = 0; i < 5; i++) {
            if (score === 0.5) {
                stars.push(<HalfStar />)
                score = 0
            } else if (score === 0) {
                stars.push(<BlankStar />)
            } else {
                stars.push(<Star />)
                score -= 1
            }
        }
    }

    if (good.error) {
        return (
            <Layout>
                <div className="ml-6 mt-6 text-2xl font-semibold">
                    {good.message}
                </div>
            </Layout>
        )
    }
    return (
        <Layout>
            <div className="flex flex-col justify-center">
                <div className="mx-auto">
                    <div className="mx-auto mt-6 flex flex-col justify-center items-center w-2/3">
                        <div>
                            <h3 className="text-xl font-semibold">
                                {good.title}
                            </h3>
                            <Link
                                href={'/users/' + good.seller.id}
                                className="text-gray-700"
                            >
                                {good.seller.username}
                            </Link>

                            {good.averageScore && good.reviewsCount ? (
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
                                    src={good.imageUrl}
                                    alt={good.title + ' photo'}
                                    width="1024"
                                    height="1024"
                                    className="object-cover object-center w-full h-full shadow-lg"
                                />
                                <div className="mr-3 mb-3 absolute flex right-0 bottom-0 bg-gray-100 min-w-[2rem;] min-h-[2rem;] rounded-full items-center justify-center">
                                    <CartHandler good={good} />
                                </div>

                                {!good.active || !good.available ? (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-10 bg-white text-gray-900 text-center flex justify-center items-center font-semibold text-xl">
                                        Product is not active
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-2">
                                <p>{good.description}</p>

                                <div className="text-gray-700">
                                    ₴ {good.price}
                                </div>
                                <div className="text-gray-700">
                                    Available: {good.available}
                                </div>
                            </div>
                        </div>
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
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {reviews.length !== 0
                        ? reviews.map((review, i) => {
                              return <ReviewCard review={review} key={i} />
                          })
                        : null}
                </div>
                <CreateReview
                    good={good}
                    reviews={reviews}
                    setReviews={setReviews}
                />
            </div>
        </Layout>
    )
}
