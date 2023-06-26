import {
    GetServerSideProps,
    GetServerSidePropsContext,
    PreviewData,
} from 'next'
import { useRouter } from 'next/navigation'
import { useState, MouseEvent } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/app/layout'
import GoodCard from '@/app/components/goodCard'
import { formatDateTime } from '@/app/utils'
import container from '@/server/container'
import { ContextDynamicRoute, GoodProps, good } from '@/app/interfaces'
import ReviewCard from '@/app/components/reviewCard'
import { BlankStar, HalfStar, Star } from '@/app/components/icons/star'
import CreateReview from '@/app/components/createReview'
import CartHandler from '@/app/components/cartHandler'
import goods from '@/pages/api/goods'
import { ParsedUrlQuery } from 'querystring'

export default function Good({ data }: GoodProps) {
    const good = data
    console.log('data', data)

    const categories = good.categories
    const { push } = useRouter()
    const [reviews, setReviews] = useState(good.reviews)

    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        const res = await fetch(`/api/goods/?id=${good.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // query: JSON.stringify(good.id)
        })
        if (res.ok) {
            const deleted = await res.json()
            console.log('Good deleted')
            push('/goods')
        } else {
            console.log('Good not deleted')
        }
    }

    function roundHalf(num: number) {
        return Math.round(num * 2) / 2
    }

    let stars = []
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

export async function getServerSideProps(ctx: ContextDynamicRoute) {
    ctx.routeName = '/goods/:id'
    return await container.resolve('GoodController').run(ctx)
}
