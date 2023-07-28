import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { normalize } from 'normalizr'

import container, { di } from '@/server/container'
import { RootState } from '@/redux/store'
import Layout from '@/app/layout'

import { fetchPaginatedGoodsForCategory, updateEntities } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'
import { clientDi } from '@/redux/container'

import initServerStore from '@/server/initServerStore'
import GoodTable from '@/app/components/goods/goodTable'
import { CATEGORY_GOODS_TABLE } from '@/app/constants'
import { useAppDispatch } from '@/redux/hooks'
import { getGoodsPage } from '@/app/utils'

function Category({ goods, category }: PropsFromRedux) {
    const dispatch = useAppDispatch()
    if (!category) {
        return (
            <Layout>
                <div>Category not found</div>
            </Layout>
        )
    }

    const handleChange = (e) => {
        e.preventDefault()
        const query = e.target.search.value
        if (category.text) {
            dispatch(
                fetchPaginatedGoodsForCategory(
                    { categorySlug: category.text.toLowerCase() },
                    CATEGORY_GOODS_TABLE,
                    1,
                    query
                )
            )
        }
    }

    return (
        <Layout handleSearch={handleChange}>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                <GoodTable
                    goods={goods}
                    pageName={CATEGORY_GOODS_TABLE}
                    fetchAction={fetchPaginatedGoodsForCategory}
                    categoryName={category.text?.toLowerCase()}
                />
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

// function getGoodsByCategory(state: RootState, category) {
//     if (state.entities.goods) {
//         console.log('front category: ', category)
//         return Object.values(state.entities.goods).filter((good) =>
//             category.goods.includes(good.id || 0)
//         )
//     }
//     return []
// }

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
    goods: getGoodsPage(state, CATEGORY_GOODS_TABLE),
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>

export async function getStaticPaths() {
    return await container.resolve('CategoryController').getStaticPaths()
}

export const getStaticProps: GetStaticProps = clientDi(
    'redux'
).wrapper.getStaticProps(
    initServerStore(
        [di('CategoryController'), di('GoodController')],
        '/categories/:slug'
    )
)

export default connector(Category)
