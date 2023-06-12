import axios from 'axios'
import { UiFileInputButton } from '../app/components/fileInput' 


export default function IndexPage(props) {

const onChange = async (formData) => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
    // onUploadProgress: (event) => {
    //   console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
    // },
  };

  const response = await axios.post('/api/goods', formData, config);

  console.log('response', response.data);
};

return (
<UiFileInputButton label="Upload Single File" uploadFileName="theFiles" onChange={onChange}/>
);
};