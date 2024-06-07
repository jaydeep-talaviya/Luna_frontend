import axios from 'axios';
import regeneratorRuntime from "regenerator-runtime";

const baseURL = process.env.REACT_APP_BASE_URL;;
// const baseURL = 'https://lunablog.herokuapp.com/api';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 2000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? 'JWT ' + localStorage.getItem('access_token')
			: null,
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}, 
});
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + '/token/refresh/'
		) {
			window.location.href = '/login/';
			localStorage.removeItem('user_id')
			localStorage.removeItem('islogin')
			localStorage.removeItem('refresh_token')
			localStorage.removeItem('access_token')

			return Promise.reject(error);
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh_token');
			if (refreshToken) {
				const tokenParts = JSON.parse(window.atob(refreshToken.split('.')[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);

				if (tokenParts.exp > now) {
					return axiosInstance
						.post('/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							localStorage.setItem('access_token', response.data.access);
							// localStorage.setItem('refresh_token', response.data.refresh);

							axiosInstance.defaults.headers['Authorization'] =
								'JWT ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'JWT ' + response.data.access;

							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					localStorage.removeItem('user_id')
					localStorage.removeItem('islogin')
					localStorage.removeItem('refresh_token')
					localStorage.removeItem('access_token')
					window.location.href = '/login/';
				}
			} else {
				localStorage.removeItem('user_id')
				localStorage.removeItem('islogin')
				localStorage.removeItem('refresh_token')
				localStorage.removeItem('access_token')
				window.location.href = '/login/';
			}
		}
		if(error.response.status === 401 &&
			error.response.statusText === 'Unauthorized')
		{
			window.location.href = '/login/';

		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;
