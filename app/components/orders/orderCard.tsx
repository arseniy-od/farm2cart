import Link from 'next/link'
import { good, order, orderGood } from '@/app/types/entities'

interface Props {
    order: order
    goods?: { [key: number]: good }
    orderGoods?: { [key: number]: orderGood }
}

export default function OrderCard({ order, goods, orderGoods }: Props) {
    return (
        <div className="ml-4 mt-4 h-full max-w-xs bg-gray-100 px-4 py-3 shadow-lg">
            <Link href={`/orders/${order.id}`}>
                <div className="text-center text-xl font-semibold hover:underline">
                    Order #{order.id}
                </div>
            </Link>
            <div>total: ₴{order.total}</div>
            <div className="mt-4">
                <div>Goods: </div>
                {(order?.OrderGoods || []).map((OrderGoodId, i) => (
                    <div key={i}>
                        <div>
                            {orderGoods?.[OrderGoodId].quantity}x{' '}
                            <Link
                                href={`/goods/${orderGoods?.[OrderGoodId].goodId}`}
                                className="text-indigo-700"
                            >
                                {
                                    goods?.[
                                        orderGoods?.[OrderGoodId].goodId || ''
                                    ].title
                                }
                            </Link>{' '}
                            for ₴
                            {
                                goods?.[orderGoods?.[OrderGoodId].goodId || '']
                                    .price
                            }{' '}
                            each
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
