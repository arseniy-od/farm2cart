import { useRef } from "react";


export interface IProps {
    acceptedFileTypes?: string;
    allowMultipleFiles?: boolean;
    label: string;
    onChange: (formData: FormData) => void;
    uploadFileName: string;
  }
  
export const UiFileInputButton: React.FC<IProps> = (props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const onClickHandler = () => {
        fileInputRef.current?.click();
    };

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) {
        return;
        }

        const formData = new FormData();

        Array.from(event.target.files).forEach((file) => {
        formData.append(event.target.name, file);
        });

        props.onChange(formData);

        formRef.current?.reset();
    };

    return (
        <form ref={formRef}>
        <button type="button" onClick={onClickHandler}>
            {props.label}
        </button>
        <input
            accept={props.acceptedFileTypes}
            multiple={props.allowMultipleFiles}
            name={props.uploadFileName}
            onChange={onChangeHandler}
            ref={fileInputRef}
            style={{ display: 'none' }}
            type="file"
        />
        <input type="text" id="test" />
        </form>
    );
};

UiFileInputButton.defaultProps = {
acceptedFileTypes: '',
allowMultipleFiles: false,
};