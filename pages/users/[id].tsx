import { ConnectedProps, connect } from 'react-redux'

import { normalizeResponse } from '@/app/normalizeResponse'
import container from '@/server/container'
import clientContainer from '@/redux/container'
import { RootState } from '@/redux/store'
import { goodsSchema, userSchema } from '@/redux/normalSchemas'
import { updateEntities } from '@/redux/actions'
import { toTitle, formatDate } from '@/app/utils'

import ErrorMessage from '@/app/components/errorMessage'
import Layout from '@/app/layout'
import GoodCard from '@/app/components/goods/goodCard'

import { ContextDynamicRoute } from '@/app/types/interfaces'
import { useState } from 'react'
import { good } from '@/app/types/entities'

function User(props: Props) {
    const user = props.user
    const goods = props.goods

    const [query, setQuery] = useState('')

    const filterGoods = (goods: good[]) => {
        return goods.filter((good) =>
            (good.title + ' ' + good.description || '')
                .toLowerCase()
                .includes(query.toLowerCase())
        )
    }
    const filtered = filterGoods(Object.values(goods))

    const handleSearch = (e) => {
        setQuery(e.target.value)
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
                {user.role === ('seller' || 'admin') ? (
                    <div>
                        <h3 className="ml-6 mt-3 text-xl font-semibold">
                            {user.username}&apos;s products:
                        </h3>
                        <div className="mx-auto flex flex-wrap justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filtered.map((good, i) => (
                                    <div key={i}>
                                        <GoodCard good={good} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

function getGoodsForUser(state: RootState, userId) {
    if (state.entities.goods) {
        const goods = Object.values(state.entities.goods)
        return goods.filter((good) => good.seller === userId)
    }
    return []
}

const mapState = (state: RootState, ownProps) => ({
    user: state.entities.users?.[ownProps.id],
    goods: getGoodsForUser(state, ownProps.id),
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number; error?: boolean; message?: string }

export const getServerSideProps = clientContainer
    .resolve('redux')
    .wrapper.getServerSideProps((store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/users/:id'
        const res = await container.resolve('UserController').run(ctx)
        if (res.props?.error) {
            return { props: res.props }
        }
        const user = res.props?.data.user
        const goods = res.props?.data.goods
        console.log('\n\nGoods:', goods)
        const normUser = normalizeResponse(user, userSchema)
        if (goods.length) {
            const normGoods = normalizeResponse(goods, goodsSchema)
            store.dispatch(updateEntities(normGoods))
        }
        store.dispatch(updateEntities(normUser))
        return { props: { id: user.id } }
    })

export default connector(User)
