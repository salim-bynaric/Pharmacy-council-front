import axios from 'axios';

const serverPath = process.env.REACT_APP_SERVER_PROJPATH;

export default axios.create({
  baseURL: serverPath
});
