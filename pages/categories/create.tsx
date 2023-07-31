import { useState, MouseEvent } from 'react'
import axios from 'axios'

import Layout from '@/app/layout'

// categories are static, so without redux
export default function CategoryCreate() {
    const [text, setText] = useState('')

    async function handleSubmit(
        event: MouseEvent<HTMLButtonElement>
    ): Promise<object> {
        event.preventDefault()
        const config = {
            headers: { 'content-type': 'application/json' },
        }

        const response = await axios.post('/api/categories', { text }, config)
        return await response.data.json()
    }

    return (
        <Layout>
            <h3 className="ml-4 mt-4 text-xl">Create new category:</h3>
            <div>
                <input
                    type="text"
                    id="category"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="ml-4 mt-2 w-full max-w-xs border-2 px-4 py-3"
                    placeholder="Category name"
                />
            </div>
            <button
                className="btn-submit ml-4"
                type="submit"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </Layout>
    )
}
