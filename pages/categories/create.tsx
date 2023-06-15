import { useState } from "react";
import axios from "axios";

import Layout from "@/app/layout";


export default function CategoryCreate() {
    const [text, setText] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(text)
        const config = {
            headers: { 'content-type': 'application/json' },
        };

        const response = await axios.post('/api/categories', { text }, config);
        return await response.json()
    }

    return (
        <Layout>
            <div>
                <label htmlFor="category">Category: </label>
                <input type="text" id="category" value={text} onChange={(event) => setText(event.target.value)}
                    className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="category name" />
            </div>
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </Layout>
    );
}