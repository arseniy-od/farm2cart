import { useRouter } from 'next/navigation'
import { useState, MouseEvent } from 'react'

import { ConnectedProps, connect } from 'react-redux'
import { normalize } from 'normalizr'

import { apiDelete, apiActivate } from '@/app/utils'
import container from '@/server/container'
import { ContextDynamicRoute, GoodProps } from '@/app/types/interfaces'

import GoodPage from '@/app/components/goods/goodPage'
import { RootState, wrapper } from '@/redux/store'
import {
    activateGood,
    addInitialGood,
    deleteGood,
    updateEntities,
} from '@/redux/actions'
import Layout from '@/app/layout'
import { goodSchema } from '@/redux/normalSchemas'

function Good(props: Props) {
    const { good } = props

    if (!good) {
        return (
            <Layout>
                <h1>Good not found</h1>
            </Layout>
        )
    }

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

    return <GoodPage good={good} handleDelete={handleDelete} />
}

const mapState = (state: RootState, ownProps) => ({
    good: state.entities.goods[ownProps.id],
})

const mapDispatch = {
    addInitialGood,
    deleteGood,
    activateGood,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number }

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/goods/:id'
        const res = await container.resolve('GoodController').run(ctx)
        const good = res.props?.data
        console.log('Good is: ', good)
        const normGood = normalize(good, goodSchema)
        store.dispatch(updateEntities(normGood))
        // store.dispatch(addInitialGood(good))

        return { props: { id: good.id } }
    }
)

export default connector(Good)
