import axios from 'axios';

export function apiRequest(endpoint, { cancel = undefined, method = 'get', data = '', props = {} } = {}) {
  const token = localStorage.getItem('user');
  if (token) {
    return axios({
      method,
      url: `http://localhost:8080/api/${endpoint}`,
      data,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cancelToken: cancel,
      ...props
    });
  }
}