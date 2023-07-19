import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useRef } from 'react'

import { Formik, Field, Form, ErrorMessage, useField, FieldArray } from 'formik'
import * as Yup from 'yup'

import Layout from '@/app/layout'
import { TextArea, FormInput, FileUpload, Checkbox } from '../form'
import { category, good } from '@/app/types/entities'
import { createGood, updateGood } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'

import { RootState } from '@/redux/store'

function GoodForm({ good, categories, method, createGood, updateGood }: Props) {
    const fileRef = useRef({ files: [] })
    let initialCategories: string[] = []
    if (good.categories) {
        initialCategories = good.categories.map((id) => id.toString())
    }

    const handleSubmit = async (values) => {
        const file = fileRef.current?.files[0]
        values.file = file
        values.categories = values.categories.map((id) => parseInt(id))
        let goodRes: good | null = null
        if (method === 'post') {
            console.log('Create good dispatch')
            createGood(values)
        } else if (method === 'put') {
            updateGood(values)
        } else {
            throw new Error(
                `Method ${method} is not implemented. Use 'post' or 'put'`
            )
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
                                                    value={
                                                        category.id
                                                            ? category.id.toString()
                                                            : ''
                                                    }
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

const mapState = (state: RootState) => ({
    categories: state.entities.categories,
})

const mapDispatch = {
    createGood,
    updateGood,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector> & {
    good: good & {
        categories?: string[]
        file?: File | null
    }
    categories?: { [key: number]: category }
    method: 'post' | 'put'
}

export default connector(GoodForm)
