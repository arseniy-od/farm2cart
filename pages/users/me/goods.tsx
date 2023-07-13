import Layout from '@/app/layout'
import { useEffect } from 'react'

import GoodCard from '@/app/components/goods/goodCard'

import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'
import { fetchMyGoods } from '@/redux/actions'

function MyGoods({ user, goods, fetchMyGoods }: Props) {
    useEffect(() => {
        fetchMyGoods()
    }, [fetchMyGoods, user])

    if (user.error) {
        return (
            <Layout>
                <h2 className="ml-5 mt-5 text-2xl">{user.message}</h2>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                Username:{' '}
                <span className="text-indigo-500">@{user.username}</span>
            </div>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-5 mt-3 text-xl">Your products:</h3>
                        {goods.map((good, i) => (
                            <div key={i}>
                                <div>
                                    <GoodCard good={good} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

function getGoodsForUser(state: RootState, userId: number) {
    if (state.entities.goods) {
        const goods = Object.values(state.entities.goods)
        return goods.filter((good) => good.seller === userId)
    }
    return []
}

const mapState = (state: RootState) => ({
    user: state.user,
    goods: getGoodsForUser(state, state.user.id),
})

const mapDispatch = {
    fetchMyGoods,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyGoods)
