import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Layout from '@/app/layout'
import Image from "next/image";
import Link from "next/link";

import container from '@/server/container'
import GoodCard from '@/app/components/goodCard'
import { good } from "@/app/interfaces";


export default function Goods(props: {goods: good[]}) {
    const { goods } = props;

    return (
        <Layout>


            <div className="mx-auto flex flex-wrap justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {goods.map((good, i) => (
                        <div key={i}>
                                <GoodCard good={good} categories={good.categories} />
                        </div>
                    ))
                    }
                </div>
            </div>
        </Layout>
    );
}


const router = createRouter()
    .get(async (req, res) => {
        const goods = await container.resolve("GoodService").getGoods();
        if (!goods) {
            return { props: { notFound: true } };
        }
        return { props: { goods: JSON.parse(JSON.stringify(goods)) } };
    });


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
    return await router.run(req, res);
}
