import axios from 'axios';

export function apiRequest(endpoint, { cancel = undefined, method = 'get', data = '', props = {} } = {}) {
  return axios({
    method,
    url: `/api/${endpoint}`,
    data,
    cancelToken: cancel,
    ...props
  });
}