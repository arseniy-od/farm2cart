import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/app/layout'
import GoodCard from '@/app/components/goodCard'
import container from '@/server/container'
import { CategoryProps, category, good } from '@/app/interfaces'
import { IGoodModel } from '@/app/interfaces'

export default function Category({
    category,
    goods,
}: {
    category: category
    goods: good[]
}) {
    console.log('Goods: ', goods)
    return (
        <Layout>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                {goods.map((good, i) => (
                    <div key={i}>
                        <GoodCard good={good} categories={good.categories} />
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const category = await container
        .resolve('CategoryController')
        .getCategoryWithGoods(ctx)
    return {
        props: category,
    }
}
