import Layout from '@/app/layout'
import { Formik, Field, Form, ErrorMessage, useField } from 'formik'
import * as Yup from 'yup'

type errorForm = {
    firstName?: string
    lastName?: string
    email?: string
}

const MyTextInput = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]

    // which we can spread on <input>. We can use field meta to show an error

    // message if the field is invalid and it has been touched (i.e. visited)

    const [field, meta] = useField(props)

    return (
        <div className="mt-2 ml-2">
            <label htmlFor={props.id || props.name}>{label}</label>

            <input className="ml-2" {...field} {...props} />

            {meta.touched && meta.error ? (
                <div className="text-red-700">{meta.error}</div>
            ) : null}
        </div>
    )
}

export default function SignupForm() {
    return (
        <Layout>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                }}
                validationSchema={Yup.object({
                    firstName: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .required('Required'),
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Required'),
                })}
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 2))
                }}
            >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}>
                        <MyTextInput
                            label="First name"
                            name="firstName"
                            type="text"
                            placeholder="John"
                        />
                        {/* <ErrorMessage name="firstName" /> */}

                        <MyTextInput
                            label="Last name"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                        />
                        <MyTextInput
                            label="Email"
                            name="email"
                            type="text"
                            placeholder="johndoe@example.com"
                        />
                        <button type="submit">Submit</button>
                    </form>
                )}
            </Formik>
        </Layout>
    )
}
