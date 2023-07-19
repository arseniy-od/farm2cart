import Layout from '@/app/layout'
import { useEffect, useState } from 'react'

import GoodCard from '@/app/components/goods/goodCard'

import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'
import { fetchMyGoods } from '@/redux/actions'
import { isEmpty } from '@/app/utils'
import ErrorMessage from '@/app/components/errorMessage'
import { good } from '@/app/types/entities'

function MyGoods({ user, goods, fetchMyGoods }: Props) {
    useEffect(() => {
        fetchMyGoods()
    }, [fetchMyGoods, user])

    const [query, setQuery] = useState('')

    const filterGoods = (goods: good[]) => {
        return goods.filter((good) =>
            (good.title + ' ' + good.description || '')
                .toLowerCase()
                .includes(query.toLowerCase())
        )
    }
    const filtered = filterGoods(Object.values(goods))

    const handleSearch = (e) => {
        setQuery(e.target.value)
    }

    if (!user || isEmpty(user)) {
        return (
            <Layout>
                <ErrorMessage message="You are not logged in" />
            </Layout>
        )
    }

    return (
        <Layout handleSearch={handleSearch}>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-6 mt-3 text-xl font-semibold xl:text-center xl:text-2xl">
                            Your products:
                        </h3>
                        <div className="mx-auto flex flex-wrap justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filtered.map((good, i) => (
                                    <div key={i}>
                                        <GoodCard good={good} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

function getGoodsForUser(state: RootState) {
    if (state.entities.goods) {
        const goods = Object.values(state.entities.goods)
        if (state.user.id) {
            return goods.filter((good) => good.seller === state.user.id)
        }
    }
    return []
}

const mapState = (state: RootState) => ({
    user: state.user,
    goods: getGoodsForUser(state),
})

const mapDispatch = {
    fetchMyGoods,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyGoods)
