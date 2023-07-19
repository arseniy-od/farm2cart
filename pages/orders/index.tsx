import { ConnectedProps, connect } from 'react-redux'
import { useEffect, useState } from 'react'

import { RootState } from '@/redux/store'
import { fetchOrders } from '@/redux/actions'
import { isEmpty } from '@/app/utils'

import Layout from '@/app/layout'
import OrderCard from '@/app/components/orders/orderCard'
import ErrorMessage from '@/app/components/errorMessage'
import { order } from '@/app/types/entities'

function MyOrders({ user, orders, goods, orderGoods, fetchOrders }: Props) {
    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])
    const [query, setQuery] = useState('')

    function goodsTitlesForOrder(order: order) {
        if (order.goods && goods) {
            return order.goods.map((goodId) => goods[goodId].title).join(' ')
        }
    }

    const filterGoods = (orders: order[]) => {
        return orders.filter((order) =>
            (order.id + ' ' + goodsTitlesForOrder(order) || '')
                .toLowerCase()
                .includes(query.toLowerCase())
        )
    }
    const filtered = filterGoods(Object.values(orders || {}))

    const handleSearch = (e) => {
        setQuery(e.target.value)
    }

    if (!orders || isEmpty(orders)) {
        return (
            <Layout>
                <ErrorMessage
                    message={orders ? 'You have no orders' : 'Loading...'}
                />
            </Layout>
        )
    }
    return (
        <Layout handleSearch={handleSearch}>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-6 mt-3 text-xl font-semibold xl:text-center xl:text-2xl">
                            Your orders:
                        </h3>

                        <div className="mx-auto flex flex-wrap justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filtered.map((order, i) => (
                                    <div key={i}>
                                        <OrderCard
                                            order={order}
                                            goods={goods}
                                            orderGoods={orderGoods}
                                        />
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

const mapState = (state: RootState) => ({
    user: state.user,
    orders: state.entities.orders,
    goods: state.entities.goods,
    orderGoods: state.entities.orderGoods,
})

const mapDispatch = {
    fetchOrders,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyOrders)
