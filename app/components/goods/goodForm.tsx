import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useRef } from 'react'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage, useField, FieldArray } from 'formik'
import * as Yup from 'yup'

import Layout from '@/app/layout'
import { category } from '@/app/types/interfaces'
import { useAppDispatch } from '@/redux/hooks'
import goods from '@/pages/api/goods'
import { TextArea, FormInput, FileUpload, Checkbox } from '../form'

interface IGood {
    id?: string
    title: string
    description: string
    imageUrl: string
    price: string
    categories: number[]
    file: File | null
    available: string
}

type Props = {
    good: IGood
    setGood: Dispatch<SetStateAction<IGood>>
    categories: category[]
    method: 'post' | 'put'
}

export default function GoodForm({ good, setGood, categories, method }: Props) {
    const { push } = useRouter()
    const fileRef = useRef({ files: [] })
    const dispatch = useAppDispatch()

    // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files) {
    //         const file = event.target.files[0]
    //         setGood({ ...good, file })
    //     } else {
    //         console.error('[File change] File not found')
    //     }
    // }

    // const handleCategoryChange = (event, index, arrayHelpers) => {
    //     const isChecked = event.target.checked
    //     console.log('isChecked: ', event.target)
    //     if (isChecked) {
    //         arrayHelpers.push(index, event.target.value)
    //     } else {
    //         arrayHelpers.remove(index)
    //     }
    // }

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
            const goodCategories = categories.filter((c) =>
                good.categories.includes(c.id)
            )
            dispatch({
                type: 'goods/create_good',
                payload: {
                    ...good,
                    id: response.data.id,
                    price: parseFloat(good.price),
                    available: parseInt(good.available),
                    categories: goodCategories,
                },
            })
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
            const goodCategories = categories.filter((c) =>
                good.categories.includes(c.id)
            )
            dispatch({
                type: 'goods/edit_good',
                payload: {
                    ...good,
                    price: parseFloat(good.price),
                    available: parseInt(good.available),
                    categories: goodCategories,
                },
            })
            return response.data
        } else {
            console.error(response.statusText)
        }
    }

    const handleSubmit = async (values) => {
        const good = values
        console.log('Form values', values)
        const formData = toFormData(good, method)

        if (method === 'post') {
            const goodRes = await apiPost(formData)
            push('/goods/' + goodRes.id)
        } else if (method === 'put') {
            const goodRes = await apiPut(formData)
            push('/goods/' + goodRes.id)
        } else {
            console.error(
                `Method ${method} is not implemented. Use 'post' or 'put'`
            )
        }
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
        description: Yup.string().max(255, 'Must be 255 characters or less'),
        price: Yup.number().required('Required'),
        available: Yup.number().required('Required'),
    })

    return (
        <Layout>
            <div className="mt-6 grid place-items-center">
                <Formik
                    initialValues={good}
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
                                    {categories.map((category, i) => (
                                        <label key={i}>
                                            <Field
                                                type="checkbox"
                                                name="categories"
                                                value={category.id.toString()}
                                            />
                                            {category.text}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* <div id="checkbox-group">Checked</div>
                        <div role="group" aria-labelledby="checkbox-group">
                            {['One', 'Two', 'Three'].map((check, i) => (
                                <label key={i}>
                                    <Field
                                        type="checkbox"
                                        name="checked"
                                        value={check}
                                    />
                                    {check}
                                </label>
                            ))}
                        </div> */}

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

// <div key={i}>
//     <p>
//         <label
//             htmlFor={category.id.toString()}
//         >
//             {category.text}
//         </label>
//         <input
//             type="checkbox"
//             name={category.id.toString()}
//             checked={good.categories.includes(
//                 category.id
//             )}
//             onChange={handleCategoryChange}
//         />
//     </p>
// </div>
