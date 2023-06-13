import { createRouter } from "next-connect";
import { useRouter } from 'next/navigation';
import Layout from '@/app/layout';
import { useState, useEffect } from "react";
import session, { middlewares } from "@/middleware/session";
import Link from "next/link";
import axios from "axios";


import { findGoodById, getGoodsForUser } from '@/services/good'
import { totalmem } from "os";
import goods from "../api/goods";




export default function Cart({ cart }) {

    const [cartGoods, setCartGoods] = useState([...cart])
    const {push} = useRouter()
    
    const config = {
        headers: { 'content-type': 'application/json' },
    };

    function getTotal(goods) {
        let total:number = 0
        for (let good of goods) {
            total += good.price * good.quantity
        }
        return total
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Submit")
        

        const cartData = {goods: cartGoods, total: getTotal(cartGoods)}

        const response = await axios.post('/api/orders', cartData, config);
        console.log("Response id: ", response)
        push('/orders/')
    }


    function CartGood({ good, index }) {
        
        async function handleDelete(event) {
            console.log("DELETE")
            
            const res = await fetch(`/api/cart?index=${index}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                // query: JSON.stringify(index)
            });
            if (res.ok) {
                const deleted = await res.json();
                console.log("Good deleted");
            } else {
                console.log("Good not deleted")
            }            
        }

        function handleChange(event) {
            let items = [...cartGoods];
            let item = { ...items[index] };
            item.quantity = parseInt(event.target.value);
            items[index] = item;
            setCartGoods(items);
        }

        return (
            <div>
                <div>
                    id: {index}
                </div>
                <div>
                    Title: {good.title}
                </div>
                <div>
                    Price: {good.price}
                </div>
                <div>
                    Total: {good.price * cartGoods[index].quantity}
                </div>
                <div>
                    <label htmlFor="quantity">Quantity: </label>
                    <input type="number" id="quantity" value={cartGoods[index].quantity}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        );

    }

    return (
        <Layout>
            <div>
                <h1>Cart</h1>
                <div>
                    <form>
                        {cart.map((good, i) => (
                            <div key={i}>
                                <CartGood good={good} index={i} />
                                <br />
                            </div>
                        ))}
                        <button type="submit" onClick={handleSubmit}>Submit</button>
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

        // const goods = await getGoodsForUser(req.user.id);
        // const parsedGoods = JSON.parse(JSON.stringify(goods))
        // console.log("-----------------------------------------------\n\n")
        // console.log("Goods are: ", parsedGoods)
        if (!cart) {
            return { props: { notFound: true } };
        }
        return cart;
    });


export async function getServerSideProps({ req, res }) {
    const cart = await router.run(req, res);
    let cartGoods = []
    for (let cartEl of cart) {
        const good = await findGoodById(cartEl.goodId);
        cartGoods.push({ quantity: 1, ...good })
    }

    return { props: { cart: cartGoods } }
}