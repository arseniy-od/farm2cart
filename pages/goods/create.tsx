import { createRouter } from "next-connect";
import Link from 'next/link'

import { useState } from 'react'
import { useRouter } from 'next/navigation';

import Layout from '@/app/layout'
import { getAllCategorySlugs, getCategories } from "@/services/category";

export default function Home({ categories }) {
    const { push } = useRouter();
    const [good, setGood] = useState({
        title: '',
        description: '',
        imageUrl: '',
        price: '',
        categories: [],
        file: null,
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setGood({ ...good, file });
    };

    const handleCategoryChange = (event) => {
        const category = parseInt(event.target.name);
        const isChecked = event.target.checked;
        if (isChecked) {
            setGood({ ...good, categories: [...good.categories, category] });
        } else {
            setGood({ ...good, categories: good.categories.filter(c => c !== category) });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", good.file);
        formData.append("title", good.title);
        formData.append("description", good.description);
        formData.append("imageUrl", good.imageUrl);
        formData.append("price", good.price);

        good.categories.forEach((category) => {
            formData.append("categories", category);
        });


        console.log("Good object: ", good)


        const res = await fetch('/api/goods', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: good,
        });

        if (res.ok) {
            const good = await res.json();
            console.log("Good creation ok")
            push('/goods/' + good.id)
        } else {
            console.log("Good creation not ok", res.statusText)
        }
    };


    return (
        <div id="app" className="">
            <Layout>
                <div className="mt-6">
                    <form className="text-center">
                        <h3 className="text-xl">Add new product</h3>
                        <div>
                            <label htmlFor="title">Title: </label>
                            <input type="text" id="title" value={good.title} onChange={(event) => setGood({ ...good, title: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="title" />
                        </div>
                        <div>
                            <label htmlFor="description">Description: </label>
                            <input type="text" id="description" value={good.description} onChange={(event) => setGood({ ...good, description: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="description" />
                        </div>
                        <div>
                            <label htmlFor="file">File: </label>
                            <input type="file" id="file" name="file" onChange={handleFileChange} className="mt-2" />
                        </div>
                        <div>
                            <label htmlFor="price">Price: </label>
                            <input type="number" step="0.01" id="price" value={good.price} onChange={(event) => setGood({ ...good, price: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="price" />
                        </div>

                        {categories.map((category, i) => (
                            <div key={i}>
                                <p>
                                    <input type="checkbox" name={category.id} checked={good.categories.includes(category.id)} onChange={handleCategoryChange} />
                                    <label htmlFor={category.id}>{category.text}</label>
                                </p>
                            </div>

                        ))}

                        <button
                            onClick={handleSubmit}
                            type="submit" className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2">Submit</button>
                    </form>
                </div>
            </Layout>
        </div>
    );
}



const router = createRouter()
    .get(async (req, res) => {
        const categories = await getCategories();
        if (!categories) {
            return { props: { notFound: true } };
        }
        return { props: { categories: JSON.parse(JSON.stringify(categories)) } };
    });


export async function getServerSideProps({ req, res }) {
    return await router.run(req, res);
}