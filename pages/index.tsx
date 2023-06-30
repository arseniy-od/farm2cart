import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Layout from '@/app/layout'
import Image from 'next/image'
import Link from 'next/link'

import container from '@/server/container'
import GoodCard from '@/app/components/goodCard'
import { GoodProps, GoodsProps, category, good } from '@/app/types/interfaces'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useStore } from 'react-redux'

export default function Goods({
    goods,
    categories,
}: {
    goods: good[]
    categories: category[]
}) {
    const [fetchedGoods, setFetchedGoods] = useState(goods)
    const [fetchedCategories, setFetchedCategories] = useState(categories)

    const store = useStore()
    const dispatch = useAppDispatch()
    const goodSelector = useAppSelector((state) => state.goods)
    // const fetchedCategories = useAppSelector((state) => state.categories)

    useEffect(() => {
        dispatch({ type: 'goods/add_initial', payload: goods })
    }, [dispatch, goods])

    // store.subscribe(() =>
    //     setFetchedGoods(goodSelector.length ? goodSelector : goods)
    // )

    // dispatched in layout
    // useEffect(() => {
    //     dispatch({ type: 'categories/fetch_request' })
    // }, [dispatch])

    function CategoryIcon({ text, imageUrl, link }) {
        return (
            <Link href={link}>
                <div className="mx-4 flex flex-col items-center">
                    <div className="mt-2 flex items-center overflow-hidden rounded-full w-12 h-12">
                        <Image
                            src={imageUrl}
                            alt="category image"
                            width="100"
                            height="100"
                            className="object-cover object-center h-full w-full"
                        />
                    </div>
                    <div className="mt-2 text-center font-semibold">{text}</div>
                </div>
            </Link>
        )
    }

    return (
        <Layout home={true}>
            <div className="mx-4 flex flex-wrap justify-center">
                {fetchedCategories.length ? (
                    <>
                        <CategoryIcon
                            text={fetchedCategories[0].text}
                            imageUrl="/categories/percent.jpg"
                            link="/categories/sale"
                        />
                        <CategoryIcon
                            text={fetchedCategories[1].text}
                            imageUrl="/categories/leaves.jpg"
                            link="/categories/organic"
                        />
                        <CategoryIcon
                            text={fetchedCategories[2].text}
                            imageUrl="/categories/berries.jpg"
                            link="/categories/berry"
                        />
                        <CategoryIcon
                            text="Other"
                            imageUrl="/categories/ellipsis.jpg"
                            link="/categories"
                        />
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <div className="mx-auto flex flex-wrap justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {fetchedGoods.map((good, i) => (
                        <div key={i}>
                            <GoodCard good={good} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps(ctx) {
    ctx.routeName = '/'
    //todo: refactor to one call
    const goods = await container.resolve('GoodController').run(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    console.log('categories', categories)

    return {
        props: { goods: goods.props.data, categories },
    }
}
