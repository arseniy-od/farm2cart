import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import * as cheerio from 'cheerio'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function MyComponent() {
    const [value, setValue] = useState('')
    const [purified, setPurified] = useState('')

    function handleSave() {
        const purifiedValue = DOMPurify.sanitize(value)
        const $ = cheerio.load(purifiedValue)
        $('ul').addClass('ml-6 list-disc')
        $('ol').addClass('ml-6 list-decimal')
        $('h1').addClass('text-2xl')
        $('h2').addClass('text-xl')
        $('h3').addClass('text-lg')

        setPurified($.html())
    }

    return (
        <div className="ml-4 mt-5 text-gray-900">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                className="w-1/3"
            />
            <button className="btn-submit" onClick={handleSave}>
                Save
            </button>
            <div dangerouslySetInnerHTML={{ __html: purified }} />
        </div>
    )
}
