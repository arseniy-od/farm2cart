import { connect, ConnectedProps } from 'react-redux'

import { di } from '@/server/container'

import GoodsPage from '@/app/components/goods/goodsPage'
import { RootState } from '@/redux/store'
import { fetchCartItems } from '@/redux/actions'
import { useEffect } from 'react'
import { clientDi } from '@/redux/container'

import initServerStore from '@/server/initServerStore'

function Goods({ goods, categories, fetchCartItems }: PropsFromRedux) {
    useEffect(() => {
        fetchCartItems()
    }, [fetchCartItems])
    return <GoodsPage goods={goods} categories={categories} />
}

function getActiveGoods(state: RootState) {
    const goods = Object.values(state.entities.goods || {})
    const page = state.pagination.GoodsTable
    return goods.filter(
        (good) =>
            good.id &&
            good.active &&
            good.available &&
            page.pages &&
            page.pages[page.currentPage || 0].ids.includes(good.id)
    )
}

const mapState = (state: RootState) => ({
    goods: getActiveGoods(state),
    categories: state.entities.categories || {},
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
