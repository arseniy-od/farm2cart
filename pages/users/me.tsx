import { createRouter } from "next-connect";
import Layout from '@/app/layout';
import { useState, useEffect } from "react";
import session, { middlewares } from "@/middleware/session";
import Link from "next/link";


import { getGoodsForUser } from '@/services/good'
import { isConstructorDeclaration } from "typescript";
import GoodCard from "@/app/components/goodCard";

export default function User({ goods }) {
    const [user, setUser] = useState(null);
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

    if (isLoading) return <Layout></Layout>;
    if (!user) return <Layout></Layout>;

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
                        <div>
                            <Link href="/goods/create">Add new product</Link>
                        </div>
                        <h3 className="ml-5 mt-3 text-xl">Your products:</h3>
                        {goods.map((good, i) => (
                            <div key={i}>
                                <div>
                                    <GoodCard good={good} categories={good.Categories}/>
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
        console.log("session: ", req.session);

        const goods = await getGoodsForUser(req.user.id);
        const parsedGoods = JSON.parse(JSON.stringify(goods))
        console.log("-----------------------------------------------\n\n")
        console.log("Goods are: ", parsedGoods)
        if (!goods) {
            return { props: { notFound: true } };
        }
        return { props: { goods: parsedGoods, } };
    });


export async function getServerSideProps({ req, res }) {
    // console.log("<<<<<<<<<<<<<<<<SSR>>>>>>>>>>>>>>>>>>>>")
    const response = await router.run(req, res);
    // console.log("[SSR] response: ", response)
    return response
}