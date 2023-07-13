import { connect, ConnectedProps } from 'react-redux'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { ContextDynamicRoute } from '@/app/types/interfaces'
import GoodsPage from '@/app/components/goods/goodsPage'
import { RootState } from '@/redux/store'
import { wrapper } from '@/redux/store'
import { updateEntities } from '@/redux/actions'
import { goodsSchema, categoriesSchema } from '@/redux/normalSchemas'

function Goods(props: PropsFromRedux) {
    return (
        <GoodsPage
            goods={props.reduxGoods}
            categories={props.reduxCategories}
        />
    )
}

function getActiveGoods(state: RootState) {
    const goods = Object.values(state.entities.goods || {})
    return goods.filter((good) => good.active && good.available)
}

const mapState = (state: RootState) => ({
    reduxGoods: getActiveGoods(state),
    reduxCategories: state.entities.categories || {},
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/'
        const res = await container.resolve('GoodController').run(ctx)
        const { goods, categories } = res.props?.data
        // console.log('\n\n\nStore state:', store.getState())
        // console.log('\n\n\nGoods: ', goods)
        const normGoods = normalize(goods, goodsSchema)
        const normCategories = normalize(categories, categoriesSchema)
        // console.log('Norm goods:', normGoods)
        // console.log('Norm categories:', normCategories)
        store.dispatch(updateEntities(normGoods))
        store.dispatch(updateEntities(normCategories))
        // store.dispatch(addInitialGoods(goods))
        // store.dispatch(addInitialCategories(categories))

        return { props: {} }
    }
)

export default connector(Goods)
