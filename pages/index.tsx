import { connect, ConnectedProps } from 'react-redux'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { ContextDynamicRoute, good } from '@/app/types/interfaces'
import GoodsPage from '@/app/components/goods/goodsPage'
import { RootState } from '@/redux/store'
import { fetchCartItems, updateEntities } from '@/redux/actions'
import { goodsSchema, categoriesSchema } from '@/redux/normalSchemas'
import { useEffect } from 'react'
import clientContainer from '@/redux/container'
import { normalizeResponse } from '@/app/normalizeResponse'
import initServerStore from '@/server/initServerStore'

function Goods({ goods, categories, fetchCartItems }: PropsFromRedux) {
    useEffect(() => {
        fetchCartItems()
    }, [fetchCartItems])
    return <GoodsPage goods={goods} categories={categories} />
}

function getActiveGoods(state: RootState) {
    const goods = Object.values(state.entities.goods || {})
    return goods.filter((good) => good.active && good.available)
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

export const getServerSideProps = clientContainer
    .resolve('redux')
    .wrapper.getServerSideProps(
        initServerStore(
            [
                container.resolve('GoodController'),
                container.resolve('CategoryController'),
            ],
            '/'
        )
    )

export default connector(Goods)
