import { createRouter } from "next-connect";
import Link from 'next/link'
import axios from "axios";
import { useState } from 'react'
import { useRouter } from 'next/navigation';

import Layout from '@/app/layout'
import container from "@/server/container";


export default function Home({ categories }) {
    const { push } = useRouter();
    const [good, setGood] = useState({
        title: '',
        description: '',
        imageUrl: '',
        price: '',
        categories: [],
        file: null,
        available: '1'
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


    // const onChange = async (formData) => {
    //     const config = {
    //       headers: { 'content-type': 'multipart/form-data' },
    //     };

    // const response = await axios.post('/api/goods', formData, config);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        console.log("GOOD FILE: ", good.file)
        formData.append("file", good.file);
        formData.append("title", good.title);
        formData.append("description", good.description);
        formData.append("imageUrl", good.imageUrl);
        formData.append("price", good.price);
        formData.append("available", good.available);

        good.categories.forEach((category) => {
            formData.append("categories", category);
        });


        console.log("Good object: ", good)


        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        };

        const response = await axios.post('/api/goods', formData, config);
        console.log("Response id: ", response.data.id)
        push('/goods/' + response.data.id)
    };


    return (
        <div id="app" className="">
            <Layout>
                <div className="mt-6 grid place-items-center">
                    <form className="content-center">
                        <h3 className="text-xl">Add new product</h3>
                        <div className="mt-4">
                            <div>
                                <div>
                                    <label htmlFor="title">Title: </label>
                                </div>

                                <input type="text" id="title" value={good.title} onChange={(event) => setGood({ ...good, title: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="title" />
                            </div>
                            <div>
                                <div><label htmlFor="description">Description: </label></div>
                                
                                <input type="text" id="description" value={good.description} onChange={(event) => setGood({ ...good, description: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="description" />
                            </div>
                            <div>
                                <input type="file" name="file" onChange={handleFileChange} />
                            </div>
                            <div>
                                <div><label htmlFor="price">Price: </label></div>
                                <input type="number" min="0" step="0.05" id="price" value={good.price} onChange={(event) => setGood({ ...good, price: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="price" />
                            </div>
                            <div>
                                <div><label htmlFor="available">available: </label></div>
                                <input type="number" min="1" id="available" value={good.available} onChange={(event) => setGood({ ...good, available: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="available" />
                            </div>
                            <h3>Choose categories: </h3>
                            <div className="grid grid-cols-2">
                                
                                {categories.map((category, i) => (
                                    <div key={i}>
                                        <p>
                                            <input type="checkbox" name={category.id} checked={good.categories.includes(category.id)} onChange={handleCategoryChange} />
                                            <label htmlFor={category.id}> {category.text}</label>
                                        </p>
                                    </div>

                                ))}
                            </div>
                            
                        </div>


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
        const categories = await container.resolve("CategoryService").getCategories();
        if (!categories) {
            return { props: { notFound: true } };
        }
        return { props: { categories: JSON.parse(JSON.stringify(categories)) } };
    });


export async function getServerSideProps({ req, res }) {
    return await router.run(req, res)
}