import { GetServerSideProps } from 'next'

import { getOrderById, getAllOrderIds } from '@/services/order'
import Layout from '@/app/layout';



export default function Order({order}) {
    return (
        <Layout>
            <div>Order #{order.id}</div>
            <div>total: {order.total}</div>
            <div>
                <div>Goods: </div>
                {order.goods.map((good, i) => (
                    <div key={i}>
                        <div>
                            {good.OrderGood.quantity}x {good.title} for {good.price} each
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // console.log("Got slug: ", params.slug);
    const { id } = ctx.query;
    let orderData = await getOrderById(id);
    // console.log("goodData is: ", categoryData);
    orderData = JSON.parse(JSON.stringify(orderData));
    console.log("orderData is: ", orderData)
    return {
        props: {
            order: orderData
        }
    }
}