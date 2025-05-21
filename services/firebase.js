
// firebase.js
import axios from 'axios';

const BASE_URL = 'https://myfinanceapp-ccb96-default-rtdb.firebaseio.com';

const firebase = axios.create({
  baseURL: BASE_URL,
});

export default firebase;
