import { GetServerSideProps } from 'next'

import Layout from '@/app/layout'
import container from '@/server/container'
import { ContextDynamicRoute, OrderProps } from '@/app/types/interfaces'
import OrderCard from '@/app/components/orders/orderCard'

export default function Order(props: OrderProps) {
    const order = props.data
    if (order.notFound) {
        return (
            <Layout>
                <h1 className="text-2xl font-semibold">Order not found</h1>
            </Layout>
        )
    }
    return (
        <Layout>
            <OrderCard order={order} />
        </Layout>
    )
}

export async function getServerSideProps(ctx: ContextDynamicRoute) {
    ctx.routeName = '/orders/:id'
    return await container.resolve('OrderController').run(ctx)
}
