import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Layout from '@/app/layout'
import Image from 'next/image'
import Link from 'next/link'

import container from '@/server/container'
import GoodCard from '@/app/components/goodCard'
import { category, good } from '@/app/interfaces'
import categories from '../api/categories'

export default function Goods({
    goods,
    categories,
}: {
    goods: good[]
    categories: category[]
}) {
    return (
        <Layout>
            <div className="flex flex-wrap justify-center">
                <div className="grid grid-cols-4 gap-2">
                    {categories.map((category, i) => (
                        <div key={i}>{category.text}</div>
                    ))}
                </div>
            </div>
            <div className="mx-auto flex flex-wrap justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {goods.map((good, i) => (
                        <div key={i}>
                            <GoodCard
                                good={good}
                                categories={good.categories}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
    const goods = await container.resolve('GoodController').getGoods()
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    return { props: { ...goods, ...categories } }
}
