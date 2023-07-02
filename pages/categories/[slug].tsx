import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/app/layout'
import GoodCard from '@/app/components/goods/goodCard'
import container from '@/server/container'
import {
    CategoryProps,
    ContextDynamicRoute,
    category,
    good,
} from '@/app/types/interfaces'
import { IGoodModel } from '@/app/types/interfaces'

export default function Category({ data }) {
    const goods = data.goods
    const category = data.category
    return (
        <Layout>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                {goods.map((good, i) => (
                    <div key={i}>
                        <GoodCard good={good} />
                    </div>
                ))}
                <div>
                    <Link
                        href="/categories"
                        className="ml-4 mt-4 px-6 py-3 inline-block font-semibold shadow-lg"
                    >
                        Go to categories
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    return await container.resolve('CategoryController').getStaticPaths()
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    return await container
        .resolve('CategoryController')
        .getCategoryWithGoods(ctx)
}
