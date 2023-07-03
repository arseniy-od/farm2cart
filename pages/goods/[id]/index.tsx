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
import { RootState } from '@/redux/store'

function Good(props: Props) {
    const good = props.data
    const [reviews, setReviews] = useState(good.reviews)

    const { addInitial } = props
    useEffect(() => {
        addInitial(good)
    }, [addInitial, good])

    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        if (!props.reduxGood?.active) {
            const res = await apiActivate(`/api/goods/?id=${good.id}`, good.id)
            console.log(res)
            if (!res.error) {
                props.activateGood(good.id)
            } else {
                console.error(res.error)
            }
        } else {
            const res = await apiDelete(`/api/goods/?id=${good.id}`)
            if (!res.error) {
                props.deleteGood(good.id)
            } else {
                console.error(res.error)
            }
        }
    }

    return (
        <GoodPage
            good={props.reduxGood ? props.reduxGood : good}
            reviews={reviews}
            setReviews={setReviews}
            handleDelete={handleDelete}
        />
    )
}

const mapState = (state: RootState, ownProps) => ({
    reduxGood: state.goods.data.find((good) => good.id === ownProps.data.id),
})

const mapDispatch = {
    addInitial: (good: good) => ({
        type: 'goods/initial_good',
        payload: good,
    }),
    deleteGood: (id) => ({
        type: 'goods/delete_good',
        payload: { id },
    }),
    activateGood: (id) => ({
        type: 'goods/activate_good',
        payload: { id },
    }),
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & GoodProps
export default connector(Good)

// cant use static because of dynamic generated routes
export async function getServerSideProps(ctx: ContextDynamicRoute) {
    ctx.routeName = '/goods/:id'
    ctx.res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=59'
    )
    return await container.resolve('GoodController').run(ctx)
}
