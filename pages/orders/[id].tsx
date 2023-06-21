import { GetServerSideProps } from 'next'

import Layout from '@/app/layout'
import container from '@/server/container'
import { OrderProps } from '@/app/interfaces'
import OrderCard from '@/app/components/orderCard'

export default function Order({ order }: OrderProps) {
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return await container.resolve('OrderController').getOrder(ctx)
}
