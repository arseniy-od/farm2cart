import Layout from '@/app/layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type errorForm = {
    firstName?: string
    lastName?: string
    email?: string
}

export default function SignupForm() {
    const validate = (values): errorForm => {
        const errors: errorForm = {}
        if (!values.firstName) {
            errors.firstName = 'Required'
        } else if (values.firstName.length > 15) {
            errors.firstName = 'Must be 15 characters or less'
        }

        if (!values.lastName) {
            errors.lastName = 'Required'
        } else if (values.lastName.length > 20) {
            errors.lastName = 'Must be 20 characters or less'
        }

        if (!values.email) {
            errors.email = 'Required'
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address'
        }

        return errors
    }

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            lastName: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
        }),
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    return (
        <Layout>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name</label>

                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="text-red-800">
                            {formik.errors.firstName}
                        </div>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>

                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="text-red-800">
                            {formik.errors.lastName}
                        </div>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-800">
                            {formik.errors.email}
                        </div>
                    ) : null}
                </div>
                <button type="submit">Submit</button>
            </form>
        </Layout>
    )
}
