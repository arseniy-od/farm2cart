import { useState } from 'react'

import GoodForm from '@/app/components/goods/goodForm'
import container from '@/server/container'
import { category } from '@/app/types/interfaces'

interface IGoodBase {
    id: string
    title: string
    description: string
    imageUrl: string
    price: string
    file: File | null
    available: string
}

interface IGood extends IGoodBase {
    categories: category[]
}
interface IGoodCategoryIds extends IGoodBase {
    categories: string[]
}

export default function Home({
    good,
    categories,
}: {
    good: IGood
    categories: category[]
}) {
    const categoryIds = good.categories.map((c) => c.id.toString())
    console.log('Cat ids: ', categoryIds)
    const [goodData, setGoodData] = useState<IGoodCategoryIds>({
        ...good,
        categories: categoryIds,
    })

    return (
        <GoodForm
            good={goodData}
            setGood={setGoodData}
            categories={categories}
            method="put"
        />
    )
}

export const getServerSideProps = async (ctx) => {
    ctx.routeName = '/goods/:id'
    //todo: refactor to one call
    const good = await container.resolve('GoodController').getGood(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    return {
        props: { good, categories },
    }
}
