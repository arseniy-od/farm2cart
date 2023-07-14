import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useAppDispatch } from '@/redux/hooks'

import { FormInput } from '@/app/components/form'
import Layout from '../app/layout'
import { addUser, loginUser } from '@/redux/actions'

export default function Home() {
    const dispatch = useAppDispatch()

    const handleSubmit = async (user) => {
        dispatch(loginUser(user))
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
