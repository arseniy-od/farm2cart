import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Link from 'next/link'

import Layout from '@/app/layout'
import GoodCard from '@/app/components/goodCard'
import container from '@/server/container'
import { UserGoodsProps } from '@/app/interfaces'

export default function User({ user, goods }: UserGoodsProps) {
    if (user.notFound) {
        return (
            <Layout>
                <h1 className="text-2xl">User not found</h1>
            </Layout>
        )
    }
    console.log('user: ', user)
    console.log('goods: ', goods)
    return (
        <Layout>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-5 mt-3 text-xl">
                            {user.username}&apos;s products:
                        </h3>
                        {goods.map((good, i) => (
                            <div key={i}>
                                <div>
                                    <GoodCard
                                        good={good}
                                        categories={good.categories}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const props = await container
        .resolve('UserController')
        .getUserWithGoods(ctx)
    return props
}
