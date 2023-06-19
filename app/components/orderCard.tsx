import Link from "next/link";
import { order, orderWithGoods, orderWithGoodsCreate } from "../interfaces";

export default function OrderCard({ order }: {order: orderWithGoods}) {
    return (
        <div className="ml-4 mt-4 px-4 py-3 bg-gray-200 max-w-xs rounded-lg shadow-lg">
            <div className="text-center text-xl">Order #{order.id}</div>
            <div>total: ₴{order.total}</div>
            <div className="mt-4">
                <div>Goods: </div>
                {order.goods.map((good, i) => (
                    <div key={i}>
                        <div>
                            {good.OrderGood.quantity}x <Link href={`/goods/${good.id}`} className="text-indigo-700">{good.title}</Link> for ₴{good.price} each
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}



