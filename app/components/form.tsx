import { useField } from 'formik'

export const FormInput = ({ label, ...props }) => {
    const [field, meta] = useField(props)

    return (
        <div className="">
            <div>
                <label htmlFor={props.id || props.name}>{label}</label>
            </div>

            <input
                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                {...field}
                {...props}
            />

            {meta.touched && meta.error ? (
                <div className="text-red-700">{meta.error}</div>
            ) : null}
        </div>
    )
}

export const TextArea = ({ label, name, ...props }) => {
    const [field, meta] = useField({ ...props, name })

    return (
        <div className="">
            <div>
                <label htmlFor={props.id || props.name}>{label}</label>
            </div>

            <textarea
                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                {...field}
                {...props}
            />

            {meta.touched && meta.error ? (
                <div className="text-red-700">{meta.error}</div>
            ) : null}
        </div>
    )
}

export const FileUpload = ({ fileRef, ...props }) => {
    const [field, meta] = useField(props)
    return (
        <div>
            <label htmlFor="file">Choose file</label>{' '}
            <input ref={fileRef} multiple={false} type="file" {...field} />
            {meta.touched && meta.error ? (
                <div style={{ color: 'red' }}>{meta.error}</div>
            ) : null}
        </div>
    )
}
