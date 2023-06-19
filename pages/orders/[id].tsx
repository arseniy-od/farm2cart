import { GetServerSideProps } from 'next'

import Layout from '@/app/layout';
import container from '@/server/container';
import { OrderProps } from '@/app/interfaces';
import OrderCard from '@/app/components/orderCard';


export default function Order({order}: OrderProps) {
    if (order.notFound) {
        return (
            <Layout>
                <h1 className='text-2xl font-semibold'>Order not found</h1>
            </Layout>
        )
    }
    return (
        <Layout>
            <OrderCard order={order}/>
        </Layout>
    );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // console.log("Got slug: ", params.slug);
    const { id } = ctx.query;
    if (!id || id instanceof Array) { return { props: { order: {notFound: true }} } }
    
    let orderData = await container.resolve("OrderService").getOrderById(id);
    // console.log("goodData is: ", categoryData);
    orderData = JSON.parse(JSON.stringify(orderData));
    console.log("orderData is: ", orderData)
    return {
        props: {
            order: orderData
        }
    }
}