import Layout from '@/app/layout'
import container from '@/server/container'
import { ContextDynamicRoute } from '@/app/types/interfaces'
import OrderCard from '@/app/components/orders/orderCard'
import { ConnectedProps, connect } from 'react-redux'
import { RootState } from '@/redux/store'
import { normalize } from 'normalizr'
import { orderSchema } from '@/redux/normalSchemas'
import { updateEntities } from '@/redux/actions'
import ErrorMessage from '@/app/components/errorMessage'
import clientContainer from '@/redux/container'
import { isEmpty } from '@/app/utils'
import { normalizeResponse } from '@/app/normalizeResponse'

function Order({ order, goods, orderGoods }: Props) {
    if (!order || isEmpty(order)) {
        return (
            <Layout>
                <ErrorMessage message="Order not found" />
            </Layout>
        )
    }
    return (
        <Layout>
            <OrderCard order={order} goods={goods} orderGoods={orderGoods} />
        </Layout>
    )
}

const mapState = (state: RootState, ownProps) => ({
    order: state.entities.orders?.[ownProps.id],
    user: state.user,
    orders: state.entities.orders,
    goods: state.entities.goods,
    orderGoods: state.entities.orderGoods,
})

const connector = connect(mapState, null)
type Props = ConnectedProps<typeof connector>
export default connector(Order)

export const getServerSideProps = clientContainer
    .resolve('redux')
    .wrapper.getServerSideProps((store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/orders/:id'
        const res = await container.resolve('OrderController').run(ctx)
        const order = res?.props?.data
        const normOrder = normalizeResponse(order, orderSchema)
        store.dispatch(updateEntities(normOrder))
        return { props: { id: order.id } }
    })
