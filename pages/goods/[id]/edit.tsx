import { createRouter } from 'next-connect'
import {
    GetServerSideProps,
    GetStaticPaths,
    GetStaticProps,
    NextApiRequest,
    NextApiResponse,
} from 'next'
import Link from 'next/link'
import axios from 'axios'
import { useState, MouseEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

import GoodForm from '@/app/components/goods/goodForm'
import container from '@/server/container'
import { category } from '@/app/types/interfaces'

interface Good {
    title: string
    description: string
    imageUrl: string
    price: string
    categories: number[]
    file: File | null
    available: string
}

export default function Home({
    good,
    categories,
}: {
    good: Good
    categories: category[]
}) {
    const { push } = useRouter()
    const categoryIds = good.categories.map((c) => c.id)
    console.log('Cat ids: ', categoryIds)
    const [goodData, setGoodData] = useState<Good>({
        ...good,
        categories: categoryIds,
    })

    return (
        <GoodForm
            good={goodData}
            setGood={setGoodData}
            categories={categories}
        />
    )
}

export async function getStaticPaths() {
    return await container.resolve('GoodController').getStaticPaths()
}

export const getStaticProps = async (ctx) => {
    ctx.routeName = '/goods/:id'
    const good = await container.resolve('GoodController').getGood(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    return {
        props: { good, categories },
    }
}
