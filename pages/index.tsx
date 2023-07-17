import { connect, ConnectedProps } from 'react-redux'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { ContextDynamicRoute } from '@/app/types/interfaces'
import GoodsPage from '@/app/components/goods/goodsPage'
import { RootState } from '@/redux/store'
import { wrapper } from '@/redux/store'
import { fetchCartItems, updateEntities } from '@/redux/actions'
import { goodsSchema, categoriesSchema } from '@/redux/normalSchemas'
import { useEffect } from 'react'

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

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/'
        const res = await container.resolve('GoodController').run(ctx)
        const { goods, categories } = res.props?.data
        const normGoods = normalize(goods, goodsSchema)
        const normCategories = normalize(categories, categoriesSchema)
        store.dispatch(updateEntities(normGoods))
        store.dispatch(updateEntities(normCategories))

        return { props: {} }
    }
)

export default connector(Goods)
