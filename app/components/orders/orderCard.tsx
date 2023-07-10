import Link from 'next/link'
import {
    order,
    orderWithGoods,
    orderWithGoodsCreate,
} from '../../types/interfaces'

export default function OrderCard({ order, goods, orderGoods }) {
    return (
        <div className="ml-4 mt-4 px-4 py-3 bg-gray-100 max-w-xs shadow-lg">
            <Link href={`/orders/${order.id}`}>
                <div className="text-center text-xl font-semibold hover:underline">
                    Order #{order.id}
                </div>
            </Link>
            <div>total: ₴{order.total}</div>
            <div className="mt-4">
                <div>Goods: </div>
                {Object.values(order.OrderGoods).map((OrderGoodId, i) => (
                    <div key={i}>
                        <div>
                            {orderGoods[OrderGoodId].quantity}x{' '}
                            <Link
                                href={`/goods/${orderGoods[OrderGoodId].goodId}`}
                                className="text-indigo-700"
                            >
                                {goods[orderGoods[OrderGoodId].goodId].title}
                            </Link>{' '}
                            for ₴{goods[orderGoods[OrderGoodId].goodId].price}{' '}
                            each
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
