import { useState, useEffect, useCallback, ChangeEvent, Dispatch, SetStateAction } from "react";
import { good } from "../interfaces";


type cartGoodProps = {
    good: good, 
    index: number, 
    cartGoods: (good & {quantity: number})[], 
    setCartGoods: Dispatch<SetStateAction<(good & {quantity: number;})[]>>
    handleDelete: (index: number, id: number) => Promise<void>
}

export default function CartGood({ good, index, cartGoods, setCartGoods, handleDelete }: cartGoodProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        let items = [...cartGoods];
        let item = { ...items[index] };
        item.quantity = parseInt(event.target.value);
        items[index] = item;
        setCartGoods(items);
    }

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
                    type="button" onClick={() => handleDelete(index, good.id)}>Delete</button>
            </div>
        </div>
    );
}


