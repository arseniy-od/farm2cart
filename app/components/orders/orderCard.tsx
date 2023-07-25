import Link from 'next/link'
import { good, order, orderGood } from '@/app/types/entities'

interface Props {
    order: order
    goods?: { [key: number]: good }
    orderGoods?: { [key: number]: orderGood }
}

export default function OrderCard({ order, goods, orderGoods }: Props) {
    return (
        <div className="ml-4 mt-4 px-4 py-3 bg-gray-100 max-w-xs shadow-lg h-full">
            <Link href={`/orders/${order.id}`}>
                <div className="text-center text-xl font-semibold hover:underline">
                    Order #{order.id}
                </div>
            </Link>
            <div>total: ₴{order.total}</div>
            <div className="mt-4">
                <div>Goods: </div>
                {order.goods.map((goodId, i) => (
                    <div key={i}>
                        <div>
                            {goods?.[goodId].quantity}x{' '}
                            <Link
                                href={`/goods/${goodId}`}
                                className="text-indigo-700"
                            >
                                {goods?.[goodId || ''].title}
                            </Link>{' '}
                            for ₴{goods?.[goodId || ''].price} each
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
