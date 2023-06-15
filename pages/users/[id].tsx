import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link';

import Layout from '@/app/layout';
import GoodCard from '@/app/components/goodCard';
import container from '@/server/container';


export default function User({ user, goods }) {
    console.log("user: ", user)
    console.log("goods: ", goods)
    return (
        <Layout>
            <div>
                {user.role === "seller" || "admin"
                    ? <div>
                        <h3 className="ml-5 mt-3 text-xl">{user.username}&apos;s products:</h3>
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
        </Layout>
        
    );
}


export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await container.resolve("UserService").getAllUserIds()
    return {
        paths,
        fallback: false
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    const userData = await container.resolve("UserService").findUserById(params?.id);
    const goodsData = await container.resolve("GoodService").getGoodsForUser(params?.id);
    const parsedUser = JSON.parse(JSON.stringify(userData));
    const parsedGoods = JSON.parse(JSON.stringify(goodsData));

    
    return {
        props: {
            user: parsedUser,
            goods: parsedGoods,
        }
    }
}