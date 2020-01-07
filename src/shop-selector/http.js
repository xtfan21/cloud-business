import axios from 'axios';

axios.interceptors.request.use(config => {

	const { headers } = config;

	let credential = localStorage.ccmsRequestCredential;

	credential = credential ? JSON.parse(credential).id : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6InFpdXNoaTYiLCJ1c2VySWQiOjEwNjUxMzg3LCJ1c2VyVHlwZSI6ImJ1aWxkLWluIiwidXNlck5hbWUiOiJmeHQiLCJleHQiOjE1Nzc5NzQ5ODAwOTIsImlhdCI6MTU3NzkzMTc4MDA5Mn0.JR1M3sS0yKkwPvq7G0fE0m5tpzBhj0pH3ubCmOMALiM';

	headers['X-TOKEN'] = credential;
	headers.appCode = 'ucenter';
	headers.appSecret = 'ZgmAGruhNL1ieDQuBCpAPpVCzm6obLP69wkoODkzt7E=';


	return config;

});

export default axios;
