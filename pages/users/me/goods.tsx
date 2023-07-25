import Layout from '@/app/layout'
import { useEffect, useState } from 'react'

import GoodCard from '@/app/components/goods/goodCard'

import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'
import {
    fetchMyGoods,
    fetchMyPaginatedGoods,
    fetchPaginatedGoods,
} from '@/redux/actions'
import { isEmpty } from '@/app/utils'
import ErrorMessage from '@/app/components/errorMessage'
import { good } from '@/app/types/entities'
import GoodTable from '@/app/components/goods/goodTable'
import { MY_GOODS_TABLE } from '@/app/constants'
import { useAppDispatch } from '@/redux/hooks'

function MyGoods({ user, goods, fetchMyGoods }: Props) {
    // useEffect(() => {
    //     fetchMyGoods()
    // }, [fetchMyGoods, user])
    const dispatch = useAppDispatch()

    const handleSearch = (e) => {
        e.preventDefault()
        const query = e.target.search.value
        dispatch(fetchPaginatedGoods(MY_GOODS_TABLE, 1, query))
    }

    if (!user || isEmpty(user)) {
        return (
            <Layout>
                <ErrorMessage message="You are not logged in" />
            </Layout>
        )
    }

    return (
        <Layout handleSearch={handleSearch}>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-6 mt-3 text-xl font-semibold xl:text-center xl:text-2xl">
                            Your products:
                        </h3>
                        <GoodTable
                            goods={goods}
                            pageName={MY_GOODS_TABLE}
                            fetchAction={fetchMyPaginatedGoods}
                        />
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

function getGoodsForUser(state: RootState) {
    if (state.entities.goods) {
        const page = state.pagination[MY_GOODS_TABLE]
        const goods = Object.values(state.entities.goods)
        if (state.user.id) {
            return goods.filter(
                (good) =>
                    good.id &&
                    page?.pages?.[page?.currentPage || 0].ids.includes(good.id)
            )
        }
    }
    return []
}

const mapState = (state: RootState) => ({
    user: state.user,
    goods: getGoodsForUser(state),
})

const mapDispatch = {
    fetchMyGoods,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyGoods)
