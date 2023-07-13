import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useRef } from 'react'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage, useField, FieldArray } from 'formik'
import * as Yup from 'yup'

import Layout from '@/app/layout'
import { useAppDispatch } from '@/redux/hooks'
import goods from '@/pages/api/goods'
import { TextArea, FormInput, FileUpload, Checkbox } from '../form'
import { category, good } from '@/app/types/entities'
import { addGood } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'
import { normalize } from 'normalizr'
import { goodSchema } from '@/redux/normalSchemas'

function GoodForm({ good, categories, method, addGood }: Props) {
    const { push } = useRouter()
    const fileRef = useRef({ files: [] })
    const initialCategories = good.categories.map((id) => id.toString())

    function toFormData(good, method) {
        const formData = new FormData()
        const file = fileRef.current?.files[0]
        if (!file) {
            console.log('[submit] File not found')
        } else {
            console.log('File found: ', file)
            formData.append('file', file)
        }

        if (method === 'put' && good.id) {
            formData.append('id', good.id)
        }
        formData.append('title', good.title)
        formData.append('description', good.description)
        formData.append('imageUrl', good.imageUrl)
        formData.append('price', good.price)
        formData.append('available', good.available)
        formData.append('active', '1')

        good.categories.forEach((category) => {
            formData.append('categories', category)
        })
        console.log('formData:', formData)
        return formData
    }

    async function apiPost(formData) {
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        }
        const response = await axios.post('/api/goods', formData, config)
        if (response.status === 200) {
            return response.data
        } else {
            console.error(response.statusText)
        }
    }

    async function apiPut(formData) {
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        }
        const response = await axios.put('/api/goods', formData, config)
        if (response.status === 200) {
            return response.data
        } else {
            console.error(response.statusText)
        }
    }

    const handleSubmit = async (values) => {
        const formData = toFormData(values, method)
        values.categories = values.categories.map((id) => parseInt(id))
        let goodRes: good | null = null
        if (method === 'post') {
            goodRes = await apiPost(formData)
            const normGood = normalize(goodRes, goodSchema)
            addGood(normGood)
        } else if (method === 'put') {
            goodRes = await apiPut(formData)
            const normGood = normalize(goodRes, goodSchema)
            addGood(normGood)
        } else {
            throw new Error(
                `Method ${method} is not implemented. Use 'post' or 'put'`
            )
        }
        if (goodRes?.id) {
            push('/goods/' + goodRes.id)
        }
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
        description: Yup.string().max(255, 'Must be 255 characters or less'),
        price: Yup.number()
            .min(0, 'Price cant be negative')
            .required('Required'),
        available: Yup.number().required('Required'),
    })

    return (
        <Layout>
            <div className="mt-6 grid place-items-center">
                <Formik
                    initialValues={{ ...good, categories: initialCategories }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form
                        method={method}
                        encType="multipart/form-data"
                        className="content-center"
                    >
                        <h3 className="text-xl">
                            {method === 'post'
                                ? 'Add new product'
                                : 'Edit your product'}
                        </h3>
                        <div className="mt-4">
                            <FormInput
                                label="Title:"
                                name="title"
                                type="text"
                                placeholder="Product title"
                            />
                            <TextArea
                                label="Description:"
                                name="description"
                                placeholder="Product description"
                            />

                            <FileUpload name="file" fileRef={fileRef} />

                            <FormInput
                                label="Price:"
                                type="number"
                                name="price"
                                min="0"
                                step="0.05"
                                placeholder="0"
                            />
                            <FormInput
                                label="Available:"
                                type="number"
                                name="available"
                                min="1"
                            />

                            <div>
                                <div id="checkbox-group">Choose categories</div>
                                <div
                                    className="grid grid-cols-2"
                                    role="group"
                                    aria-labelledby="checkbox-group"
                                >
                                    {Object.values(categories || {}).map(
                                        (category, i) => (
                                            <label key={i}>
                                                <Field
                                                    type="checkbox"
                                                    name="categories"
                                                    value={category.id.toString()}
                                                />
                                                {category.text}
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2"
                        >
                            Submit
                        </button>
                    </Form>
                </Formik>
            </div>
        </Layout>
    )
}

const mapDispatch = {
    addGood,
}

const connector = connect(null, mapDispatch)
type Props = ConnectedProps<typeof connector> & {
    good: good & {
        categories: number[] | string[]
        file?: File | null
    }
    categories?: { [key: number]: category }
    method: 'post' | 'put'
}

export default connector(GoodForm)
