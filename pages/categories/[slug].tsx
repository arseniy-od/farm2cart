import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { RootState, wrapper } from '@/redux/store'
import Layout from '@/app/layout'
import GoodCard from '@/app/components/goods/goodCard'
import { ContextDynamicRoute, category, good } from '@/app/types/interfaces'
import { IGoodModel } from '@/app/types/interfaces'
import { categorySchema, goodsSchema } from '@/redux/normalSchemas'
import { updateEntities } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'
import clientContainer from '@/redux/container'

function Category({ goods, category }: PropsFromRedux) {
    if (!category) {
        return (
            <Layout>
                <div>Category not found</div>
            </Layout>
        )
    }
    return (
        <Layout>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                {goods.map((good, i) => (
                    <div key={i}>
                        <GoodCard good={good} />
                    </div>
                ))}
                <div>
                    <Link
                        href="/categories"
                        className="ml-4 mt-4 px-6 py-3 inline-block font-semibold shadow-lg"
                    >
                        Go to categories
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

function getGoodsByIds(state: RootState, goodIds: number[]) {
    if (state.entities.goods) {
        return Object.values(state.entities.goods).filter((good) =>
            goodIds.includes(good.id)
        )
    }
    return []
}

const mapState = (state: RootState, ownProps) => ({
    category: state.entities.categories?.[ownProps.id],
    goods: getGoodsByIds(state, ownProps.goodIds),
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>

export async function getStaticPaths() {
    return await container.resolve('CategoryController').getStaticPaths()
}

export const getStaticProps: GetStaticProps = clientContainer
    .resolve('redux')
    .wrapper.getStaticProps((store) => async (ctx) => {
        const { props } = await container
            .resolve('CategoryController')
            .getCategoryWithGoods(ctx)

        const category = props.data?.category
        const goods = props.data?.goods
        const normCategory = normalize(category, categorySchema)
        const normGoods = normalize(goods, goodsSchema)
        const goodIds = normCategory.entities.categories?.[category.id].goods

        store.dispatch(updateEntities(normGoods))

        return { props: { id: category.id, goodIds } }
    })

export default connector(Category)
