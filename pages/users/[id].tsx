import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Link from 'next/link'

import Layout from '@/app/layout'
import GoodCard from '@/app/components/goods/goodCard'
import container from '@/server/container'
import { ContextDynamicRoute } from '@/app/types/interfaces'
import { normalize } from 'normalizr'
import { goodsSchema, userSchema } from '@/redux/normalSchemas'
import { RootState, wrapper } from '@/redux/store'
import { updateEntities } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'

function User(props: Props) {
    const user = props.user
    const goods = props.goods
    if (!user || props.error) {
        return (
            <Layout>
                <h1 className="text-2xl">User not found</h1>
            </Layout>
        )
    }
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
                                    <GoodCard good={good} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

function getGoodsForUser(state: RootState, userId) {
    if (state.entities.goods) {
        const goods = Object.values(state.entities.goods)
        return goods.filter((good) => good.seller === userId)
    }
    return []
}

const mapState = (state: RootState, ownProps) => ({
    user: state.entities.users?.[ownProps.id],
    goods: getGoodsForUser(state, ownProps.id),
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number; error?: boolean; message?: string }

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/users/:id'
        const res = await container.resolve('UserController').run(ctx)
        if (res.props?.error) {
            return { props: res.props }
        }
        const user = res.props?.data.user
        const goods = res.props?.data.goods
        const normUser = normalize(user, userSchema)
        const normGoods = normalize(goods, goodsSchema)
        store.dispatch(updateEntities(normUser))
        store.dispatch(updateEntities(normGoods))
        return { props: { error: false, message: '', id: user.id } }
    }
)

export default connector(User)
