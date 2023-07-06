import Layout from '../app/layout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import { FormInput } from '@/app/components/form'
import * as Yup from 'yup'
import { useAppDispatch } from '@/redux/hooks'

export default function Home() {
    const { push } = useRouter()
    const dispatch = useAppDispatch()

    const handleSubmit = async (user) => {
        console.log('User:', user)
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        console.log('User: ', user)

        if (res.ok) {
            const user = await res.json()
            console.log('Login successful')
            dispatch({ type: 'user/fetch_success', payload: user })
            push('/')
        } else {
            console.error('Login error:', res.statusText)
        }
    }

    return (
        <Layout>
            <div className="mt-6 grid place-items-center">
                <h3 className="py-3 text-xl">Login</h3>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .email('Invalid email address')
                            .required('Required'),
                        password: Yup.string()
                            .max(20, 'Must be 20 characters or less')
                            .min(4, 'Must be 4 characters or more')
                            .required('Required'),
                    })}
                    onSubmit={handleSubmit}
                >
                    <Form className="content-center">
                        <FormInput
                            label="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                        />
                        <FormInput
                            label="Password:"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                        />
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
