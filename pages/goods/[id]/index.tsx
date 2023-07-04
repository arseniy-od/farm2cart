import { useRouter } from 'next/navigation'
import { useState, MouseEvent, Component, ReactElement, useEffect } from 'react'

import { ConnectedProps, connect, useStore } from 'react-redux'

import { apiDelete, apiActivate } from '@/app/utils'
import container from '@/server/container'
import {
    ContextDynamicRoute,
    GoodProps,
    category,
    good,
} from '@/app/types/interfaces'

import GoodPage from '@/app/components/goods/goodPage'
import { RootState, wrapper } from '@/redux/store'
import { activateGood, addInitialGood, deleteGood } from '@/redux/actions'

function Good(props: Props) {
    const { good } = props
    const [reviews, setReviews] = useState(good.reviews)

    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        if (!good?.active) {
            const res = await apiActivate(`/api/goods/?id=${good.id}`, good.id)
            console.log(res)
            if (!res.error) {
                props.activateGood(good.id)
            }
        } else {
            const res = await apiDelete(`/api/goods/?id=${good.id}`)
            if (!res.error) {
                props.deleteGood(good.id)
            }
        }
    }

    return (
        <GoodPage
            good={good}
            reviews={good.reviews}
            setReviews={setReviews}
            handleDelete={handleDelete}
        />
    )
}

const mapState = (state: RootState, ownProps) => ({
    good: state.goods.find((good) => good.id === ownProps.id),
})

const mapDispatch = {
    addInitialGood,
    deleteGood,
    activateGood,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & GoodProps

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/goods/:id'
        const res = await container.resolve('GoodController').run(ctx)
        const good = res.props?.data
        console.log('Good is: ', good)
        store.dispatch(addInitialGood(good))

        return { props: { id: good.id } }
    }
)

export default connector(Good)

// cant use static because of dynamic generated routes
// export async function getServerSideProps(ctx: ContextDynamicRoute) {
//     ctx.routeName = '/goods/:id'
//     ctx.res.setHeader(
//         'Cache-Control',
//         'public, s-maxage=10, stale-while-revalidate=59'
//     )
//     return await container.resolve('GoodController').run(ctx)
// }
