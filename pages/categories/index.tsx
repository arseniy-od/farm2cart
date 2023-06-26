import { createRouter } from 'next-connect'
import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import {
    NextApiRequest,
    NextApiResponse,
    GetServerSideProps,
    GetStaticProps,
} from 'next'

export default function Category(props: {
    categories: { id: number; text: string }[]
}) {
    const categories = props.data

    return (
        <Layout>
            {categories.map((category, i) => (
                <div key={i}>
                    <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                        <Link
                            href={'/categories/' + category.text.toLowerCase()}
                        >
                            Category: {category.text}
                        </Link>
                    </div>
                </div>
            ))}
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async function (ctx) {
    return await container
        .resolve('CategoryController')
        .getCategoriesWithGoods()
}
