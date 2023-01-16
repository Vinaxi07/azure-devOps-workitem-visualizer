import axios from 'axios';
import ora from 'ora';
import { azureConfig } from '../config/index.js';
import { validateResp } from './helperFuns.js';

//Start terinal spinner
const spinner = ora('Fetching Data');

const { authHeader, apiUrl } = azureConfig;
const axiosWithAuth = axios.create({
    baseURL: apiUrl,
    headers: {
        Authorization: authHeader,
    }
});

axiosWithAuth.defaults.headers.post['Content-Type'] = 'application/json-patch+json';

const preRequest = (resp) => {
    spinner.start();
    return resp;
}
const postRequestOrError = (respOrError) => {
    spinner.stop();
    // console.log({respOrError});
    validateResp(respOrError)
    return respOrError
}

axiosWithAuth.interceptors.request.use(preRequest, postRequestOrError);

axiosWithAuth.interceptors.response.use(postRequestOrError, postRequestOrError);


export default axiosWithAuth

