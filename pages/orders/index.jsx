import {createRouter} from "next-connect";
import {getOrders} from "../../services";

export default function Order(props){
  const { orders } = props;

  return orders.map((order, i) => {
    return (
        <div key={i}>{order.total}</div>
    );
  });
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


