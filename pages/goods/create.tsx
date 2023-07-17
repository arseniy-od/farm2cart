import { GetStaticProps } from 'next'

import container from '@/server/container'
import { category } from '@/app/types/interfaces'
import GoodForm from '@/app/components/goods/goodForm'

export default function Home({ categories }: { categories: category[] }) {
    const good = {
        id: 0,
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        categories: [],
        available: 1,
        active: true,
        seller: 0,
    }

    return <GoodForm good={good} method="post" />
}

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//     const categories = await container
//         .resolve('CategoryController')
//         .getCategories()
//     return { props: { categories } }
// }
