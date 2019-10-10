/**
 * http.js
 * @author wangbo
 * @since 2019/10/10
 */
import axios from 'axios';

axios.interceptors.request.use(config => {

    const { headers } = config;

    let credential = localStorage.ccmsRequestCredential;
    credential = credential ? JSON.parse(credential).id : 'error token';

    headers['X-TOKEN'] = credential;
    headers.appCode = 'ucenter';
    headers.appSecret = 'ZgmAGruhNL1ieDQuBCpAPpVCzm6obLP69wkoODkzt7E=';


    return config;

});

export default axios;
