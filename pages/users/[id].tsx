import { ConnectedProps, connect } from 'react-redux'

import container, { di } from '@/server/container'
import clientContainer from '@/redux/container'
import { RootState } from '@/redux/store'
import { goodsSchema, userSchema } from '@/redux/normalSchemas'
import { fetchPaginatedGoodsForUser, updateEntities } from '@/redux/actions'
import { toTitle, formatDate } from '@/app/utils'

import ErrorMessage from '@/app/components/errorMessage'
import Layout from '@/app/layout'
import GoodCard from '@/app/components/goods/goodCard'

import { ContextDynamicRoute } from '@/app/types/interfaces'
import { useState } from 'react'
import { good } from '@/app/types/entities'
import { USER_GOODS_TABLE } from '@/app/constants'
import initServerStore from '@/server/initServerStore'
import GoodTable from '@/app/components/goods/goodTable'
import { useAppDispatch } from '@/redux/hooks'

function User(props: Props) {
    const user = props.user
    const goods = props.goods
    const dispatch = useAppDispatch()

    const handleSearch = (e) => {
        e.preventDefault()
        const query = e.target.search.value
        if (user?.id) {
            dispatch(
                fetchPaginatedGoodsForUser(user.id, USER_GOODS_TABLE, 1, query)
            )
        } else {
            throw new Error('User not found')
        }
    }
    if (!user) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        )
    }

    if (!user || props.error) {
        return (
            <Layout>
                <ErrorMessage message="User not found" />
            </Layout>
        )
    }
    return (
        <Layout handleSearch={handleSearch}>
            <div>
                <div className="ml-4 max-w-xs">
                    <div className="mt-4 px-4 py-3 text-lg bg-gray-100 shadow-lg">
                        <div className="text-indigo-500">@{user.username}</div>
                        <p>
                            {toTitle(user.firstName || '')}{' '}
                            {toTitle(user.lastName || '')}
                        </p>
                        <p>email: {user.email}</p>
                        <p>
                            Registration date:{' '}
                            {formatDate(user.registrationDate || '')}
                        </p>
                    </div>
                </div>
                {goods.length && (
                    <div>
                        <h3 className="ml-6 mt-3 text-xl font-semibold">
                            {user.username}&apos;s products:
                        </h3>
                        <GoodTable
                            goods={goods}
                            pageName={USER_GOODS_TABLE}
                            fetchAction={fetchPaginatedGoodsForUser}
                            userId={user.id}
                        />
                    </div>
                )}
            </div>
        </Layout>
    )
}

function getGoodsPage(state: RootState) {
    const goods = Object.values(state.entities.goods || {})
    const page = state.pagination[USER_GOODS_TABLE]
    return goods.filter(
        (good) =>
            good.id &&
            page?.pages?.[page?.currentPage || 0].ids.includes(good.id)
    )
}

const mapState = (state: RootState, ownProps) => ({
    user: state.entities.users?.[ownProps.query.id],
    goods: getGoodsPage(state),
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number; error?: boolean; message?: string }

export const getServerSideProps = clientContainer
    .resolve('redux')
    .wrapper.getServerSideProps(
        initServerStore(
            [di('GoodController'), di('UserController')],
            '/users/:id'
        )
    )

export default connector(User)

// (store) => async (ctx: ContextDynamicRoute) => {
//         await container.resolve('UserController').run(ctx, store, '/users/:id')
//         return await container
//             .resolve('GoodController')
//             .run(ctx, store, '/users/:id')
//     }
