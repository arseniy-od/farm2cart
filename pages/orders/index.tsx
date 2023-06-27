import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import { OrdersProps } from '@/app/interfaces'

export default function Order(props) {
    const orders = props.data
    console.log('Orders: ', orders)

    return (
        <Layout>
            {orders.map((order, i) => (
                <div key={i}>
                    <Link href={'/orders/' + order.id}>
                        <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                            <h4>Order #{order.id}</h4>
                            <p>Total: ${order.total}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
    return await container.resolve('OrderController').run(ctx)
}
