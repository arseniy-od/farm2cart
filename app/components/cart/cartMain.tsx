import Layout from '@/app/layout'
import CartGood from './cartGood'
import { cartItem, good } from '@/app/types/entities'

export default function CartMain({
    cartItems,
    goods,
    setCartGoods,
    handleDelete,
    handleSubmit,
}) {
    if (!cartItems) {
        return (
            <Layout>
                <h1 className="mt-6 text-center text-2xl">Loading...</h1>
            </Layout>
        )
    }
    if (cartItems.length === 0) {
        return (
            <Layout>
                <h1 className="mt-6 text-center text-2xl">Cart is empty</h1>
            </Layout>
        )
    }
    return (
        <Layout>
            <div>
                <h1 className="ml-4 mt-4 text-2xl">Cart</h1>
                <div>
                    <form>
                        {Object.values(cartItems).map((cartItem, i) => (
                            <div key={i}>
                                <CartGood
                                    cartItem={cartItem}
                                    good={goods[cartItem.good]}
                                    index={i}
                                    cartItems={cartItems}
                                    setCartGoods={setCartGoods}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        ))}
                        <button
                            className="mt-4 ml-4 px-6 py-3 inline-block shadow-lg hover:bg-gray-200"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
