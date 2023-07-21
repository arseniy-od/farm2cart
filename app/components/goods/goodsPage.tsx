import Layout from '@/app/layout'
import CategoryIcon from '../categories/categoryIcon'
import GoodCard from './goodCard'
import { useState } from 'react'
import { good } from '@/app/types/entities'
import Paginator from '../paginator'
import { useAppSelector } from '@/redux/hooks'

export default function GoodsPage({ categories, goods }) {
    const [query, setQuery] = useState('')

    const filterGoods = (goods: good[]) => {
        return goods.filter((good) =>
            (good.title + ' ' + good.description || '')
                .toLowerCase()
                .includes(query.toLowerCase())
        )
    }
    const filtered = filterGoods(Object.values(goods))

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    return (
        <Layout home={true} handleSearch={handleChange}>
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
                    <div>Loading...</div>
                )}
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
            <Paginator pageName="GoodsTable" />
        </Layout>
    )
}
