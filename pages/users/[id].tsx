import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link';

import {getAllUserIds, findUserById} from '@/services/user'
import { getGoodsForUser } from '@/services/good';
import Layout from '@/app/layout';
import GoodCard from '@/app/components/goodCard';

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
    const paths = await getAllUserIds()
    return {
        paths,
        fallback: false
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    const userData = await findUserById(params?.id);
    const goodsData = await getGoodsForUser(params?.id);
    const parsedUser = JSON.parse(JSON.stringify(userData));
    const parsedGoods = JSON.parse(JSON.stringify(goodsData));

    
    return {
        props: {
            user: parsedUser,
            goods: parsedGoods,
        }
    }
}