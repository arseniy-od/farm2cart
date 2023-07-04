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
        <div className="flex items-center justify-center w-full">
            <label
                htmlFor="file"
                // className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
                {/* <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div> */}
            </label>
            <input
                ref={fileRef}
                multiple={false}
                type="file"
                id="file"
                // className="hidden"
                {...field}
            />
        </div>
    )
}

// <div>
//     <div>
//         <label htmlFor="file">Upload file:</label>{' '}
//     </div>
//     <input
//         className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none"
//         ref={fileRef}
//         multiple={false}
//         type="file"
//         {...field}
//     />
//     {meta.touched && meta.error ? (
//         <div style={{ color: 'red' }}>{meta.error}</div>
//     ) : null}
// </div>
