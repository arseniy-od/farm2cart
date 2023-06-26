import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Layout from '@/app/layout'
import Image from 'next/image'
import Link from 'next/link'

import container from '@/server/container'
import GoodCard from '@/app/components/goodCard'
import { GoodProps, GoodsProps, category, good } from '@/app/interfaces'

export default function Goods({
    goods,
    categories,
}: {
    goods: good[]
    categories: category[]
}) {
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
        <Layout>
            <div className="mx-4 flex flex-wrap justify-center">
                <CategoryIcon
                    text={categories[0].text}
                    imageUrl="/categories/percent.jpg"
                    link="/categories/sale"
                />
                <CategoryIcon
                    text={categories[1].text}
                    imageUrl="/categories/leaves.jpg"
                    link="/categories/organic"
                />
                <CategoryIcon
                    text={categories[2].text}
                    imageUrl="/categories/berries.jpg"
                    link="/categories/berry"
                />
                <CategoryIcon
                    text="Other"
                    imageUrl="/categories/ellipsis.jpg"
                    link="/categories"
                />
            </div>
            <div className="mx-auto flex flex-wrap justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {goods.map((good, i) => (
                        <div key={i}>
                            <GoodCard good={good} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
    const goods = await container.resolve('GoodController').run(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    console.log('categories', categories)

    return {
        props: { goods: goods.props.data, categories },
    }
}
