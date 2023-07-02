import { useRouter } from 'next/navigation'
import { useState, MouseEvent, Component, ReactElement } from 'react'

import { useStore } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

import { apiDelete } from '@/app/utils'
import container from '@/server/container'
import { ContextDynamicRoute, GoodProps, good } from '@/app/types/interfaces'

import GoodPage from '@/app/components/goods/goodPage'

export default function Good({ data }: GoodProps) {
    const [fetchedGood, setGood] = useState(data)
    const categories = fetchedGood.categories
    const [reviews, setReviews] = useState(fetchedGood.reviews)

    const { push } = useRouter()
    const store = useStore()
    const dispatch = useAppDispatch()

    const goodSelector = useAppSelector((store) =>
        store.goods.data.find((good) => good.id === fetchedGood.id)
    )

    // store.subscribe(() => setGood(goodSelector ? goodSelector : fetchedGood))

    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        const res = await apiDelete(`/api/goods/?id=${fetchedGood.id}`)
        if (!res.error) {
            dispatch({
                type: 'goods/delete_good',
                payload: { id: fetchedGood.id },
            })
        }
    }

    return (
        <GoodPage
            good={fetchedGood}
            reviews={reviews}
            setReviews={setReviews}
            handleDelete={handleDelete}
        />
    )
}

export async function getStaticPaths() {
    return await container.resolve('GoodController').getStaticPaths()
}

export async function getStaticProps(ctx: ContextDynamicRoute) {
    ctx.routeName = '/goods/:id'
    return await container.resolve('GoodController').run(ctx)
}
