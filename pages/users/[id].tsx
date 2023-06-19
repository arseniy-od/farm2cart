import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Link from 'next/link';

import Layout from '@/app/layout';
import GoodCard from '@/app/components/goodCard';
import container from '@/server/container';
import { UserGoodsProps } from '@/app/interfaces';


export default function User({ user, goods }: UserGoodsProps) {
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
                                    <GoodCard good={good} categories={good.categories}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    : null}



            </div>
        </Layout>
        
    );
}


// export const getStaticPaths: GetStaticPaths = async () => {
//     const paths = await container.resolve("UserService").getAllUserIds()
//     return {
//         paths,
//         fallback: false
//     }
// }


// export const getStaticProps: GetStaticProps = async ({ params }) => {
//     const id = params.id
//     if (!id || id instanceof Array) { return { props: { order: {notFound: true }} } }

//     const userData = await container.resolve("UserService").findUserById(id);
//     const goodsData = await container.resolve("GoodService").getGoodsForUser(id);
//     const parsedUser = JSON.parse(JSON.stringify(userData));
//     const parsedGoods = JSON.parse(JSON.stringify(goodsData));

    
//     return {
//         props: {
//             user: parsedUser,
//             goods: parsedGoods,
//         }
//     }
// }


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    if (!id || id instanceof Array) { return { props: { user: {notFound: true }} } }
    
    const userData = await container.resolve("UserService").findUserById(id);
    const goodsData = await container.resolve("GoodService").getGoodsBySellerId(id);
    const parsedUser = JSON.parse(JSON.stringify(userData));
    const parsedGoods = JSON.parse(JSON.stringify(goodsData));
    return {
        props: {
            user: parsedUser,
            goods: parsedGoods,
        }
    }
}