import { createRouter } from "next-connect";
import Layout from '@/app/layout';
import { useState, useEffect } from "react";
import session, { middlewares } from "@/middleware/session";
import Link from "next/link";

import { isConstructorDeclaration } from "typescript";
import GoodCard from "@/app/components/goodCard";
import container from "@/server/container";
import { NextApiRequest, NextApiResponse } from "next";
import { GoodsProps, user } from "@/app/interfaces";
import OrderCard from "@/app/components/orderCard";


export default function User({ goods, orders }: GoodsProps) {
    type userType = user & { error?: string, message?: string }
    const [user, setUser] = useState(null as null | userType);
    const [isLoading, setLoading] = useState(false);
    function fetchUser() {
        setLoading(true);
        fetch('/api/users/me')
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setLoading(false);
            });
    }

    useEffect(fetchUser, []);

    if (isLoading) return <Layout><div>loading...</div></Layout>;
    if (!user) return <Layout><div>User not found</div></Layout>;

    if (user.error) {
        return <Layout><h2 className="ml-5 mt-5 text-2xl">{user.message}</h2></Layout>
    }

    return (
        <Layout>
            <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                Username: <span className="text-indigo-500">@{user.username}</span>
            </div>
            <div>
                {user.role === "seller" || "admin"
                    ? <div>
                        <h3 className="ml-5 mt-3 text-xl">Your products:</h3>
                        {goods.map((good, i) => (
                            <div key={i}>
                                <div>
                                    <GoodCard good={good} categories={good.categories} />
                                </div>
                            </div>
                        ))}

                        {orders.map((order, i) => (
                            <div key={i}>
                                <div key={i}>
                                    <OrderCard order={order}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    : null}



            </div>
        </Layout >
    );

}


const router = createRouter()
    .use(session)
    .use(middlewares[0])
    .use(middlewares[1])
    .get(async (req, res) => {
        const goods = await container.resolve("GoodService").getGoodsBySellerId(req.user.id);
        const orders = await container.resolve("OrderService").getOrdersByCustomerId(req.user.id)
        const parsedGoods = JSON.parse(JSON.stringify(goods))
        const parsedOrders = JSON.parse(JSON.stringify(orders))
        if (!goods) {
            return { props: { notFound: true } };
        }
        return {
            props: {
                goods: parsedGoods,
                orders: parsedOrders
            }
        };
    });


export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const response = await router.run(req, res);
    return response
}