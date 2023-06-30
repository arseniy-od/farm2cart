import {
    GetServerSideProps,
    GetServerSidePropsContext,
    PreviewData,
} from 'next'
import { useRouter } from 'next/navigation'
import { useState, MouseEvent, Component, ReactElement } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/app/layout'
import GoodCard from '@/app/components/goodCard'
import { formatDateTime } from '@/app/utils'
import container from '@/server/container'
import { ContextDynamicRoute, GoodProps, good } from '@/app/types/interfaces'
import ReviewCard from '@/app/components/reviewCard'
import { BlankStar, HalfStar, Star } from '@/app/components/icons/star'
import CreateReview from '@/app/components/createReview'
import CartHandler from '@/app/components/cartHandler'
import goods from '@/pages/api/goods'
import { ParsedUrlQuery } from 'querystring'
import { useStore } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

export default function Good({ data }: GoodProps) {
    const [fetchedGood, setGood] = useState(data)
    const categories = fetchedGood.categories
    const [reviews, setReviews] = useState(fetchedGood.reviews)

    const { push } = useRouter()
    const store = useStore()
    const dispatch = useAppDispatch()

    const goodSelector = useAppSelector((store) =>
        store.goods.find((good) => good.id === fetchedGood.id)
    )

    store.subscribe(() => setGood(goodSelector ? goodSelector : fetchedGood))

    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        const res = await fetch(`/api/goods/?id=${fetchedGood.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // query: JSON.stringify(good.id)
        })
        if (res.ok) {
            const deleted = await res.json()
            console.log('Good deleted with res:', deleted)
            dispatch({
                type: 'goods/delete_good',
                payload: { id: fetchedGood.id },
            })
            // push('/goods')
        } else {
            console.error('Good not deleted')
        }
    }

    function roundHalf(num: number) {
        return Math.round(num * 2) / 2
    }

    let stars: ReactElement[] = []
    if (fetchedGood.averageScore) {
        let score = roundHalf(fetchedGood.averageScore)
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

    if (fetchedGood.error) {
        return (
            <Layout>
                <div className="ml-6 mt-6 text-2xl font-semibold">
                    {fetchedGood.message}
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
                                {fetchedGood.title}
                            </h3>
                            <Link
                                href={'/users/' + fetchedGood.seller.id}
                                className="text-gray-700"
                            >
                                {fetchedGood.seller.username}
                            </Link>

                            {fetchedGood.averageScore &&
                            fetchedGood.reviewsCount ? (
                                <div className=" flex items-center justify-left">
                                    <div className="flex">
                                        {stars.map((star, i) => (
                                            <div key={i}>{star}</div>
                                        ))}
                                    </div>

                                    <div className="ml-2 text-gray-600">
                                        {fetchedGood.reviewsCount}
                                    </div>
                                </div>
                            ) : null}
                            <div className="relative">
                                <Image
                                    src={fetchedGood.imageUrl}
                                    alt={fetchedGood.title + ' photo'}
                                    width="1024"
                                    height="1024"
                                    className="object-cover object-center w-full h-full shadow-lg"
                                />
                                <div className="mr-3 mb-3 absolute flex right-0 bottom-0 bg-gray-100 min-w-[2rem;] min-h-[2rem;] rounded-full items-center justify-center">
                                    <CartHandler good={fetchedGood} />
                                </div>

                                {!fetchedGood.active ||
                                !fetchedGood.available ? (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-10 bg-white text-gray-900 text-center flex justify-center items-center font-semibold text-xl">
                                        Product is not active
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-2">
                                <p>{fetchedGood.description}</p>

                                <div className="text-gray-700">
                                    ₴ {fetchedGood.price}
                                </div>
                                <div className="text-gray-700">
                                    Available: {fetchedGood.available}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 mx-auto flex justify-between">
                            <Link
                                href={`/goods/${fetchedGood.id}/edit/`}
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
                    good={fetchedGood}
                    reviews={reviews}
                    setReviews={setReviews}
                />
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    return await container.resolve('GoodController').getStaticPaths()
}

export async function getStaticProps(ctx: ContextDynamicRoute) {
    ctx.routeName = '/goods/:id'
    return await container.resolve('GoodController').run(ctx)
}
