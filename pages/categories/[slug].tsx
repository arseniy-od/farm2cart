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
import initServerStore from '@/server/initServerStore'

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

function getGoodsByCategory(state: RootState, category) {
    if (state.entities.goods) {
        console.log('front category: ', category)
        return Object.values(state.entities.goods).filter((good) =>
            category.goods.includes(good.id || 0)
        )
    }
    return []
}

function getCategory(state: RootState, slug: string) {
    const category = Object.values(state.entities.categories || {}).find(
        (category) => category.text?.toLowerCase() === slug
    )
    console.log('getCategory slug: ', slug)
    console.log('getCategory: ', category)
    return category
}

const mapState = (state: RootState, ownProps) => ({
    category: getCategory(state, ownProps.params.slug),
    goods: getGoodsByCategory(state, getCategory(state, ownProps.params.slug)),
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>

export async function getStaticPaths() {
    return await container.resolve('CategoryController').getStaticPaths()
}

export const getStaticProps: GetStaticProps = clientContainer
    .resolve('redux')
    .wrapper.getStaticProps(
        initServerStore(
            container.resolve('CategoryController'),
            '/categories/:slug'
        )
    )

export default connector(Category)
