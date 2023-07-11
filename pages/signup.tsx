import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import Layout from '../app/layout'
import { FormInput, Select } from '@/app/components/form'
import { useAppDispatch } from '@/redux/hooks'
import { addUser } from '@/redux/actions'

export default function SignUp() {
    const { push } = useRouter()
    const dispatch = useAppDispatch()

    const login = async (user) => {
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
            dispatch(addUser(user))
            push('/')
        } else {
            console.error('Login error:', res.statusText)
        }
    }

    const handleSubmit = async (user) => {
        console.log('Values: ', user)

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })

        if (res.ok) {
            const createdUser = await res.json()
            console.log('Sign up successful, user: ', createdUser)
            await login(user)
        } else {
            console.error('Sign up error: ', res.statusText)
        }
    }

    return (
        <Layout>
            <div className="mt-6 grid place-items-center">
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        username: '',
                        password: '',
                        role: 'customer',
                    }}
                    validationSchema={Yup.object({
                        firstName: Yup.string()
                            .max(15, 'Must be 15 characters or less')
                            .min(2, 'Must be 2 characters or more')
                            .required('Required'),
                        lastName: Yup.string()
                            .max(20, 'Must be 20 characters or less')
                            .min(2, 'Must be 2 characters or more')
                            .required('Required'),
                        email: Yup.string()
                            .email('Invalid email address')
                            .required('Required'),
                        username: Yup.string()
                            .max(15, 'Must be 15 characters or less')
                            .min(3, 'Must be 3 characters or more')
                            .required('Required'),
                        password: Yup.string()
                            .max(20, 'Must be 20 characters or less')
                            .min(4, 'Must be 4 characters or more')
                            .required('Required'),
                    })}
                    onSubmit={handleSubmit}
                >
                    <Form className="content-center">
                        <h3 className="py-3 text-xl">Registration</h3>
                        <FormInput
                            label="First name:"
                            name="firstName"
                            type="text"
                        />
                        <FormInput
                            label="Last name:"
                            name="lastName"
                            type="text"
                        />
                        <FormInput label="Email:" name="email" type="email" />
                        <FormInput
                            label="Username:"
                            name="username"
                            type="text"
                        />
                        <FormInput
                            label="Password:"
                            name="password"
                            type="password"
                        />

                        <label htmlFor="role">Select your role:</label>

                        <Select id="role" name="role" multiple={false}>
                            <option value="customer">Customer</option>

                            <option value="seller">Seller</option>
                        </Select>
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
