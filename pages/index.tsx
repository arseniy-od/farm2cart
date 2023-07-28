import { connect, ConnectedProps } from 'react-redux'

import { di } from '@/server/container'

import GoodsPage from '@/app/components/goods/goodsPage'
import { RootState } from '@/redux/store'
import { fetchCartItems } from '@/redux/actions'
import { useEffect } from 'react'
import { clientDi } from '@/redux/container'

import initServerStore from '@/server/initServerStore'
import { GOODS_TABLE } from '@/app/constants'
import { getGoodsPage } from '@/app/utils'

function Goods({
    goods,
    categories,
    fetchCartItems,
    pagination,
}: PropsFromRedux) {
    useEffect(() => {
        fetchCartItems()
    }, [fetchCartItems])
    return (
        <GoodsPage
            goods={goods}
            categories={categories}
            pagination={pagination}
        />
    )
}

const mapState = (state: RootState) => ({
    goods: getGoodsPage(state, GOODS_TABLE),
    categories: state.entities.categories || {},
    pagination: state.pagination[GOODS_TABLE],
})

const mapDispatch = {
    fetchCartItems,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

export const getServerSideProps = clientDi('redux').wrapper.getServerSideProps(
    initServerStore([di('GoodController'), di('CategoryController')], '/')
)

export default connector(Goods)
