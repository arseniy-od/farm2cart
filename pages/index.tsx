import { connect, ConnectedProps } from 'react-redux'

import container from '@/server/container'
import { category, good } from '@/app/types/interfaces'
import { useEffect } from 'react'
import { useAppSelector } from '@/redux/hooks'
import GoodsPage from '@/app/components/app'
import { RootState } from '@/redux/store'

function Goods(props: Props) {
    const { goods, addInitial } = props
    // const dispatch = useAppDispatch()
    // const goodsSelector = useAppSelector((state) => state.goods)
    const catSelector = useAppSelector((state) => state.categories)

    useEffect(() => {
        addInitial(goods)
    }, [addInitial, goods])

    // useEffect(() => {
    //     dispatch({ type: 'goods/add_initial', payload: goods })
    // }, [dispatch, goods])

    return (
        <GoodsPage
            goods={props.reduxGoods}
            categories={catSelector.length ? catSelector : props.categories}
        />
    )
}

const mapState = (state: RootState) => ({
    isInitialGoods: state.goods.initial,
    reduxGoods: state.goods.data,
    reduxCategories: state.categories,
})

const mapDispatch = {
    addInitial: (goods: good[]) => ({
        type: 'goods/initial',
        payload: goods,
    }),
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { goods: good[]; categories: category[] }
export default connector(Goods)

export async function getServerSideProps(ctx) {
    ctx.routeName = '/'
    //todo: refactor to one call
    const goods = await container.resolve('GoodController').run(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    console.log('categories', categories)

    return {
        props: { goods: goods.props.data, categories },
    }
}
