import Layout from "../layout";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function GoodCard({ good, categories }) {

    const [inCart, setInCart] = useState(false)

    const isInCart = async () => {
        const cart = await fetch('/api/cart')
        const cartContent = await cart.json()
        if (!cartContent.blank) {
            let isFound = false
            for (let product of cartContent) {
                if (product.goodId === good.id) {
                    isFound = true
                }
            }
            setInCart(isFound)
        }
    }

    isInCart()


    async function handleAddCart(event) {
        console.log("Before post request")
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goodId: good.id })
        });

    

        if (res.ok) {
            setInCart(true)
            const cartRes = await res.json();
            console.log("Good added to cart")
        } else {
            console.log("Problem while adding good to cart")
        }
    }

    function Category() {
        return (
            <div>
                {categories.map((category, i) => (
                    <Link href={"/categories/" + category.text.toLowerCase()} className="inline-block px-1 text-indigo-500" key={i}>{category.text}</Link>))}
            </div>
        );
    }

    return (
        <div className="mt-4 mx-3">
            <div className="px-4 py-2 max-w-xs w-full text-lg  text-center justify-center bg-gray-100 rounded-lg border-2">
                <div className='rounded-lg overflow-hidden shadow-lg'>
                    <div className="flex items-center justify-center w-72 h-72 object-cover object-center overflow-hidden">
                        <Image src={good.imageUrl} alt={good.title + " photo"} width="1024" height="1024" className="" />
                    </div>
                    <div className='px-2 py-2 bg-gray-100'>
                        <h3 className="text-xl font-semibold">{good.title}</h3>
                        {good.averageScore
                            ? <div>Rating: {good.averageScore}</div>
                            : null}

                        <p>{good.description}</p>
                        <Link href={"/users/" + good.seller.id} className="text-gray-700">Seller: {good.seller.username}</Link>
                        <div className="text-gray-700">₴ {good.price}</div>
                        <Link href={'/goods/' + good.id} className="px-6 py-4 inline-block bg-gray-200 rounded-lg shadow-lg hover:bg-gray-400">Product page</Link>
                        {inCart
                            ? <div>Added to cart</div>
                            : <button onClick={handleAddCart}>Add to cart</button>}

                    </div>
                </div>


                {categories && categories.length ? <Category good={good} /> : null}

            </div>

        </div>
    );
}