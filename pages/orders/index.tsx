import {createRouter} from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";

import Layout from "@/app/layout"
import container from '@/server/container'
import { OrdersProps } from "@/app/interfaces";


export default function Order({orders}: OrdersProps){
  // const { orders } = props;
    console.log("Orders: ", orders)

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

    );
}


const router = createRouter()
    .get(async (req, res) => {
      const orders = await container.resolve("OrderService").getOrders();
      if (!orders) {
        return { props: { notFound: true } };
      }
      return { props: {orders: JSON.parse(JSON.stringify(orders))} };
    });


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
  return await router.run(req, res);
}


