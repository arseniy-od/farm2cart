import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { RootState } from '@/redux/store'
import Layout from '@/app/layout'
import GoodCard from '@/app/components/goods/goodCard'

import { categorySchema, goodsSchema } from '@/redux/normalSchemas'
import { updateEntities } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'
import clientContainer from '@/redux/container'
import { normalizeResponse } from '@/app/normalizeResponse'
import { useState } from 'react'
import { good } from '@/app/types/entities'

function Category({ goods, category }: PropsFromRedux) {
    const [query, setQuery] = useState('')
    if (!category) {
        return (
            <Layout>
                <div>Category not found</div>
            </Layout>
        )
    }

    const filterGoods = (goods: good[]) => {
        return goods.filter((good) =>
            (good.title + ' ' + good.description || '')
                .toLowerCase()
                .includes(query.toLowerCase())
        )
    }

    const filtered = filterGoods(Object.values(goods || {}))

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    return (
        <Layout handleSearch={handleChange}>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                <div className="mx-auto flex flex-wrap justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filtered.map((good, i) => (
                            <div key={i}>
                                <GoodCard good={good} />
                            </div>
                        ))}
                    </div>
                </div>
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
            goodIds.includes(good.id || 0)
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
        const normCategory = normalizeResponse(category, categorySchema)
        const normGoods = normalizeResponse(goods, goodsSchema)
        const goodIds = normCategory.entities.categories?.[category.id].goods

        store.dispatch(updateEntities(normGoods))

        return { props: { id: category.id, goodIds } }
    })

export default connector(Category)
