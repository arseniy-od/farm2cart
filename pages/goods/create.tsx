import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Link from 'next/link'
import axios from "axios";
import { useState, MouseEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation';

import Layout from '@/app/layout'
import container from "@/server/container";
import {category} from '@/app/interfaces'


interface Good {
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    categories: number[];
    file: File | null;
    available: string,
    NewCategory: string;
}


export default function Home({ categories }: { categories: category[] }) {
    const { push } = useRouter();
    const [good, setGood] = useState<Good>({
        title: '',
        description: '',
        imageUrl: '',
        price: '',
        categories: [],
        file: null,
        available: '1',
        NewCategory: '',
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setGood({ ...good, file });
        } else {
            console.error("[File change] File not found")
        }
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const category = parseInt(event.target.name);
        const isChecked = event.target.checked;
        if (isChecked) {
            setGood({ ...good, categories: [...good.categories, category] });
        } else {
            setGood({ ...good, categories: good.categories.filter(c => c !== category) });
        }
    };

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        // console.log("GOOD FILE: ", good.file)
        if (!good.file) {
            console.error("[submit] File not found")
            return
        }

        formData.append("file", good.file);
        formData.append("title", good.title);
        formData.append("description", good.description);
        formData.append("imageUrl", good.imageUrl);
        formData.append("price", good.price);
        formData.append("available", good.available);
        formData.append("NewCategory", good.NewCategory);
        formData.append("active", "1")

        good.categories.forEach((category) => {
            formData.append("categories", category.toString());
        });
        // console.log("Good object: ", good)
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
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="title" required/>
                            </div>
                            <div>
                                <div><label htmlFor="description">Description: </label></div>
                                
                                <textarea id="description" value={good.description} onChange={(event) => setGood({ ...good, description: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="description" />
                            </div>
                            <div>
                                <input type="file" name="file" onChange={handleFileChange} required/>
                            </div>
                            <div>
                                <div><label htmlFor="price">Price: </label></div>
                                <input type="number" min="0" step="0.05" id="price" value={good.price} onChange={(event) => setGood({ ...good, price: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="price" required/>
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
                                            <label htmlFor={category.id.toString()}> {category.text}</label>
                                            <input type="checkbox" name={category.id.toString()} checked={good.categories.includes(category.id)} onChange={handleCategoryChange} />
                                        </p>
                                    </div>

                                ))}

                            </div>
                            <div>
                                <div>
                                    <label htmlFor="categoryNew">Create new category: </label>
                                </div>
                                <input type="text" id="categoryNew " value={good.NewCategory} onChange={(event) => setGood({ ...good, NewCategory: event.target.value })}
                                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="new category" />
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



const router = createRouter<NextApiRequest, NextApiResponse>()
    .get(async (req, res) => {
        const categories = await container.resolve("CategoryService").getCategories();
        if (!categories) {
            return { props: { notFound: true } };
        }
        return { props: { categories: JSON.parse(JSON.stringify(categories)) } };
    });


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
    return await router.run(req, res)
}