import Link from 'next/link'
import Layout from '@/app/layout'
import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function Home() {
    const { push } = useRouter();
    const [good, setGood] = useState({
        title: '',
        description: '',
        imageUrl: '',
        price: null,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        

        const res = await fetch('/api/goods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(good)
        });

        if (res.ok) {
            const user = await res.json();
            console.log("Good creation ok")
            push('/')
        } else {
            console.log("Good creation not ok")
        }
    };


    return (
        <div id="app" className="">
            <Layout>
                <div className="mt-6">
                    <form className="text-center">
                        <h3 className="text-xl">Add new product</h3>
                        <div>
                        <label for="title">Title: </label>
                            <input type="text" id="title" value={good.title} onChange={(event) => setGood({ ...good, title: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="title" />
                        </div>
                        <div>
                        <label for="description">Description: </label>
                            <input type="text" id="description" value={good.description} onChange={(event) => setGood({ ...good, description: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="description" />
                        </div>
                        <div>
                        <label for="image">Image URL: </label>
                            <input type="text" id="image" value={good.imageUrl} onChange={(event) => setGood({ ...good, imageUrl: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="imageUrl" />
                        </div>
                        <div>
                            <label for="price">Price: </label>
                            <input type="number" step="0.01" id="price" value={good.price} onChange={(event) => setGood({ ...good, price: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="price" />
                        </div>
                        {/* <div>
                            <label for="categories">Categories </label>
                            <input type="number" step="0.01" id="categories" value={good.Categories} onChange={(event) => setGood({ ...good, categories: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="categories" />
                        </div> */}
                        <button
                            onClick={handleSubmit}
                            type="submit" className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2">Submit</button>
                    </form>
                </div>
            </Layout>
        </div>
    );
}