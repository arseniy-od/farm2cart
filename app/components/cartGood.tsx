import { useState, useEffect, useCallback } from "react";


export default function CartGood({ good, index, cartGoods, setCartGoods }) {
    const [isDeleted, setIsDeleted] = useState(false)

    const handleDelete = useCallback(async () => {
        console.log("DELETE")
        try {
            const res = await fetch(`/api/cart?index=${index}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                // query: JSON.stringify(index)
            });
            if (res.ok) {
                const deleted = await res.json();
                setIsDeleted(true)
                console.log("Good deleted");
            } else {
                console.log("Good not deleted")
            }
        } catch (e) {
            console.error("ERR: ", e)
        }
    }, [index])

    function handleChange(event) {
        let items = [...cartGoods];
        let item = { ...items[index] };
        item.quantity = parseInt(event.target.value);
        items[index] = item;
        setCartGoods(items);
    }
    if (isDeleted) {
        return null
    } else {
        return (
            <div className="ml-4 mt-4 px-4 py-3 max-w-md bg-gray-200 shadow-lg rounded-lg">
                <div>
                    Title: {good.title}
                </div>
                <div>
                    Price: {good.price}
                </div>
                <div>
                    Total: {good.price * cartGoods[index].quantity}
                </div>
                <div className="flex w-32 justify-between">
                    <label htmlFor="quantity" className="w-full">
                        Quantity: 
                    </label>
            
                    <input className="block w-10 bg-gray-200"
                    type="number" id="quantity" min="1" max={good.available} value={cartGoods[index].quantity}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button className="mt-2 px-4 py-2 block bg-red-500 hover:bg-red-700 rounded-lg text-white shadow-lg"
                    type="button" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        );
    }
    

}