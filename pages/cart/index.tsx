import { createRouter } from "next-connect";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";

import session, { middlewares } from "@/middleware/session";
import Layout from '@/app/layout';
import CartGood from "@/app/components/cartGood";
import container from "@/server/container";




export default function Cart({ cart }) {

    if (cart.notFound) {
        return (
            <Layout>
                <h1>Cart is empty</h1>
            </Layout>
        )
    }

    const [cartGoods, setCartGoods] = useState([...cart])
    const { push } = useRouter()

    const config = {
        headers: { 'content-type': 'application/json' },
    };

    function getTotal(goods) {
        let total: number = 0
        for (let good of goods) {
            total += good.price * good.quantity
        }
        return total
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Submit")
        const cartData = { goods: cartGoods, total: getTotal(cartGoods) }
        const response = await axios.post('/api/orders', cartData, config);
        const orderId = response.data.id;
        push('/orders/' + response.data.id)
    }

    return (
        <Layout>
            <div>
                <h1 className="ml-4 mt-4 text-2xl">Cart</h1>
                <div>
                    <form>
                        {cart.map((good, i) => (
                            <div key={i}>
                                <CartGood good={good} index={i} cartGoods={cartGoods} setCartGoods={setCartGoods} />
                                
                            </div>
                        ))}
                        <button className="mt-4 ml-4 px-6 py-3 inline-block bg-gray-200 rounded-lg shadow-lg hover:bg-gray-300"
                        type="submit" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </Layout>

    );
}



const router = createRouter()
    .use(session)
    .use(middlewares[0])
    .use(middlewares[1])
    .get(async (req, res) => {
        // console.log("session: ", req.session);
        const cart = req.session.cart
        if (!cart) {
            return { notFound: true };
        }
        return cart;
    });


export async function getServerSideProps({ req, res }) {
    const cart = await router.run(req, res);
    if (cart.notFound) {
        return { props: { cart: { notFound: true } } }
    }
    let cartGoods = []
    for (let cartEl of cart) {
        const good = await container.resolve("GoodService").findGoodById(cartEl.goodId);
        cartGoods.push({ quantity: 1, ...good })
    }

    return { props: { cart: cartGoods } }
}

