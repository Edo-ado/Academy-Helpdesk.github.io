import axios from 'axios';

const API_URL = 'http://localhost/Academy-Helpdesk.github.io/api/ImageController/uploadEvidence';
class ImagenList {
     uploadEvidence(formData) {
    return axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
    
}
export default new ImagenList()