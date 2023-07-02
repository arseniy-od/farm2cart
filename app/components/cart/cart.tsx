import Layout from '@/app/layout'
import CartGood from './cartGood'

export default function CartMain({
    goods,
    setCartGoods,
    handleDelete,
    handleSubmit,
}) {
    if (goods.length === 0) {
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
                        {goods.map((good, i) => (
                            <div key={i}>
                                <CartGood
                                    good={good}
                                    index={i}
                                    cartGoods={goods}
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
