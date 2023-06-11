import {createRouter} from "next-connect";
import {getOrders} from "@/services/order";
import Layout from "@/app/layout"

export default function Order({orders}){
  // const { orders } = props;
    console.log("Orders: ", orders)

    return (
        <Layout>
            {orders.map((order, i) => (
                <div key={i}>
                    <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                        <h4>Order #{order.id}</h4>
                        <p>Total: ${order.total}</p>
                    </div>
                </div>
            ))}
        </Layout>

    );
}


const router = createRouter()
    .get(async (req, res) => {
      const orders = await getOrders();
      if (!orders) {
        return { props: { notFound: true } };
      }
      return { props: {orders: JSON.parse(JSON.stringify(orders))} };
    });


export async function getServerSideProps({ req, res }) {
  return await router.run(req, res);
}


