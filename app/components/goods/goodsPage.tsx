import Layout from '@/app/layout'
import CategoryIcon from '../categories/categoryIcon'
import GoodCard from './goodCard'
import { useState } from 'react'
import { category, good } from '@/app/types/entities'
import Paginator from '../navigation/paginator'
import { fetchPaginatedGoods, setPageFilter } from '@/redux/actions'
import { GOODS_TABLE } from '@/app/constants'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import GoodTable from './goodTable'
import Spinner from '../utils/spinner'
import { pagination } from '@/redux/features/pagination/paginationReducer'

export default function GoodsPage({
    goods,
    categories,
    pagination,
}: {
    goods: good[]
    categories: { [key: string]: category }
    pagination: pagination
}) {
    const dispatch = useAppDispatch()

    const handleSearch = (e) => {
        e.preventDefault()
        const query = e.target.search.value
        dispatch(fetchPaginatedGoods(GOODS_TABLE, 1, query))
    }

    return (
        <Layout home={true} handleSearch={handleSearch}>
            <div className="mx-4 flex flex-wrap justify-center">
                {Object.values(categories)?.length ? (
                    <>
                        <CategoryIcon
                            text={categories[1]?.text}
                            imageUrl="/categories/percent.jpg"
                            link="/categories/sale"
                        />
                        <CategoryIcon
                            text={categories[2]?.text}
                            imageUrl="/categories/leaves.jpg"
                            link="/categories/organic"
                        />
                        <CategoryIcon
                            text={categories[3]?.text}
                            imageUrl="/categories/berries.jpg"
                            link="/categories/berry"
                        />
                        <CategoryIcon
                            text="Other"
                            imageUrl="/categories/ellipsis.jpg"
                            link="/categories"
                        />
                    </>
                ) : (
                    <Spinner />
                )}
            </div>
            {pagination?.fetching && <Spinner />}
            <GoodTable
                goods={goods}
                pageName={GOODS_TABLE}
                fetchAction={fetchPaginatedGoods}
            />
        </Layout>
    )
}
