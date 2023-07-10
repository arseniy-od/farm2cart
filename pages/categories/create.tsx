import { useState, MouseEvent } from 'react'
import axios from 'axios'

import Layout from '@/app/layout'
import { category } from '@/app/types/interfaces'

// not used now (categories are static)
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
            <div>
                <label htmlFor="category">Category: </label>
                <input
                    type="text"
                    id="category"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                    placeholder="category name"
                />
            </div>
            <button type="submit" onClick={handleSubmit}>
                Submit
            </button>
        </Layout>
    )
}
