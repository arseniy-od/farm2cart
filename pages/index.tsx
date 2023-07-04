import { connect, ConnectedProps } from 'react-redux'

import container from '@/server/container'
import { category, ContextDynamicRoute, good } from '@/app/types/interfaces'
import { useEffect } from 'react'
import { useAppSelector } from '@/redux/hooks'
import GoodsPage from '@/app/components/goods/goodsPage'
import { RootState } from '@/redux/store'
import { wrapper } from '@/redux/store'
import { addInitialCategories, addInitialGoods } from '@/redux/actions'

function Goods(props: PropsFromRedux) {
    return (
        <GoodsPage
            goods={props.reduxGoods}
            categories={props.reduxCategories}
        />
    )
}

const mapState = (state: RootState) => ({
    reduxGoods: state.goods,
    reduxCategories: state.categories,
})

const mapDispatch = {
    addInitialGoods,
    addInitialCategories,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/'
        const res = await container.resolve('GoodController').run(ctx)
        const { goods, categories } = res.props?.data
        store.dispatch(addInitialGoods(goods))
        store.dispatch(addInitialCategories(categories))

        return { props: {} }
    }
)

export default connector(Goods)
